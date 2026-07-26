const { analyzeResume } = require("../services/geminiService");
const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const natural = require('natural');
const nlp = require('compromise');
const keyword = require('keyword-extractor');
const stringSimilarity = require('string-similarity');
const Joi = require('joi');
const winston = require('winston');

const router = express.Router();

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Initialize NLP tools
const stemmer = natural.PorterStemmer;
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

// Comprehensive skill databases
const TECH_SKILLS = {
  programming: [
    'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift',
    'kotlin', 'typescript', 'scala', 'perl', 'r', 'matlab', 'sql', 'html', 'css',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
    'laravel', 'rails', 'asp.net', 'jquery', 'bootstrap', 'sass', 'less'
  ],
  databases: [
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
    'oracle', 'sqlite', 'mariadb', 'dynamodb', 'firebase', 'couchdb'
  ],
  cloud: [
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible',
    'jenkins', 'gitlab', 'github actions', 'circleci', 'travis ci'
  ],
  tools: [
    'git', 'jira', 'confluence', 'slack', 'trello', 'asana', 'figma', 'sketch',
    'photoshop', 'illustrator', 'postman', 'swagger', 'webpack', 'babel'
  ],
  methodologies: [
    'agile', 'scrum', 'kanban', 'devops', 'ci/cd', 'tdd', 'bdd', 'microservices',
    'rest api', 'graphql', 'soap', 'mvc', 'mvvm', 'solid principles'
  ]
};

const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'problem solving', 'problem-solving',
  'analytical thinking', 'creativity', 'adaptability', 'time management', 'project management',
  'critical thinking', 'collaboration', 'mentoring', 'presentation skills'
];

const COOKING_SKILLS = [
  'cooking', 'chef', 'culinary', 'kitchen', 'food preparation', 'menu planning',
  'food safety', 'restaurant', 'hospitality', 'catering', 'baking', 'grilling',
  'food service', 'recipe', 'ingredients', 'food presentation', 'inventory management'
];

const NON_TECH_INDICATORS = [
  ...COOKING_SKILLS,
  'sales', 'marketing', 'retail', 'customer service', 'accounting', 'finance',
  'human resources', 'administration', 'logistics', 'manufacturing'
];

const EXPERIENCE_KEYWORDS = [
  'years', 'experience', 'worked', 'developed', 'managed', 'led', 'created',
  'implemented', 'designed', 'built', 'maintained', 'optimized', 'improved'
];

// Validation schema
const analysisSchema = Joi.object({
  files: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      path: Joi.string().required(),
      originalName: Joi.string().required()
    })
  ).min(1).required(),
  jobDescription: Joi.string().min(50).max(5000).required()
});

function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s+#.-]/g, ' ') 
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSkills(text) {
  const preprocessedText = preprocessText(text);
  const doc = nlp(preprocessedText);
  
  // Extract keywords
  const extractedKeywords = keyword.extract(preprocessedText, {
    language: 'english',
    remove_digits: false,
    return_changed_case: true,
    remove_duplicates: true
  });
  
  // Find technical skills
  const foundTechSkills = [];
  const foundSoftSkills = [];
  
  // Check against skill databases
  Object.values(TECH_SKILLS).flat().forEach(skill => {
    const skillRegex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (skillRegex.test(preprocessedText)) {
      foundTechSkills.push(skill);
    }
  });
  
  SOFT_SKILLS.forEach(skill => {
    const skillRegex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (skillRegex.test(preprocessedText)) {
      foundSoftSkills.push(skill);
    }
  });
  
  // Extract entities (organizations, technologies)
  const entities = doc.match('#Organization').out('array')
    .concat(doc.match('#Technology').out('array'))
    .concat(doc.match('#Product').out('array'));
  
  return {
    technical: [...new Set(foundTechSkills)],
    soft: [...new Set(foundSoftSkills)],
    keywords: extractedKeywords.slice(0, 20), // Top 20 keywords
    entities: [...new Set(entities)]
  };
}

// Extract experience information
function extractExperience(text) {
  const doc = nlp(text);
  const preprocessedText = preprocessText(text);
  

  const yearMatches = preprocessedText.match(/(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi) || [];
  const years = yearMatches.map(match => {
    const num = match.match(/\d+/);
    return num ? parseInt(num[0]) : 0;
  });
  
  const maxYears = years.length > 0 ? Math.max(...years) : 0;
  
 
  const jobTitles = doc.match('#JobTitle').out('array');
  const companies = doc.match('#Organization').out('array');
  

  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'diploma'];
  const education = educationKeywords.filter(keyword => 
    new RegExp(`\\b${keyword}\\b`, 'i').test(preprocessedText)
  );
  
  return {
    years: maxYears,
    jobTitles: jobTitles.slice(0, 5),
    companies: companies.slice(0, 5),
    education: education
  };
}


