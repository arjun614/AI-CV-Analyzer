import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import FloatingElements from './components/FloatingElements';
import ResultsTable from './components/ResultsTable';

// Particle component for floating elements
const Particle = ({ x, y, size, speed, color }) => {
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x + Math.sin(Date.now() * 0.001 + x) * 0.5,
        y: prev.y - speed
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [x, speed]);

  return (
    <div
      className="particle"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        opacity: 0.6,
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'all 0.05s ease-out'
      }}
    />
  );
};

function App() {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [selectedCV, setSelectedCV] = useState(null);
  const [pendingPrint, setPendingPrint] = useState(false);
  const [printCV, setPrintCV] = useState(null);

  // Debug analysis state changes
  useEffect(() => {
    console.log('Analysis state changed:', analysis);
  }, [analysis]);

  // Trigger window.print() once selectedCV has been set and the
  // hidden .print-report DOM node has had a chance to render.
  useEffect(() => {
    if (printCV && pendingPrint) {
      const timer = setTimeout(() => {
        window.print();
        setPendingPrint(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [printCV, pendingPrint]);

  const handleDownloadPDF = (cv) => {
    setPrintCV(cv);
    setPendingPrint(true);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => file.type === 'application/pdf');

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setError('');
    } else {
      setError('Please select valid PDF files');
      setFiles([]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(event.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => file.type === 'application/pdf');

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setError('');
    } else {
      setError('Please drop valid PDF files');
    }
  };

  const handleAnalyze = async () => {
    console.log('handleAnalyze called');
    console.log('files:', files);
    console.log('jobDescription:', jobDescription);

    if (files.length === 0 || !jobDescription.trim()) {
      setError('Please provide both CV files and job description');
      return;
    }

    if (jobDescription.trim().length < 50) {
      setError('Job description must be at least 50 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      // First, upload the files
      const formData = new FormData();
      files.forEach(file => {
        formData.append('cvFiles', file);
      });
      formData.append('jobDescription', jobDescription);

      console.log('Uploading files...');
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorData}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('Upload successful:', uploadResult);

      // Then analyze the uploaded files
      const analysisPayload = {
        files: uploadResult.files.map(file => ({
          id: file.id,
          path: file.path,
          originalName: file.originalName
        })),
        jobDescription: jobDescription
      };

      console.log('Analyzing files with payload:', analysisPayload);
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisPayload),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.text();
        throw new Error(`Analysis failed: ${errorData}`);
      }

      const analysisResult = await analysisResponse.json();
      console.log('Analysis successful:', analysisResult);

      const resultsWithRanking = (analysisResult.results || analysisResult.analysis || [])
        .sort((a, b) => b.score - a.score)
        .map((cv, index) => ({
          ...cv,
          id: cv.id || cv.fileName || cv.filename || `candidate-${index + 1}`,
          rank: index + 1,
          fileName: cv.fileName || cv.filename || `Candidate ${index + 1}`,
          skills: Array.isArray(cv.skills) ? cv.skills : [],
          missingSkills: Array.isArray(cv.missingSkills) ? cv.missingSkills : [],
          matchingKeywords: Array.isArray(cv.matchingKeywords) ? cv.matchingKeywords : [],
          strengths: Array.isArray(cv.strengths) ? cv.strengths : [],
          weaknesses: Array.isArray(cv.weaknesses) ? cv.weaknesses : []
        }));

      console.log('Setting analysis state to:', resultsWithRanking);
      setAnalysis(resultsWithRanking);
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(`Analysis failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
    setJobDescription('');
    setAnalysis(null);
    setError('');
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Needs Improvement';
  };

  return (
    <div className="app">
      <FloatingElements />

      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="title-section">
              <h1 className="title">
                <span className="title-icon">🎯</span>
                <span className="title-text">
                  <span className="title-main">CV Analyzer</span>
                  <span className="title-sub">AI-Powered</span>
                </span>
              </h1>
              <p className="subtitle">
                Transform your career with intelligent CV analysis and job matching
              </p>
            </div>
            <div className="header-decoration">
              <div className="floating-icon">✨</div>
              <div className="floating-icon">🚀</div>
              <div className="floating-icon">💼</div>
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="upload-section">
            <div className="upload-container">
              <div
                className={`file-upload ${files.length > 0 ? 'has-file' : ''} ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div className="upload-content">
                  <div className="upload-visual">
                    {files.length > 0 ? (
                      <div className="files-preview">
                        <div className="files-header">
                          <div className="files-icon-large">📄</div>
                          <div className="files-count">{files.length} file{files.length > 1 ? 's' : ''} selected</div>
                        </div>
                        <div className="files-list">
                          {files.map((file, index) => (
                            <div key={index} className="file-item">
                              <div className="file-name">{file.name}</div>
                              <div className="file-size">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="file-status">✅ Ready to analyze</div>
                      </div>
                    ) : (
                      <div className="upload-prompt">
                        <div className="upload-icon-large">📁</div>
                        <div className="upload-text-primary">
                          Drop your CVs here or click to browse
                        </div>
                        <div className="upload-text-secondary">
                          PDF files only • Max 10MB each • Multiple files supported
                        </div>
                        <div className="upload-features">
                          <span className="feature-tag">🔍 AI Analysis</span>
                          <span className="feature-tag">⚡ Bulk Processing</span>
                          <span className="feature-tag">🎯 Smart Matching</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedCV && (
              <>
                <div className="detailed-dashboard">
                  <div className="dashboard-header">
                    <div className="dashboard-title">
                      <h2>
                        <span className="dashboard-icon">📊</span>
                        Detailed Analysis Dashboard
                      </h2>
                      <div className="cv-name-badge">{selectedCV.fileName || selectedCV.filename || 'CV Analysis'}</div>
                    </div>
                    <button
                      className="close-dashboard-btn"
                      onClick={() => setSelectedCV(null)}
                    >
                      <span>✕</span>
                    </button>
                  </div>

                  <div className="dashboard-content">
                    <div className="dashboard-grid">
                      {/* Score Overview */}
                      <div className="dashboard-card score-overview">
                        <h3 className="card-title">
                          <span className="card-icon">🎯</span>
                          Score Overview
                        </h3>
                        <div className="score-table">
                          <table>
                            <tbody>
                              <tr>
                                <td className="metric-label">Overall Score</td>
                                <td className="metric-value score-highlight">{selectedCV.score}%</td>
                              </tr>
                              {selectedCV.breakdown && Object.entries(selectedCV.breakdown).map(([key, value]) => (
                                <tr key={key}>
                                  <td className="metric-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                                  <td className="metric-value">{value}%</td>
                                </tr>
                              ))}
                              <tr>
                                <td className="metric-label">Rank</td>
                                <td className="metric-value rank-badge">#{selectedCV.rank || 1}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Skills Analysis */}
                      <div className="dashboard-card skills-analysis">
                        <h3 className="card-title">
                          <span className="card-icon">🛠️</span>
                          Skills Analysis
                        </h3>
                        <div className="skills-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Skills</th>
                                <th>Count</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="category-label">Technical Skills</td>
                                <td className="skills-list">
                                  {selectedCV.technicalSkills && selectedCV.technicalSkills.length > 0 ? (
                                    <div className="skill-tags">
                                      {selectedCV.technicalSkills.map((skill, idx) => (
                                        <span key={idx} className="skill-tag">{skill}</span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="no-data">None detected</span>
                                  )}
                                </td>
                                <td className="count-value">{selectedCV.technicalSkills?.length || 0}</td>
                              </tr>
                              <tr>
                                <td className="category-label">Soft Skills</td>
                                <td className="skills-list">
                                  {selectedCV.softSkills && selectedCV.softSkills.length > 0 ? (
                                    <div className="skill-tags">
                                      {selectedCV.softSkills.map((skill, idx) => (
                                        <span key={idx} className="skill-tag soft">{skill}</span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="no-data">None detected</span>
                                  )}
                                </td>
                                <td className="count-value">{selectedCV.softSkills?.length || 0}</td>
                              </tr>
                              <tr>
                                <td className="category-label">Matching Keywords</td>
                                <td className="skills-list">
                                  {selectedCV.matchingKeywords && selectedCV.matchingKeywords.length > 0 ? (
                                    <div className="skill-tags">
                                      {selectedCV.matchingKeywords.map((keyword, idx) => (
                                        <span key={idx} className="skill-tag matching">{keyword}</span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="no-data">None found</span>
                                  )}
                                </td>
                                <td className="count-value">{selectedCV.matchingKeywords?.length || 0}</td>
                              </tr>
                              <tr>
                                <td className="category-label">Missing Skills</td>
                                <td className="skills-list">
                                  {selectedCV.missingSkills && selectedCV.missingSkills.length > 0 ? (
                                    <div className="skill-tags">
                                      {selectedCV.missingSkills.map((skill, idx) => (
                                        <span key={idx} className="skill-tag missing">{skill}</span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="no-data">None identified</span>
                                  )}
                                </td>
                                <td className="count-value">{selectedCV.missingSkills?.length || 0}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Experience & Background */}
                      <div className="dashboard-card experience-background">
                        <h3 className="card-title">
                          <span className="card-icon">💼</span>
                          Experience & Background
                        </h3>
                        <div className="experience-table">
                          <table>
                            <tbody>
                              <tr>
                                <td className="metric-label">Experience Level</td>
                                <td className="metric-value">{selectedCV.experience || 'Not specified'}</td>
                              </tr>
                              <tr>
                                <td className="metric-label">Education</td>
                                <td className="metric-value">{selectedCV.education || 'Not specified'}</td>
                              </tr>
                              <tr>
                                <td className="metric-label">Companies</td>
                                <td className="metric-value">
                                  {selectedCV.companies && selectedCV.companies.length > 0 ? (
                                    <div className="company-list">
                                      {selectedCV.companies.map((company, idx) => (
                                        <span key={idx} className="company-tag">{company}</span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="no-data">None detected</span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="metric-label">Job Titles</td>
                                <td className="metric-value">
                                  {selectedCV.jobTitles && selectedCV.jobTitles.length > 0 ? (
                                    <div className="title-list">
                                      {selectedCV.jobTitles.map((title, idx) => (
                                        <span key={idx} className="title-tag">{title}</span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="no-data">None detected</span>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="dashboard-card strengths-weaknesses">
                        <h3 className="card-title">
                          <span className="card-icon">⚖️</span>
                          Strengths & Areas for Improvement
                        </h3>
                        <div className="traits-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Type</th>
                                <th>Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="trait-type strengths-label">
                                  <span className="trait-icon">💪</span>
                                  Strengths
                                </td>
                                <td className="trait-details">
                                  {selectedCV.strengths && selectedCV.strengths.length > 0 ? (
                                    <ul className="trait-list">
                                      {selectedCV.strengths.map((strength, idx) => (
                                        <li key={idx} className="trait-item positive">{strength}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="no-data">None identified</span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="trait-type weaknesses-label">
                                  <span className="trait-icon">🎯</span>
                                  Areas for Improvement
                                </td>
                                <td className="trait-details">
                                  {selectedCV.weaknesses && selectedCV.weaknesses.length > 0 ? (
                                    <ul className="trait-list">
                                      {selectedCV.weaknesses.map((weakness, idx) => (
                                        <li key={idx} className="trait-item improvement">{weakness}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span className="no-data">None identified</span>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="job-description-section">
              <div className="input-group">
                <label htmlFor="jobDescription" className="label">
                  <span className="label-icon">💼</span>
                  Job Description
                  <span className="label-badge">Required</span>
                </label>
                <div className="textarea-container">
                  <textarea
                    id="jobDescription"
                    className="job-description-input"
                    placeholder="Paste the complete job description here...Include requirements, responsibilities, and desired skills for the most accurate analysis."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={8}
                  />
                  <div className="textarea-footer">
                    <span className="char-count">
                      {jobDescription.length} characters
                    </span>
                    <span className="textarea-hint">
                      💡 More details = Better analysis
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-section">
              <div className="action-buttons">
                <button
                  className="analyze-button"
                  onClick={handleAnalyze}
                  disabled={loading || files.length === 0 || !jobDescription.trim()}
                >
                  <div className="button-content">
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span className="button-text">Analyzing...</span>
                        <div className="loading-dots">
                          <span></span><span></span><span></span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="button-icon">🔍</span>
                        <span className="button-text">Analyze CV{files.length > 1 ? 's' : ''}</span>
                        <span className="button-arrow">→</span>
                      </>
                    )}
                  </div>
                </button>

                <button
                  className="reset-button"
                  onClick={resetForm}
                  disabled={loading}
                >
                  <span className="button-icon">🔄</span>
                  <span className="button-text">Reset</span>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-content">
                <span className="error-icon">⚠️</span>
                <span className="error-text">{error}</span>
                <button className="error-close" onClick={() => setError('')}>×</button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="results-title">
                  <span className="results-icon">📊</span>
                  Analysis Results
                  <span className="results-badge">AI-Powered</span>
                </h2>
                <div className="results-summary">
                  {Array.isArray(analysis) ? `Ranked analysis of ${analysis.length} CVs` : 'Comprehensive analysis completed in seconds'}
                </div>
              </div>

              {Array.isArray(analysis) ? (
                <ResultsTable results={analysis} onDownloadPDF={handleDownloadPDF} />
              ) : (
                <div className="results-grid">
                  <div className="result-card score-card">
                    <div className="score-header">
                      <h3 className="score-title">
                        <span className="score-icon">🎯</span>
                        Match Score
                      </h3>
                      <div className="score-label">{getScoreLabel(analysis.score)}</div>
                    </div>
                    <div className="score-display">
                      <div className="score-circle">
                        <svg className="score-ring" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${analysis.score * 3.14} 314`}
                            transform="rotate(-90 60 60)"
                          />
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#667eea" />
                              <stop offset="100%" stopColor="#764ba2" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="score-number">{analysis.score}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="result-card skills-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span className="card-icon">🎯</span>
                        Skills Found
                      </h3>
                      <div className="skills-count">
                        {analysis.skills?.length || 0} detected
                      </div>
                    </div>
                    <div className="skills-container">
                      {analysis.skills && analysis.skills.length > 0 ? (
                        <div className="skills-list">
                          {analysis.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              <span className="skill-text">{skill}</span>
                              <span className="skill-check">✓</span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="no-data">
                          <span className="no-data-icon">🔍</span>
                          <span className="no-data-text">No skills detected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="result-card experience-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span className="card-icon">💼</span>
                        Experience
                      </h3>
                      <div className="experience-count">
                        {analysis.experience?.length || 0} items
                      </div>
                    </div>
                    <div className="experience-container">
                      {analysis.experience && analysis.experience.length > 0 ? (
                        <div className="experience-list">
                          {analysis.experience.map((exp, index) => (
                            <div key={index} className="experience-item">
                              <div className="experience-bullet">•</div>
                              <div className="experience-text">{exp}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-data">
                          <span className="no-data-icon">📋</span>
                          <span className="no-data-text">No experience detected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="result-card recommendations-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <span className="card-icon">💡</span>
                        Recommendations
                      </h3>
                      <div className="recommendations-badge">AI Insights</div>
                    </div>
                    <div className="recommendations-container">
                      {analysis.recommendations && analysis.recommendations.length > 0 ? (
                        <div className="recommendations-list">
                          {analysis.recommendations.map((rec, index) => (
                            <div key={index} className="recommendation-item">
                              <span className="recommendation-icon">💡</span>
                              <span className="recommendation-text">{rec}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="recommendation-item success">
                          <span className="recommendation-icon">✅</span>
                          <span className="recommendation-text">
                            Excellent! Your CV shows a strong match for this position.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="results-footer">
                <div className="analysis-info">
                  <span className="analysis-time">⚡ Analysis completed in seconds</span>
                  <span className="analysis-accuracy">🎯 AI-powered accuracy</span>
                </div>
                <button
                  className="download-report"
                  onClick={() => handleDownloadPDF(Array.isArray(analysis) ? analysis[0] : analysis)}
                >
                  <span className="button-icon">📄</span>
                  {Array.isArray(analysis) ? 'Download Top Candidate' : 'Download Report'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rendered as a direct child of .app so the print stylesheet's
          `.app > *:not(.print-report) { display: none }` rule can hide
          everything else while this stays visible when printing. */}
      {printCV && (
        <div className="print-report" aria-hidden="true">
          <div className="report-page">
            <header className="report-header">
              <h1>{(printCV.fileName || printCV.filename || 'Candidate Analysis').replace(/\.pdf$/i, '')}</h1>
              <p>Complete CV analysis report including strengths, weaknesses, missing skills, and improvement recommendations.</p>
            </header>

            <section className="report-section report-summary">
              <h2>Summary</h2>
              <table>
                <tbody>
                  <tr>
                    <th>Overall Score</th>
                    <td>{printCV.score}%</td>
                  </tr>
                  <tr>
                    <th>Rank</th>
                    <td>#{printCV.rank || 1}</td>
                  </tr>
                  <tr>
                    <th>Experience</th>
                    <td>{printCV.experience || 'Not specified'}</td>
                  </tr>
                  <tr>
                    <th>Education</th>
                    <td>{printCV.education || 'Not specified'}</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="report-section">
              <h2>Skills Analysis</h2>
              <div className="report-tags-row">
                <div>
                  <h3>Technical Skills</h3>
                  {(printCV.technicalSkills && printCV.technicalSkills.length > 0) ? (
                    <div className="report-tags">
                      {printCV.technicalSkills.map((skill, idx) => (
                        <span key={idx} className="report-tag">{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">None detected</p>
                  )}
                </div>
                <div>
                  <h3>Soft Skills</h3>
                  {(printCV.softSkills && printCV.softSkills.length > 0) ? (
                    <div className="report-tags">
                      {printCV.softSkills.map((skill, idx) => (
                        <span key={idx} className="report-tag">{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">None detected</p>
                  )}
                </div>
              </div>
              <div className="report-tags-row">
                <div>
                  <h3>Matching Keywords</h3>
                  {(printCV.matchingKeywords && printCV.matchingKeywords.length > 0) ? (
                    <div className="report-tags">
                      {printCV.matchingKeywords.map((keyword, idx) => (
                        <span key={idx} className="report-tag matching">{keyword}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">None found</p>
                  )}
                </div>
                <div>
                  <h3>Missing Skills</h3>
                  {(printCV.missingSkills && printCV.missingSkills.length > 0) ? (
                    <div className="report-tags">
                      {printCV.missingSkills.map((skill, idx) => (
                        <span key={idx} className="report-tag missing">{skill}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">None identified</p>
                  )}
                </div>
              </div>
            </section>

            <section className="report-section">
              <h2>Strengths</h2>
              {printCV.strengths && printCV.strengths.length > 0 ? (
                <ul className="report-list">
                  {printCV.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No strengths identified.</p>
              )}
            </section>

            <section className="report-section">
              <h2>Areas for Improvement</h2>
              {printCV.weaknesses && printCV.weaknesses.length > 0 ? (
                <ul className="report-list">
                  {printCV.weaknesses.map((weakness, idx) => (
                    <li key={idx}>{weakness}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No improvement areas detected.</p>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
