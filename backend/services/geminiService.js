const { GoogleGenerativeAI } = require("@google/generative-ai");
const getAnalysisPrompt = require("../prompts/analysisPrompt");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash-lite"
});

async function analyzeResume(resumeText, jobDescription) {
    try {

        const prompt = getAnalysisPrompt(
            resumeText,
            jobDescription
        );

        const result = await model.generateContent(prompt);

        const response = await result.response;

        let text = response.text().trim();

        // Remove markdown if Gemini returns ```json ... ```
        text = text.replace(/```json/g, "");
        text = text.replace(/```/g, "");
        text = text.trim();

        const parsed = JSON.parse(text);

        return parsed;

    } 
    catch (error) {

    console.error("\n========== GEMINI ERROR ==========");
    console.error(error);
    console.error("=================================\n");

    throw error;
}
}

module.exports = {
    analyzeResume
};