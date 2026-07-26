# 🚀 AI CV Analyzer

An AI-powered Resume/CV Analyzer that evaluates resumes against a job description using **Google Gemini AI**. The application extracts text from PDF resumes, analyzes candidate profiles, calculates ATS compatibility, identifies strengths and skill gaps, and provides personalized recommendations to improve resume quality and job readiness.

---

## 📌 Features

- 📄 Upload one or multiple PDF resumes
- 🤖 AI-powered resume analysis using Google Gemini
- 🎯 ATS compatibility scoring
- 📊 Resume strength analysis
- 📈 Candidate ranking based on job fit
- ✅ Matching & Missing Skills Detection
- 💪 Strengths & Areas for Improvement
- 💡 Personalized Project Suggestions
- 🎤 AI-generated Interview Questions
- 🎓 Education Feedback
- 📋 Resume Summary
- 📥 Export analysis results in CSV, JSON, and TXT formats
- 🌙 Modern and responsive React UI

---

## 🛠 Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- CSS3

### Backend
- Node.js
- Express.js
- Multer
- pdf-parse
- REST API

### AI
- Google Gemini API

### Other Libraries
- dotenv
- Joi
- Winston

---

## 📂 Project Structure

```
AI-CV-Analyzer
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── routes
│   ├── services
│   ├── prompts
│   ├── uploads
│   └── package.json
│
└── README.md
```

---

## ⚙️ How It Works

```text
Upload Resume(s)
        │
        ▼
Extract Text from PDF (pdf-parse)
        │
        ▼
Resume Text + Job Description
        │
        ▼
Google Gemini AI
        │
        ▼
AI Analysis
        │
        ▼
Structured JSON Response
        │
        ▼
React Dashboard
```

---

## 📊 Analysis Includes

- ATS Score
- Resume Score
- Candidate Ranking
- Resume Summary
- Matching Keywords
- Missing Skills
- Strengths
- Areas for Improvement
- Project Suggestions
- Interview Questions
- Education Feedback

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/<your-username>/AI-CV-Analyzer.git
cd AI-CV-Analyzer
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Run the backend:

```bash
npm start
```

or

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Workflow

1. Upload one or more PDF resumes.
2. Enter the job description.
3. Text is extracted from the resumes using **pdf-parse**.
4. Resume text and job description are sent to **Google Gemini AI**.
5. Gemini analyzes the candidate profile.
6. Results are displayed in an interactive dashboard with rankings and recommendations.

---

## 📷 Screenshots

You can add screenshots here.

```
Home Page

Results Dashboard

Candidate Analysis
```

---

## 🔮 Future Enhancements

- Resume rewriting suggestions
- AI-generated cover letters
- LinkedIn profile optimization
- Career roadmap generation
- Salary prediction
- OCR support for scanned resumes
- Resume version comparison
- Skill learning recommendations

---

## 👨‍💻 Author

**Arjun Maheshwari**

LinkedIn: linkedin.com/in/arjunmaheshwari04/

GitHub: github.com/arjun614

---

## 📄 License

This project is licensed under the MIT License.
