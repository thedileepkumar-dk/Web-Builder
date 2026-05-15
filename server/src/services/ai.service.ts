import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateClarificationQuestions(prompt: string) {
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
      return JSON.parse(jsonMatch[0]) as string[];
    }
    return ["Who are the main users?", "What is the core feature?", "What tech stack do you prefer?"];
  } catch (error) {
    console.error("AI Generation Error:", error);
    return ["Failed to generate questions. Please define your requirements."];
  }
}

export async function generateDevelopmentPlan(prompt: string, answers: string) {
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
  } catch (error) {
    return "Error generating plan.";
  }
}
