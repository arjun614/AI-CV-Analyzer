const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const winston = require('winston');

const router = express.Router();

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    const filename = `${uniqueId}${extension}`;
    cb(null, filename);
  }
});

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files at once
  }
});

// Validation schema
const uploadSchema = Joi.object({
  jobDescription: Joi.string().min(50).max(5000).required().messages({
    'string.min': 'Job description must be at least 50 characters long',
    'string.max': 'Job description cannot exceed 5000 characters',
    'any.required': 'Job description is required'
  })
});

// Upload endpoint for multiple CV files
router.post('/', upload.array('cvFiles', 10), async (req, res) => {
  try {
    // Validate job description
    const { error, value } = uploadSchema.validate(req.body);
    if (error) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        req.files.forEach(file => {
          fs.unlink(file.path, (err) => {
            if (err) logger.error(`Failed to delete file: ${file.path}`);
          });
        });
      }
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }

    const { jobDescription } = value;

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please upload at least one PDF file'
      });
    }

    // Process uploaded files
    const uploadedFiles = req.files.map(file => ({
      id: path.parse(file.filename).name,
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      uploadedAt: new Date().toISOString()
    }));

    logger.info(`Successfully uploaded ${uploadedFiles.length} CV files`);

    res.status(200).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
      jobDescription: jobDescription,
      totalFiles: uploadedFiles.length,
      uploadId: uuidv4()
    });

  } catch (error) {
    logger.error('Upload error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) logger.error(`Failed to delete file: ${file.path}`);
        });
      });
    }

    res.status(500).json({
      error: 'Upload failed',
      message: 'An error occurred while uploading files'
    });
  }
});

// Get upload status
router.get('/status/:uploadId', (req, res) => {
  const { uploadId } = req.params;
  
  // In a real application, you would check the database for upload status
  // For now, we'll return a simple response
  res.json({
    uploadId,
    status: 'completed',
    timestamp: new Date().toISOString()
  });
});

// Clean up old files (utility endpoint)
router.delete('/cleanup', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    let deletedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });
    
    logger.info(`Cleaned up ${deletedCount} old files`);
    
    res.json({
      message: 'Cleanup completed',
      deletedFiles: deletedCount
    });
    
  } catch (error) {
    logger.error('Cleanup error:', error);
    res.status(500).json({
      error: 'Cleanup failed',
      message: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size cannot exceed 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Cannot upload more than 10 files at once'
      });
    }
  }
  
  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only PDF files are allowed'
    });
  }
  
  next(error);
});

module.exports = router;