function calculateJobMatch(cvSkills, cvExperience, jobDescription) {
  const jobSkills = extractSkills(jobDescription);
  const jobText = preprocessText(jobDescription);

  const techSkillOverlap = cvSkills.technical.filter(skill => 
    jobSkills.technical.includes(skill)
  );
  
  const softSkillOverlap = cvSkills.soft.filter(skill => 
    jobSkills.soft.includes(skill)
  );
  

  const cvKeywords = cvSkills.keywords.join(' ');
  const jobKeywords = jobSkills.keywords.join(' ');
  const keywordSimilarity = stringSimilarity.compareTwoStrings(cvKeywords, jobKeywords);
  
  // Calculate TF-IDF similarity
  const tfidf = new TfIdf();
  tfidf.addDocument(cvKeywords);
  tfidf.addDocument(jobKeywords);
  
  const cvVector = [];
  const jobVector = [];
  
  tfidf.listTerms(0).forEach(item => {
    cvVector.push(item.tfidf);
  });
  
  tfidf.listTerms(1).forEach(item => {
    jobVector.push(item.tfidf);
  });
  
  // Check for field mismatch
  const cvText = cvSkills.keywords.join(' ').toLowerCase();
  const jobDescText = jobDescription.toLowerCase();
  
  const cvHasCookingTerms = COOKING_SKILLS.some(skill => cvText.includes(skill));
  const jobHasCookingTerms = COOKING_SKILLS.some(skill => jobDescText.includes(skill));
  const cvHasTechTerms = cvSkills.technical.length > 2;
  const jobHasTechTerms = jobSkills.technical.length > 2;
  
  // Calculate weighted score with stricter criteria
  const techSkillScore = (techSkillOverlap.length / Math.max(jobSkills.technical.length, 1)) * 50;
  const softSkillScore = (softSkillOverlap.length / Math.max(jobSkills.soft.length, 1)) * 15;
  const keywordScore = keywordSimilarity * 20;
  const experienceScore = Math.min(cvExperience.years / 5, 1) * 15; // Max 15 points for 5+ years
  
  // Apply severe penalty for field mismatch
  let fieldMismatchPenalty = 0;
  
  // Tech CV vs Non-tech job
  if (cvHasTechTerms && jobHasCookingTerms) {
    fieldMismatchPenalty = 40;
  }
  // Non-tech CV vs Tech job
  else if (cvHasCookingTerms && jobHasTechTerms) {
    fieldMismatchPenalty = 40;
  }
  // No technical skills for tech job
  else if (techSkillOverlap.length === 0 && jobSkills.technical.length > 3) {
    fieldMismatchPenalty = 25;
  }
  
  const totalScore = Math.max(0, Math.min(techSkillScore + softSkillScore + keywordScore + experienceScore - fieldMismatchPenalty, 100));
  
  return {
    score: Math.round(totalScore),
    breakdown: {
      technicalSkills: Math.round(techSkillScore),
      softSkills: Math.round(softSkillScore),
      keywords: Math.round(keywordScore),
      experience: Math.round(experienceScore)
    },
    matchingSkills: [...techSkillOverlap, ...softSkillOverlap],
    missingSkills: jobSkills.technical.filter(skill => !cvSkills.technical.includes(skill))
  };
}

