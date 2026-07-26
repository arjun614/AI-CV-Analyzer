import { useState } from 'react'

const ExportResults = ({ results }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const exportToCSV = () => {
    setIsExporting(true)
    
    try {
      // Define CSV headers
      const headers = [
        'Rank',
        'Candidate Name',
        'Score',
        'Experience',
        'Education',
        'Skills',
        'Matching Keywords',
        'Strengths',
        'Areas for Improvement'
      ]

      // Convert results to CSV format
      const csvData = results.map((result, index) => [
        index + 1, // Rank
        result.fileName.replace('.pdf', ''),
        result.score,
        result.experience,
        result.education,
        result.skills.join('; '),
        result.matchingKeywords.join('; '),
        result.strengths.join('; '),
        result.weaknesses.join('; ')
      ])

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `cv-analysis-results-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setShowDropdown(false)
    } catch (error) {
      console.error('Export to CSV failed:', error)
      alert('Failed to export CSV. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJSON = () => {
    setIsExporting(true)
    
    try {
      // Prepare data for JSON export
      const exportData = {
        exportDate: new Date().toISOString(),
        totalCandidates: results.length,
        results: results.map((result, index) => ({
          rank: index + 1,
          candidateName: result.fileName.replace('.pdf', ''),
          score: result.score,
          experience: result.experience,
          education: result.education,
          skills: result.skills,
          matchingKeywords: result.matchingKeywords,
          strengths: result.strengths,
          areasForImprovement: result.weaknesses,
          analysis: {
            id: result.id,
            fileName: result.fileName
          }
        }))
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `cv-analysis-results-${new Date().toISOString().split('T')[0]}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setShowDropdown(false)
    } catch (error) {
      console.error('Export to JSON failed:', error)
      alert('Failed to export JSON. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToTXT = () => {
    setIsExporting(true)
    
    try {
      let txtContent = `CV ANALYSIS RESULTS\n`
      txtContent += `Export Date: ${new Date().toLocaleString()}\n`
      txtContent += `Total Candidates: ${results.length}\n`
      txtContent += `${'='.repeat(50)}\n\n`

      results.forEach((result, index) => {
        txtContent += `RANK #${index + 1}\n`
        txtContent += `Candidate: ${result.fileName.replace('.pdf', '')}\n`
        txtContent += `Score: ${result.score}%\n`
        txtContent += `Experience: ${result.experience}\n`
        txtContent += `Education: ${result.education}\n`
        txtContent += `Skills: ${result.skills.join(', ')}\n`
        txtContent += `Matching Keywords: ${result.matchingKeywords.join(', ')}\n`
        txtContent += `Strengths:\n${result.strengths.map(s => `  • ${s}`).join('\n')}\n`
        txtContent += `Areas for Improvement:\n${result.weaknesses.map(w => `  • ${w}`).join('\n')}\n`
        txtContent += `${'-'.repeat(30)}\n\n`
      })

      // Create and download file
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `cv-analysis-results-${new Date().toISOString().split('T')[0]}.txt`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setShowDropdown(false)
    } catch (error) {
      console.error('Export to TXT failed:', error)
      alert('Failed to export TXT. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className="btn-secondary animate-fade-in-scale"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: isExporting 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '0.75rem 1.5rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          cursor: isExporting ? 'not-allowed' : 'pointer',
          opacity: isExporting ? 0.6 : 1,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          transform: showDropdown ? 'scale(0.98)' : 'scale(1)'
        }}
        onMouseEnter={(e) => {
          if (!isExporting) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExporting) {
            e.target.style.transform = showDropdown ? 'scale(0.98)' : 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }
        }}
      >
        <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>{isExporting ? '📤 Exporting...' : '📊 Export Results'}</span>
        <svg 
          style={{ 
            width: '1rem', 
            height: '1rem',
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {showDropdown && (
        <div 
          className="animate-fade-in-up"
          style={{
            position: 'absolute',
            right: '0',
            marginTop: '0.5rem',
            width: '14rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            zIndex: 50,
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '0.5rem' }}>
            <button
              onClick={exportToCSV}
              disabled={isExporting}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                color: '#4a5568',
                background: 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!isExporting) {
                  e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                  e.target.style.color = '#667eea';
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isExporting) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#4a5568';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>📊 Export as CSV</span>
            </button>
            
            <button
              onClick={exportToJSON}
              disabled={isExporting}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                color: '#4a5568',
                background: 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!isExporting) {
                  e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                  e.target.style.color = '#667eea';
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isExporting) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#4a5568';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span>🔧 Export as JSON</span>
            </button>
            
            <button
              onClick={exportToTXT}
              disabled={isExporting}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                color: '#4a5568',
                background: 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!isExporting) {
                  e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)';
                  e.target.style.color = '#667eea';
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isExporting) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#4a5568';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
              </svg>
              <span>📄 Export as TXT</span>
            </button>
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(102, 126, 234, 0.1)',
            padding: '0.75rem 1rem',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)'
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: '#718096',
              margin: 0,
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem' }}>📋</span>
              {results.length} candidate{results.length !== 1 ? 's' : ''} will be exported
            </p>
          </div>
        </div>
      )}
      
      {/* Overlay to close dropdown */}
      {showDropdown && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            background: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(2px)'
          }}
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  )
}

export default ExportResults