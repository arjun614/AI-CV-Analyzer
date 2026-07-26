const express = require('express');
const uploadRoutes = require('./upload');
const cvAnalysisRoutes = require('./cvAnalysis');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      upload: 'active',
      analysis: 'active'
    }
  });
});

// Mount route modules
router.use('/upload', uploadRoutes);
router.use('/analyze', cvAnalysisRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    title: 'CV Analyzer API',
    version: '1.0.0',
    description: 'Advanced CV analysis and job matching API',
    endpoints: {
      'POST /api/upload': {
        description: 'Upload CV files for analysis',
        accepts: 'multipart/form-data',
        maxFiles: 10,
        maxSize: '10MB per file',
        supportedFormats: ['PDF']
      },
      'POST /api/analyze': {
        description: 'Analyze uploaded CVs against job description',
        accepts: 'application/json',
        required: ['files', 'jobDescription'],
        returns: 'Analysis results with scores and insights'
      },
      'GET /api/upload/status/:uploadId': {
        description: 'Check upload status',
        returns: 'Upload status and file information'
      },
      'DELETE /api/upload/cleanup/:uploadId': {
        description: 'Clean up uploaded files',
        returns: 'Cleanup confirmation'
      },
      'GET /api/analyze/stats': {
        description: 'Get analysis capabilities and statistics',
        returns: 'Supported skills and features'
      },
      'GET /api/health': {
        description: 'API health check',
        returns: 'Service status'
      }
    },
    features: [
      'Advanced NLP-based CV analysis',
      'Multi-category skill extraction',
      'Job matching with similarity scoring',
      'Experience level assessment',
      'Automated insights and recommendations',
      'Bulk CV processing',
      'Secure file handling',
      'Rate limiting and validation'
    ]
  });
});

module.exports = router;