// Generate insights and recommendations
function generateInsights(cvData, jobMatch) {
  const strengths = [];
  const weaknesses = [];

  // Helper values
  const topMatching = (jobMatch.matchingSkills || []).slice(0, 6);
  const topMissing = (jobMatch.missingSkills || []).slice(0, 6);
  const techCount = (cvData.skills && cvData.skills.technical) ? cvData.skills.technical.length : 0;
  const softCount = (cvData.skills && cvData.skills.soft) ? cvData.skills.soft.length : 0;
  const years = (cvData.experience && typeof cvData.experience.years === 'number') ? cvData.experience.years : parseInt((cvData.experience || '0').toString()) || 0;

  // Richer strengths
  if (topMatching.length > 0) {
    strengths.push(`Good alignment with key role skills: ${topMatching.join(', ')}. These should be front-and-center in your summary and top of the experience bullets.`);
  }

  if (techCount >= 5) {
    strengths.push(`Broad technical toolkit (${techCount} skills identified) — highlights versatility across tools and frameworks.`);
  } else if (techCount > 0) {
    strengths.push(`Focused technical set: ${cvData.skills.technical.slice(0, 6).join(', ')} — this makes you a clear fit for specialized roles.`);
  }

  if (softCount > 0) {
    strengths.push(`Relevant soft skills detected: ${cvData.skills.soft.slice(0, 6).join(', ')} — include brief examples showing these in action.`);
  }

  if (years >= 2) {
    strengths.push(`Experience level: ${years} years — emphasize seniority-appropriate projects and outcomes.`);
  }

  // Prioritized, actionable weaknesses
  if (topMissing.length > 0) {
    weaknesses.push(`Missing high-priority job skills: ${topMissing.join(', ')}. Action: add a short project or coursework that demonstrates one of these within 1–2 bullets (see examples below).`);
  }

  if (jobMatch.breakdown.technicalSkills < 20) {
    weaknesses.push('Technical match is weak relative to the job. Action: prioritize the top 2–3 required technologies on your resume, list them in a "Core Skills" section, and show where you used them in the experience.');
  }

  if (jobMatch.breakdown.keywords < 18) {
    const keywordSuggestions = topMatching.length ? topMatching.join(', ') : 'role-specific keywords from the job description';
    weaknesses.push(`Keyword optimization needed. Add phrases such as ${keywordSuggestions} in your summary, skills block, and the first bullet of relevant roles to improve ATS match.`);
  }

  if (years < 2) {
    weaknesses.push('Limited demonstrated experience — strengthen with project-based bullets, internships, open-source contributions, and measurable outcomes (e.g., "reduced X by Y%", "handled N users").');
  }

  
  const suggestedSummary = (() => {
    const topSkills = topMatching.length ? topMatching.slice(0, 3).join(', ') : (cvData.skills.technical.slice(0, 3) || []).join(', ');
    const level = years >= 5 ? 'Senior' : years >= 2 ? 'Experienced' : 'Entry-level';
    if (topSkills) {
      return `${level} professional with ${years} year(s) of experience in ${topSkills}. Proven record delivering measurable improvements through focused projects and collaboration.`;
    }
    return `${level} professional with ${years} year(s) of experience. Focus on measurable impact and relevant tools to improve role fit.`;
  })();

  const exampleBullets = [];
  if (topMatching.length > 0) {
    exampleBullets.push(`Example experience bullet: "Developed a ${topMatching[0]}-based solution that [describe impact — e.g., reduced latency, increased conversion] by X% using ${topMatching.slice(1,3).join(' and ')}."`);
  } else if (cvData.skills.technical.length > 0) {
    exampleBullets.push(`Example experience bullet: "Implemented ${cvData.skills.technical[0]} to solve [problem], achieving measurable improvement (e.g., reduced time, increased reliability)."`);
  }
  exampleBullets.push('Quantify results: always add a metric (%, time saved, user count) and the tools used.');
  exampleBullets.push('Formatting tip: put a short 2–3 line summary at top, then a "Core Skills" bulleted list, then experience bullets with metrics.');

  while (weaknesses.length < 3) {
    if (!weaknesses.includes('Review the job description and tailor your resume so that the most relevant skills and experience appear first.')) {
      weaknesses.push('Review the job description and tailor your resume so that the most relevant skills and experience appear first.');
    } else if (!weaknesses.includes('Focus on quantifiable achievements and specific tools used for each project or role.')) {
      weaknesses.push('Focus on quantifiable achievements and specific tools used for each project or role.');
    } else {
      weaknesses.push('Consider strengthening your resume with clearer examples of how your experience aligns with the target role.');
    }
    if (weaknesses.length >= 3) break;
  }

  return {
    strengths,
    weaknesses,
    suggestedSummary,
    suggestedBullets: exampleBullets
  };
}

