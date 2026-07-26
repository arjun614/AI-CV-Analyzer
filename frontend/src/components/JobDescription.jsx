import { useState } from 'react'

const JobDescription = ({ value, onChange, disabled }) => {
  const [charCount, setCharCount] = useState(value.length)
  const maxChars = 2000

  const handleChange = (e) => {
    const newValue = e.target.value
    if (newValue.length <= maxChars) {
      onChange(newValue)
      setCharCount(newValue.length)
    }
  }

  const handleClear = () => {
    onChange('')
    setCharCount(0)
  }

  const sampleJobs = [
    {
      title: 'Frontend Developer',
      description: 'We are looking for a skilled Frontend Developer with experience in React, JavaScript, and modern web technologies. The ideal candidate should have 3+ years of experience building responsive web applications, knowledge of state management (Redux/Context), and familiarity with testing frameworks. Experience with TypeScript and Next.js is a plus.'
    },
    {
      title: 'Full Stack Developer',
      description: 'Seeking a Full Stack Developer proficient in both frontend and backend technologies. Required skills include React, Node.js, Express, MongoDB/PostgreSQL, and RESTful API development. The candidate should have experience with cloud platforms (AWS/Azure), Docker, and CI/CD pipelines. 4+ years of experience preferred.'
    },
    {
      title: 'Data Scientist',
      description: 'Looking for a Data Scientist with strong analytical skills and experience in Python, R, SQL, and machine learning frameworks (TensorFlow, PyTorch, Scikit-learn). The role involves building predictive models, data visualization, and working with big data technologies. PhD or Masters in relevant field preferred with 2+ years of industry experience.'
    }
  ]

  const loadSample = (description) => {
    onChange(description)
    setCharCount(description.length)
  }

  return (
    <div className="card animate-fade-in-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>💼 Job Description</h3>
        {value && (
          <button
            onClick={handleClear}
            disabled={disabled}
            className="btn btn-secondary"
            style={{
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              color: 'white',
              border: 'none',
              opacity: disabled ? '0.5' : '1',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            🗑️ Clear
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label htmlFor="job-description" style={{ display: 'block', fontSize: '1rem', fontWeight: '600', color: '#4a5568', marginBottom: '0.75rem' }}>
            📝 Enter the job requirements and description
          </label>
          <textarea
            id="job-description"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            placeholder="Paste the job description here or describe the ideal candidate profile, required skills, experience level, and qualifications..."
            style={{
              width: '100%',
              height: '10rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '2px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '12px',
              fontSize: '0.95rem',
              lineHeight: '1.6',
              resize: 'none',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              opacity: disabled ? '0.5' : '1',
              cursor: disabled ? 'not-allowed' : 'text'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea'
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
              e.target.style.background = 'rgba(255, 255, 255, 1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)'
              e.target.style.boxShadow = 'none'
              e.target.style.background = 'rgba(255, 255, 255, 0.9)'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              💡 Provide detailed requirements for better matching accuracy
            </p>
            <span className="skill-tag" style={{
              background: charCount > maxChars * 0.9 ? 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)' : 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              color: charCount > maxChars * 0.9 ? 'white' : '#667eea',
              fontSize: '0.8rem',
              padding: '0.25rem 0.75rem'
            }}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        {/* Sample Job Descriptions */}
        {!value && (
          <div className="animate-fade-in-scale">
            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#4a5568', marginBottom: '1rem' }}>🎯 Or try a sample job description:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sampleJobs.map((job, index) => (
                <button
                  key={index}
                  onClick={() => loadSample(job.description)}
                  disabled={disabled}
                  className="animate-fade-in-up"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '1rem 1.25rem',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                    border: '2px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? '0.5' : '1',
                    backdropFilter: 'blur(10px)',
                    animationDelay: `${index * 0.1}s`
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled) {
                      e.target.style.borderColor = '#667eea'
                      e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = 'rgba(226, 232, 240, 0.8)'
                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                    {job.description.substring(0, 120)}...
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="animate-fade-in-up" style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
          border: '2px solid rgba(102, 126, 234, 0.2)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#667eea', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            💡 Tips for better results:
          </h4>
          <ul style={{ fontSize: '0.875rem', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '0.5rem', lineHeight: '1.6' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#667eea', fontWeight: '600' }}>•</span>
              Include specific technical skills and technologies
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#667eea', fontWeight: '600' }}>•</span>
              Mention required experience level and years
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#667eea', fontWeight: '600' }}>•</span>
              Add educational requirements if applicable
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#667eea', fontWeight: '600' }}>•</span>
              Describe soft skills and personality traits
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#667eea', fontWeight: '600' }}>•</span>
              Include industry-specific keywords
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default JobDescription