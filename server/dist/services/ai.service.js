"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateClarificationQuestions = generateClarificationQuestions;
exports.generateDevelopmentPlan = generateDevelopmentPlan;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
async function generateClarificationQuestions(prompt) {
    const aiPrompt = `
    You are a professional Product Manager Agent.
    A user wants to build the following web application: "${prompt}"

    Based on this idea, ask exactly 5 high-impact clarification questions to help define the MVP.
    Focus on target users, core features, and technical constraints.

    Return the response as a valid JSON array of strings.
    Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
  `;
    try {
        const result = await model.generateContent(aiPrompt);
        const response = await result.response;
        const text = response.text();
        // Basic cleanup to extract JSON
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return ["Who are the main users?", "What is the core feature?", "What tech stack do you prefer?"];
    }
    catch (error) {
        console.error("AI Generation Error:", error);
        return ["Failed to generate questions. Please define your requirements."];
    }
}
async function generateDevelopmentPlan(prompt, answers) {
    const aiPrompt = `
    You are a professional Software Architect Agent.
    The user wants to build: "${prompt}"
    They provided these answers to clarification questions: "${answers}"

    Create a detailed development plan including:
    1. Feature List
    2. Database Schema (brief)
    3. User Roles
    4. Tech Stack recommendations

    Return the plan in Markdown format.
  `;
    try {
        const result = await model.generateContent(aiPrompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        return "Error generating plan.";
    }
}
