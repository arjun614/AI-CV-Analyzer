const mod = require('./routes/cvAnalysis');

const cvData = {
  skills: {
    technical: ['javascript','react','node.js'],
    soft: ['communication','teamwork']
  },
  experience: { years: 3 }
};

const jobMatch = {
  matchingSkills: ['javascript','react','node.js'],
  missingSkills: ['typescript','aws'],
  breakdown: {
    technicalSkills: 28,
    softSkills: 10,
    keywords: 12,
    experience: 9
  },
  score: 72
};

const insights = mod.generateInsights(cvData, jobMatch);
console.log(JSON.stringify(insights, null, 2));
