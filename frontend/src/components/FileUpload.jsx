import { useState, useCallback } from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'

const FileUpload = ({ files, onFilesUpload, onRemoveFile, disabled }) => {
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = useCallback((fileList) => {
    const validFiles = []
    const errors = []

    Array.from(fileList).forEach(file => {
      // Validate file type
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Check file size (max 10MB)
        if (file.size <= 10 * 1024 * 1024) {
          validFiles.push({
            id: Date.now() + Math.random(),
            file,
            name: file.name,
            size: file.size,
            type: file.type
          })
        } else {
          errors.push(`${file.name}: File too large (max 10MB)`)
        }
      } else {
        errors.push(`${file.name}: Only PDF files are supported`)
      }
    })

    if (errors.length > 0) {
      alert('Some files were not uploaded:\n' + errors.join('\n'))
    }

    if (validFiles.length > 0) {
      onFilesUpload(validFiles)
    }
  }, [onFilesUpload])

  const [{ isOver }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item) => {
      if (item.files && item.files.length > 0) {
        handleFiles(item.files)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })

  const handleFileInput = useCallback((event) => {
    const fileList = event.target.files
    if (fileList && fileList.length > 0) {
      handleFiles(fileList)
    }
    // Reset input value to allow selecting the same file again
    event.target.value = ''
  }, [handleFiles])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="card animate-fade-in-up">
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>📁 Upload CV Files</h3>
      
      {/* Drop Zone */}
      <div
        ref={drop}
        className={`upload-zone ${
          isOver || dragOver ? 'dragover' : ''
        }`}
        style={{
          opacity: disabled ? '0.5' : '1',
          cursor: disabled ? 'not-allowed' : 'pointer',
          pointerEvents: disabled ? 'none' : 'auto'
        }}
        onDragEnter={() => !disabled && setDragOver(true)}
        onDragLeave={() => setDragOver(false)}
        onDrop={() => setDragOver(false)}
        onClick={() => !disabled && document.getElementById('file-input').click()}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>☁️</div>
          <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.5rem' }}>
            {isOver || dragOver ? '📥 Drop files here' : '🚀 Drag & drop CV files here'}
          </p>
          <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '1rem' }}>or click to browse your files</p>
          <div className="skill-tag" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
            📄 PDF files up to 10MB each
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        id="file-input"
        type="file"
        multiple
        accept=".pdf,application/pdf"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {files.length > 0 && (
        <div style={{ marginTop: '2rem' }} className="animate-fade-in-scale">
          <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
            📋 Uploaded Files ({files.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '15rem', overflowY: 'auto' }}>
            {files.map((file, index) => (
              <div
                key={file.id}
                className="animate-fade-in-up"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '1rem 1.25rem', 
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>📄</div>
                  <div>
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  disabled={disabled}
                  style={{
                    background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? '0.5' : '1',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Remove file"
                  onMouseEnter={(e) => {
                    if (!disabled) {
                      e.target.style.transform = 'scale(1.1)'
                      e.target.style.boxShadow = '0 4px 12px rgba(245, 101, 101, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🗑️</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload