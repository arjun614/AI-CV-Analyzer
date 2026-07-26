import React, { useState } from "react";

const ResultsTable = ({ results, onDownloadPDF }) => {
  const [sortField, setSortField] = useState("score");
  const [sortDirection, setSortDirection] = useState("desc");
  const [expandedRow, setExpandedRow] = useState(null);
  const [filterScore, setFilterScore] = useState("");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "score") {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    } else if (sortField === "experience") {
      aValue = parseInt(aValue.split(" ")[0]) || 0;
      bValue = parseInt(bValue.split(" ")[0]) || 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const filteredResults = sortedResults.filter((result) => {
    if (filterScore && result.score < parseInt(filterScore)) {
      return false;
    }
    return true;
  });

  const getScoreColor = (score) => {
    if (score >= 90)
      return {
        background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
        color: "white",
      };
    if (score >= 80)
      return {
        background: "linear-gradient(135deg, #68d391 0%, #48bb78 100%)",
        color: "white",
      };
    if (score >= 70)
      return {
        background: "linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)",
        color: "white",
      };
    if (score >= 60)
      return {
        background: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
        color: "white",
      };
    return {
      background: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
      color: "white",
    };
  };

  const getRankIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return (
        <svg
          style={{ width: "1rem", height: "1rem", color: "#a0aec0" }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
        </svg>
      );
    }

    return sortDirection === "asc" ? (
      <svg
        style={{ width: "1rem", height: "1rem", color: "#667eea" }}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1z" />
      </svg>
    ) : (
      <svg
        style={{ width: "1rem", height: "1rem", color: "#667eea" }}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M3 4a1 1 0 011-1h4a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
      </svg>
    );
  };

  const displayValue = (value, fallback = "Not specified") => {
    if (value === null || value === undefined || value === "") return fallback;
    return value;
  };

  return (
    <div className="card animate-fade-in-up">
      {/* Filters */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div>
            <label
              htmlFor="score-filter"
              style={{
                display: "block",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#4a5568",
                marginBottom: "0.5rem",
              }}
            >
              🎯 Min Score
            </label>
            <select
              id="score-filter"
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              style={{
                border: "2px solid rgba(226, 232, 240, 0.8)",
                borderRadius: "8px",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(226, 232, 240, 0.8)";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">All Scores</option>
              <option value="90">90+ Excellent</option>
              <option value="80">80+ Good</option>
              <option value="70">70+ Fair</option>
              <option value="60">60+ Basic</option>
            </select>
          </div>
        </div>
        <div
          className="skill-tag"
          style={{
            background:
              "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            color: "#667eea",
            fontSize: "0.875rem",
            padding: "0.5rem 1rem",
          }}
        >
          📊 Showing {filteredResults.length} of {results.length} candidates
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <tr>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  borderBottom: "2px solid rgba(226, 232, 240, 0.8)",
                }}
              >
                🏆 Rank
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  borderBottom: "2px solid rgba(226, 232, 240, 0.8)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleSort("fileName")}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>👤 Candidate</span>
                  <SortIcon field="fileName" />
                </div>
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  borderBottom: "2px solid rgba(226, 232, 240, 0.8)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleSort("score")}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>📊 Score</span>
                  <SortIcon field="score" />
                </div>
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  borderBottom: "2px solid rgba(226, 232, 240, 0.8)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => handleSort("experience")}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(102, 126, 234, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>💼 Experience</span>
                  <SortIcon field="experience" />
                </div>
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  borderBottom: "2px solid rgba(226, 232, 240, 0.8)",
                }}
              >
                ⚠️ Missing Skills
              </th>
              <th
                style={{
                  padding: "1rem 1.5rem",
                  textAlign: "left",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#4a5568",
                  borderBottom: "2px solid rgba(226, 232, 240, 0.8)",
                }}
              >
                ⚙️ Actions
              </th>
            </tr>
          </thead>
          <tbody style={{ background: "rgba(255, 255, 255, 0.9)" }}>
            {filteredResults.map((result, index) => {
              const safeMissingSkills = Array.isArray(result.missingSkills)
                ? result.missingSkills
                : [];
              const safeSkills = Array.isArray(result.skills)
                ? result.skills
                : [];
              const safeKeywords = Array.isArray(result.matchingKeywords)
                ? result.matchingKeywords
                : [];
              const safeStrengths = Array.isArray(result.strengths)
                ? result.strengths
                : [];
              const safeWeaknesses = Array.isArray(result.weaknesses)
                ? result.weaknesses
                : [];

              return (
                <React.Fragment key={result.id || index}>
                  <tr
                    style={{
                      transition: "all 0.3s ease",
                      background:
                        expandedRow === result.id
                          ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)"
                          : "transparent",
                      borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
                    }}
                    onMouseEnter={(e) => {
                      if (expandedRow !== result.id) {
                        e.target.style.background = "rgba(248, 250, 252, 0.8)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (expandedRow !== result.id) {
                        e.target.style.background = "transparent";
                      }
                    }}
                  >
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <span style={{ fontSize: "1.25rem" }}>
                        {getRankIcon(index)}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#2d3748",
                            fontSize: "1rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {displayValue(
                            result.fileName,
                            `Candidate ${index + 1}`,
                          ).replace(/\.pdf$/i, "")}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          {displayValue(result.education)}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <span
                        className="skill-tag"
                        style={{
                          ...getScoreColor(result.score),
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          padding: "0.5rem 1rem",
                          borderRadius: "20px",
                        }}
                      >
                        {displayValue(result.score, 0)}%
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "#2d3748",
                          fontWeight: "500",
                        }}
                      >
                        {displayValue(result.experience, "Not specified")}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {safeMissingSkills
                          .slice(0, 3)
                          .map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="skill-tag missing"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(225, 29, 72, 0.1) 100%)",
                                color: "#b91c1c",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                padding: "0.25rem 0.75rem",
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        {safeMissingSkills.length > 3 && (
                          <span
                            className="skill-tag missing"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(160, 174, 192, 0.2) 0%, rgba(113, 128, 150, 0.2) 100%)",
                              color: "#718096",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              padding: "0.25rem 0.75rem",
                            }}
                          >
                            +{safeMissingSkills.length - 3}
                          </span>
                        )}
                        {safeMissingSkills.length === 0 && (
                          <span
                            style={{
                              color: "#38a169",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                            }}
                          >
                            No missing skills
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        verticalAlign: "middle",
                      }}
                    >
                      <button
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === result.id ? null : result.id,
                          )
                        }
                        className="btn btn-secondary"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          color: "white",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          padding: "0.5rem 1rem",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-1px)";
                          e.target.style.boxShadow =
                            "0 4px 12px rgba(102, 126, 234, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        {expandedRow === result.id
                          ? "👁️ Hide Details"
                          : "🔍 View Details"}
                      </button>
                      <button
                        onClick={() => onDownloadPDF(result)}
                        className="btn btn-secondary"
                        style={{
                          background:
                            "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                          color: "white",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          padding: "0.5rem 1rem",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        📄 PDF
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedRow === result.id && (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          padding: "2rem",
                          background:
                            "linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(118, 75, 162, 0.02) 100%)",
                          borderTop: "2px solid rgba(102, 126, 234, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "2rem",
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                color: "#2d3748",
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              ⚠️ Missing Skills
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                                marginBottom: "2rem",
                              }}
                            >
                              {safeMissingSkills.length > 0 ? (
                                safeMissingSkills.map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className="skill-tag missing"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(225, 29, 72, 0.1) 100%)",
                                      color: "#b91c1c",
                                      fontSize: "0.875rem",
                                      fontWeight: "500",
                                      padding: "0.5rem 1rem",
                                    }}
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span
                                  style={{
                                    color: "#38a169",
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                  }}
                                >
                                  No missing skills detected
                                </span>
                              )}
                            </div>

                            <h4
                              style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                color: "#2d3748",
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              🎯 Matching Keywords
                            </h4>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                              }}
                            >
                              {safeKeywords.map((keyword, keywordIndex) => (
                                <span
                                  key={keywordIndex}
                                  className="skill-tag"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                                    color: "white",
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    padding: "0.5rem 1rem",
                                  }}
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>

                          

                          <div>
                            <h4
                              style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                color: "#2d3748",
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              💪 Strengths
                            </h4>
                            <ul
                              style={{
                                fontSize: "0.875rem",
                                color: "#4a5568",
                                marginBottom: "2rem",
                                lineHeight: "1.6",
                              }}
                            >
                              {safeStrengths.map((strength, strengthIndex) => (
                                <li
                                  key={strengthIndex}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#48bb78",
                                      marginRight: "0.75rem",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    ✓
                                  </span>
                                  {strength}
                                </li>
                              ))}
                            </ul>

                            <h4
                              style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                color: "#2d3748",
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              📈 Areas for Improvement
                            </h4>
                            <ul
                              style={{
                                fontSize: "0.875rem",
                                color: "#4a5568",
                                lineHeight: "1.6",
                              }}
                            >
                              {safeWeaknesses.map((weakness, weaknessIndex) => (
                                <li
                                  key={weaknessIndex}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#ed8936",
                                      marginRight: "0.75rem",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    ⚠
                                  </span>
                                  {weakness}
                                </li>
                              ))}
                            </ul>
                            <h4
                              style={{
                                fontSize: "1.125rem",
                                fontWeight: "600",
                                color: "#2d3748",
                                marginTop: "2rem",
                                marginBottom: "1rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              💡 Recommended Projects
                            </h4>

                            <ul
                              style={{
                                fontSize: "0.875rem",
                                color: "#4a5568",
                                lineHeight: "1.6",
                              }}
                            >
                              {(result.projectSuggestions || []).map(
                                (project, index) => (
                                  <li
                                    key={index}
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      marginBottom: "0.75rem",
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: "#667eea",
                                        marginRight: "0.75rem",
                                      }}
                                    >
                                      💡
                                    </span>

                                    {project}
                                  </li>
                                ),
                              )}
                            </ul>

                            
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No candidates match the current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
