const AnalysisProgress = ({ progress }) => {
  const getProgressColor = () => {
    if (progress < 30) return 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)'
    if (progress < 70) return 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)'
    return 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
  }

  const getProgressMessage = () => {
    if (progress < 20) return 'Extracting text from PDFs...'
    if (progress < 40) return 'Analyzing skills and experience...'
    if (progress < 60) return 'Matching against job requirements...'
    if (progress < 80) return 'Calculating compatibility scores...'
    if (progress < 95) return 'Ranking candidates...'
    return 'Finalizing results...'
  }

  return (
    <div className="card animate-fade-in-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⚡ Analysis Progress</h3>
        <span className="skill-tag" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '1rem',
          fontWeight: '600',
          padding: '0.5rem 1rem'
        }}>{Math.round(progress)}%</span>
      </div>
      
      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '1rem',
        background: 'linear-gradient(135deg, rgba(226, 232, 240, 0.8) 0%, rgba(203, 213, 224, 0.8) 100%)',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        overflow: 'hidden',
        position: 'relative',
        backdropFilter: 'blur(10px)'
      }}>
        <div
          style={{
            height: '100%',
            background: getProgressColor(),
            borderRadius: '12px',
            width: `${progress}%`,
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite'
          }}></div>
        </div>
      </div>
      
      {/* Progress Message */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div className="spinner" style={{
          width: '1.5rem',
          height: '1.5rem',
          border: '3px solid rgba(102, 126, 234, 0.2)',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontSize: '1rem', color: '#4a5568', fontWeight: '500' }}>{getProgressMessage()}</p>
      </div>
      
      {/* Progress Steps */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: progress >= 20 ? '#667eea' : '#a0aec0',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              marginBottom: '0.5rem',
              background: progress >= 20 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
              transition: 'all 0.3s ease',
              boxShadow: progress >= 20 ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
            }}></div>
            <span style={{ fontWeight: '600' }}>📄 Extract</span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: progress >= 40 ? '#667eea' : '#a0aec0',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              marginBottom: '0.5rem',
              background: progress >= 40 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
              transition: 'all 0.3s ease',
              boxShadow: progress >= 40 ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
            }}></div>
            <span style={{ fontWeight: '600' }}>🔍 Analyze</span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: progress >= 60 ? '#667eea' : '#a0aec0',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              marginBottom: '0.5rem',
              background: progress >= 60 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
              transition: 'all 0.3s ease',
              boxShadow: progress >= 60 ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
            }}></div>
            <span style={{ fontWeight: '600' }}>🎯 Match</span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: progress >= 80 ? '#667eea' : '#a0aec0',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              marginBottom: '0.5rem',
              background: progress >= 80 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
              transition: 'all 0.3s ease',
              boxShadow: progress >= 80 ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
            }}></div>
            <span style={{ fontWeight: '600' }}>📊 Score</span>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: progress >= 100 ? '#667eea' : '#a0aec0',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              width: '1rem',
              height: '1rem',
              borderRadius: '50%',
              marginBottom: '0.5rem',
              background: progress >= 100 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
              transition: 'all 0.3s ease',
              boxShadow: progress >= 100 ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
            }}></div>
            <span style={{ fontWeight: '600' }}>🏆 Rank</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisProgress