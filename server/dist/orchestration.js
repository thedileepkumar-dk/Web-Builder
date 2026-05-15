"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStartClarifying = syncStartClarifying;
exports.syncPostQuestions = syncPostQuestions;
exports.syncStartPlanning = syncStartPlanning;
exports.syncPostPlan = syncPostPlan;
exports.createTask = createTask;
exports.claimNextTask = claimNextTask;
exports.completeTask = completeTask;
exports.failTask = failTask;
const axios_1 = __importDefault(require("axios"));
/**
 * AI ORCHESTRATION COMMANDS (GOD MODE)
 *
 * This file contains the command definitions that you (the AI Agent)
 * should use to keep the user's dashboard in sync with your progress
 * and to hand off work to other agents.
 */
const API_BASE = "http://localhost:4000";
// --- Project Level Commands ---
async function syncStartClarifying(projectId) {
    await axios_1.default.patch(`${API_BASE}/api/projects/${projectId}`, {
        status: "Clarify",
        agents: [
            {
                name: "Clarification Agent",
                scope: "Analyzing prompt",
                status: "Running",
                progress: 20,
            },
        ],
    });
}
async function syncPostQuestions(projectId, questions) {
    await axios_1.default.patch(`${API_BASE}/api/projects/${projectId}`, {
        questions: questions.map((q) => ({ question: q })),
        agents: [
            {
                name: "Clarification Agent",
                status: "Passed",
                progress: 100,
                output: "Generated questions.",
            },
        ],
    });
}
async function syncStartPlanning(projectId) {
    await axios_1.default.patch(`${API_BASE}/api/projects/${projectId}`, {
        status: "Plan",
        agents: [
            {
                name: "Planning Agent",
                scope: "Creating roadmap",
                status: "Running",
                progress: 20,
            },
        ],
    });
}
async function syncPostPlan(projectId, markdownContent) {
    await axios_1.default.patch(`${API_BASE}/api/projects/${projectId}`, {
        plan: { content: markdownContent },
        agents: [
            {
                name: "Planning Agent",
                status: "Passed",
                progress: 100,
                output: "Plan ready.",
            },
        ],
    });
}
// --- Task Queue & Handoff Commands (Autonomous Orchestration) ---
/**
 * Create a new task in the queue. Used by the Project Manager Agent.
 */
async function createTask(projectId, title, description, agentName, dependencies = []) {
    const res = await axios_1.default.post(`${API_BASE}/api/projects/${projectId}/tasks`, {
        title,
        description,
        agentName,
        dependencies: dependencies.join(","),
    });
    return res.data;
}
/**
 * Claim the next available task for a specific agent.
 */
async function claimNextTask(projectId, agentName) {
    const res = await axios_1.default.post(`${API_BASE}/api/projects/${projectId}/tasks/claim`, {
        agentName,
    });
    return res.data; // Returns task details or null if none available
}
/**
 * Mark a task as completed and optionally pass data to the next agent.
 */
async function completeTask(taskId, output, handoffData) {
    const res = await axios_1.default.patch(`${API_BASE}/api/tasks/${taskId}`, {
        status: "Done",
        output,
        handoffData: handoffData ? JSON.stringify(handoffData) : null,
    });
    return res.data;
}
/**
 * Report a failure, triggering the Debugger Agent.
 */
async function failTask(taskId, errorLog) {
    const res = await axios_1.default.patch(`${API_BASE}/api/tasks/${taskId}`, {
        status: "Failed",
        output: errorLog,
    });
    // Trigger Debugger
    await axios_1.default.post(`${API_BASE}/api/projects/${res.data.projectId}/tasks`, {
        title: `Fix Task ${taskId}`,
        description: `Task failed with error: ${errorLog}`,
        agentName: "Debugger Agent",
    });
    return res.data;
}
