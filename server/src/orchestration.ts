import axios from "axios";

/**
 * AI ORCHESTRATION COMMANDS (GOD MODE)
 *
 * This file contains the command definitions that you (the AI Agent)
 * should use to keep the user's dashboard in sync with your progress
 * and to hand off work to other agents.
 */

const API_BASE = "http://localhost:4000";

// --- Project Level Commands ---

export async function syncStartClarifying(projectId: string) {
  await axios.patch(`${API_BASE}/api/projects/${projectId}`, {
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

export async function syncPostQuestions(
  projectId: string,
  questions: string[],
) {
  await axios.patch(`${API_BASE}/api/projects/${projectId}`, {
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

export async function syncStartPlanning(projectId: string) {
  await axios.patch(`${API_BASE}/api/projects/${projectId}`, {
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

export async function syncPostPlan(projectId: string, markdownContent: string) {
  await axios.patch(`${API_BASE}/api/projects/${projectId}`, {
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
export async function createTask(
  projectId: string,
  title: string,
  description: string,
  agentName: string,
  dependencies: string[] = [],
) {
  const res = await axios.post(`${API_BASE}/api/projects/${projectId}/tasks`, {
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
export async function claimNextTask(projectId: string, agentName: string) {
  const res = await axios.post(
    `${API_BASE}/api/projects/${projectId}/tasks/claim`,
    {
      agentName,
    },
  );
  return res.data; // Returns task details or null if none available
}

/**
 * Mark a task as completed and optionally pass data to the next agent.
 */
export async function completeTask(
  taskId: string,
  output: string,
  handoffData?: any,
) {
  const res = await axios.patch(`${API_BASE}/api/tasks/${taskId}`, {
    status: "Done",
    output,
    handoffData: handoffData ? JSON.stringify(handoffData) : null,
  });
  return res.data;
}

/**
 * Report a failure, triggering the Debugger Agent.
 */
export async function failTask(taskId: string, errorLog: string) {
  const res = await axios.patch(`${API_BASE}/api/tasks/${taskId}`, {
    status: "Failed",
    output: errorLog,
  });
  // Trigger Debugger
  await axios.post(`${API_BASE}/api/projects/${res.data.projectId}/tasks`, {
    title: `Fix Task ${taskId}`,
    description: `Task failed with error: ${errorLog}`,
    agentName: "Debugger Agent",
  });
  return res.data;
}