// Main analysis endpoint
router.post('/', async (req, res) => {
  try {
    // Validate request
    const { error, value } = analysisSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
    }
    
    const { files, jobDescription } = value;
    const results = [];
    
    logger.info(`Starting analysis of ${files.length} CV files`);
    
    // Process each CV file
    for (const file of files) {
      try {
        // Check if file exists
        if (!fs.existsSync(file.path)) {
          logger.error(`File not found: ${file.path}`);
          continue;
        }
        
        // Extract text from PDF with enhanced error handling
        const pdfBuffer = fs.readFileSync(file.path);
        let cvText = '';
        let aiAnalysis = null;
        
        try {
          // Try with default options first
          const pdfData = await pdfParse(pdfBuffer);
          cvText = pdfData.text;
           aiAnalysis = await analyzeResume(
    cvText,
    jobDescription
);

console.log("\n========== GEMINI RESPONSE ==========");
console.log(aiAnalysis);
console.log("=====================================\n");
        } catch (pdfError) {
          logger.warn(`Primary PDF parsing failed for ${file.originalName}: ${pdfError.message}`);
          
          try {
            // Try with alternative options for problematic PDFs
            const pdfData = await pdfParse(pdfBuffer, {
              normalizeWhitespace: false,
              disableCombineTextItems: false
            });
            cvText = pdfData.text;
            logger.info(`Alternative PDF parsing succeeded for ${file.originalName}`);
          } catch (altError) {
            logger.error(`All PDF parsing methods failed for ${file.originalName}: ${altError.message}`);
            
            // Add this file to results with error status
            results.push({
              id: file.id,
              fileName: file.originalName,
              error: 'PDF parsing failed',
              errorDetails: 'Unable to extract text from PDF. The file may be corrupted or use an unsupported format.',
              score: 0,
              analyzedAt: new Date().toISOString()
            });
            continue;
          }
        }
        
        if (!cvText || cvText.trim().length < 100) {
          logger.warn(`Insufficient text extracted from ${file.originalName}`);
          results.push({
            id: file.id,
            fileName: file.originalName,
            error: 'Insufficient content',
            errorDetails: 'PDF contains insufficient text content for analysis.',
            score: 0,
            analyzedAt: new Date().toISOString()
          });
          continue;
        }
        
        // Extract skills and experience
        // const skills = extractSkills(cvText);
        // const experience = extractExperience(cvText);
        
        // // Calculate job match
        // const jobMatch = calculateJobMatch(skills, experience, jobDescription);
        
        // // Generate insights
        // const insights = generateInsights({ skills, experience }, jobMatch);
        
        // // Compile results
        // const result = {
        //   id: file.id,
        //   fileName: file.originalName,
        //   score: jobMatch.score,
        //   breakdown: jobMatch.breakdown,
        //   skills: skills.technical.concat(skills.soft),
        //   technicalSkills: skills.technical,
        //   softSkills: skills.soft,
        //   experience: `${experience.years} years`,
        //   education: experience.education.join(', ') || 'Not specified',
        //   matchingKeywords: jobMatch.matchingSkills,
        //   missingSkills: jobMatch.missingSkills,
        //   strengths: insights.strengths,
        //   weaknesses: insights.weaknesses,
        //   jobTitles: experience.jobTitles,
        //   companies: experience.companies,
        //   analyzedAt: new Date().toISOString()
        // };
        
        // results.push(result);
        // logger.info(`Analyzed ${file.originalName}: Score ${jobMatch.score}%`);
        // Build response using Gemini analysis
const result = {
  id: file.id,
  fileName: file.originalName,

  score: aiAnalysis.atsScore ?? aiAnalysis.resumeScore ?? 0,

  breakdown: {
    ats: aiAnalysis.atsScore ?? 0,
    resume: aiAnalysis.resumeScore ?? 0
  },

  skills: [
    ...(aiAnalysis.matchingKeywords || []),
    ...(aiAnalysis.missingSkills || [])
  ],

  technicalSkills: aiAnalysis.matchingKeywords || [],
  softSkills: [],

  experience: aiAnalysis.experience || "Not specified",

  education: aiAnalysis.education || "Not specified",

  matchingKeywords: aiAnalysis.matchingKeywords || [],
  missingSkills: aiAnalysis.missingSkills || [],

  

  strengths: aiAnalysis.strengths || [],
  weaknesses: aiAnalysis.areasForImprovement || [],

  projectSuggestions: aiAnalysis.projectSuggestions || [],

  jobTitles: [],
  companies: [],

  analyzedAt: new Date().toISOString()
};

results.push(result);

logger.info(
  `Analyzed ${file.originalName}: Score ${result.score}%`
);
        
      } catch (fileError) {
        logger.error(`Error processing ${file.originalName}:`, fileError);
        continue;
      }
    }
    
    // Sort results by score (highest first)
    results.sort((a, b) => b.score - a.score);
    
    // Add ranking
    results.forEach((result, index) => {
      result.rank = index + 1;
    });
    
    logger.info(`Analysis completed. Processed ${results.length} CVs successfully`);
    
    res.json({
      success: true,
      totalAnalyzed: results.length,
      totalSubmitted: files.length,
      results: results,
      analysisMetadata: {
        jobDescription: jobDescription.substring(0, 200) + '...',
        analyzedAt: new Date().toISOString(),
        processingTime: `${Date.now() - req.startTime}ms`
      }
    });
    
  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: 'An error occurred during CV analysis',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Middleware to track processing time
router.use((req, res, next) => {
  req.startTime = Date.now();
  next();
});

// Get analysis statistics
router.get('/stats', (req, res) => {
  res.json({
    supportedSkills: {
      technical: Object.keys(TECH_SKILLS).reduce((acc, category) => {
        acc[category] = TECH_SKILLS[category].length;
        return acc;
      }, {}),
      soft: SOFT_SKILLS.length
    },
    features: [
      'Advanced NLP text processing',
      'Multi-category skill extraction',
      'Experience level analysis',
      'Job matching algorithm',
      'TF-IDF similarity scoring',
      'Automated insights generation'
    ]
  });
});

module.exports = router;

// Export functions for testing
module.exports.extractSkills = extractSkills;
module.exports.extractExperience = extractExperience;
module.exports.calculateJobMatch = calculateJobMatch;
module.exports.generateInsights = generateInsights;