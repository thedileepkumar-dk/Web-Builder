"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});
// Create a new project
app.post("/api/projects", async (req, res) => {
    try {
        const { prompt } = req.body;
        const project = await prisma.project.create({
            data: {
                prompt,
                status: "Clarifying",
                agents: {
                    create: [
                        {
                            name: "Clarification Agent",
                            scope: "Analyzing prompt and asking questions",
                            status: "Running",
                            progress: 10,
                        },
                    ],
                },
            },
        });
        res.json(project);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create project" });
    }
});
// Update Project (Used by Host AI to sync progress)
app.patch("/api/projects/:id", async (req, res) => {
    try {
        const { status, questions, plan, agents } = req.body;
        if (status)
            await prisma.project.update({
                where: { id: req.params.id },
                data: { status },
            });
        if (questions) {
            // Clear old questions and add new ones
            await prisma.clarificationQuestion.deleteMany({
                where: { projectId: req.params.id },
            });
            await prisma.clarificationQuestion.createMany({
                data: questions.map((q, i) => ({
                    projectId: req.params.id,
                    question: q.question,
                    answer: q.answer,
                    order: i,
                })),
            });
        }
        if (plan) {
            await prisma.plan.upsert({
                where: { projectId: req.params.id },
                update: { content: plan.content, approved: plan.approved || false },
                create: {
                    projectId: req.params.id,
                    content: plan.content,
                    approved: plan.approved || false,
                },
            });
        }
        if (agents) {
            for (const a of agents) {
                await prisma.agent.upsert({
                    where: { id: a.id || "new" },
                    update: { status: a.status, progress: a.progress, output: a.output },
                    create: {
                        projectId: req.params.id,
                        name: a.name,
                        scope: a.scope,
                        status: a.status,
                        progress: a.progress,
                        output: a.output,
                    },
                });
            }
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update project" });
    }
});
// Get project details
app.get("/api/projects/:id", async (req, res) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: req.params.id },
            include: {
                questions: true,
                plan: true,
                agents: true,
            },
        });
        if (!project)
            return res.status(404).json({ error: "Project not found" });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch project" });
    }
});
// Get project tasks status
app.get("/api/projects/:id/tasks/status", async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { projectId: req.params.id },
            include: { agent: true },
        });
        const summary = {
            total: tasks.length,
            todo: tasks.filter((t) => t.status === "Todo").length,
            inProgress: tasks.filter((t) => t.status === "InProgress").length,
            done: tasks.filter((t) => t.status === "Done").length,
            failed: tasks.filter((t) => t.status === "Failed").length,
            tasks: tasks.map((t) => ({
                id: t.id,
                title: t.title,
                status: t.status,
                agent: t.agent?.name || "Unassigned",
            })),
        };
        res.json(summary);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tasks status" });
    }
});
// Submit an answer
app.post("/api/projects/:id/answer", async (req, res) => {
    try {
        const { questionId, answer } = req.body;
        await prisma.clarificationQuestion.update({
            where: { id: questionId },
            data: { answer },
        });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to submit answer" });
    }
});
// Approve plan
app.post("/api/projects/:id/approve", async (req, res) => {
    try {
        await prisma.plan.update({
            where: { projectId: req.params.id },
            data: { approved: true },
        });
        await prisma.project.update({
            where: { id: req.params.id },
            data: { status: "Build" },
        });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to approve plan" });
    }
});
// --- Task Queue Endpoints (God Mode) ---
// Create a new task
app.post("/api/projects/:id/tasks", async (req, res) => {
    try {
        const { title, description, agentName, dependencies } = req.body;
        // Ensure agent exists or create it
        let agent = await prisma.agent.findFirst({
            where: { projectId: req.params.id, name: agentName },
        });
        if (!agent) {
            agent = await prisma.agent.create({
                data: {
                    projectId: req.params.id,
                    name: agentName,
                    scope: "Autonomous Execution",
                    status: "Queued",
                },
            });
        }
        const task = await prisma.task.create({
            data: {
                projectId: req.params.id,
                agentId: agent.id,
                title,
                description,
                dependencies,
            },
        });
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create task" });
    }
});
// Claim next task for an agent
app.post("/api/projects/:id/tasks/claim", async (req, res) => {
    try {
        const { agentName } = req.body;
        const agent = await prisma.agent.findFirst({
            where: { projectId: req.params.id, name: agentName },
        });
        if (!agent)
            return res.status(404).json({ error: "Agent not found" });
        // Fetch all "Todo" tasks for this agent, ordered by priority and createdAt
        const tasks = await prisma.task.findMany({
            where: { projectId: req.params.id, agentId: agent.id, status: "Todo" },
            orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
        });
        let taskToClaim = null;
        // Filter out tasks with unmet dependencies
        for (const t of tasks) {
            if (!t.dependencies) {
                taskToClaim = t;
                break;
            }
            const depIds = t.dependencies
                .split(",")
                .map((id) => id.trim())
                .filter(Boolean);
            if (depIds.length === 0) {
                taskToClaim = t;
                break;
            }
            const pendingDeps = await prisma.task.count({
                where: {
                    id: { in: depIds },
                    status: { not: "Done" },
                },
            });
            if (pendingDeps === 0) {
                taskToClaim = t;
                break;
            }
        }
        if (!taskToClaim)
            return res.json(null);
        // Mark as InProgress
        const updatedTask = await prisma.task.update({
            where: { id: taskToClaim.id },
            data: { status: "InProgress" },
        });
        // Update agent status
        await prisma.agent.update({
            where: { id: agent.id },
            data: { status: "Running", output: `Working on: ${taskToClaim.title}` },
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to claim task" });
    }
});
// Update task status (Complete/Fail)
app.patch("/api/tasks/:taskId", async (req, res) => {
    try {
        const { status, output, handoffData } = req.body;
        const task = await prisma.task.update({
            where: { id: req.params.taskId },
            data: { status, output, handoffData },
        });
        if (task.agentId && (status === "Done" || status === "Failed")) {
            await prisma.agent.update({
                where: { id: task.agentId },
                data: {
                    status: status === "Done" ? "Passed" : "Needs work",
                    output: output,
                },
            });
        }
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update task" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
