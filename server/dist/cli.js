"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const API_BASE = "http://localhost:4000";
async function runCommand() {
    const args = process.argv.slice(2);
    const command = args[0];
    try {
        if (command === "sync-questions") {
            // ... Skip everything until the last else if
            // I'll use a targeted replacement for the end of the file instead of the whole file.
            const projectId = args[1];
            const questions = JSON.parse(args[2]);
            await axios_1.default.patch(`${API_BASE}/api/projects/${projectId}`, { questions });
            console.log("✅ Questions synced.");
        }
        else if (command === "sync-plan") {
            const projectId = args[1];
            const content = args[2];
            await axios_1.default.patch(`${API_BASE}/api/projects/${projectId}`, {
                plan: { content },
            });
            console.log("✅ Plan synced.");
        }
        else if (command === "create-task") {
            const projectId = args[1];
            const title = args[2];
            const description = args[3];
            const agentName = args[4];
            const dependencies = args[5] ? args[5].split(",") : [];
            const res = await axios_1.default.post(`${API_BASE}/api/projects/${projectId}/tasks`, { title, description, agentName, dependencies });
            console.log(`✅ Task created: ${res.data.id}`);
        }
        else if (command === "claim-task") {
            const projectId = args[1];
            const agentName = args[2];
            const res = await axios_1.default.post(`${API_BASE}/api/projects/${projectId}/tasks/claim`, { agentName });
            if (res.data) {
                console.log(`✅ Claimed task: ${res.data.id} - ${res.data.title}`);
                console.log(`Description: ${res.data.description}`);
            }
            else {
                console.log(`No pending tasks for ${agentName}.`);
            }
        }
        else if (command === "complete-task") {
            const taskId = args[1];
            const output = args[2];
            const handoffData = args[3];
            await axios_1.default.patch(`${API_BASE}/api/tasks/${taskId}`, {
                status: "Done",
                output,
                handoffData,
            });
            console.log(`✅ Task ${taskId} marked as Done.`);
        }
        else if (command === "fail-task") {
            const taskId = args[1];
            const output = args[2];
            const res = await axios_1.default.patch(`${API_BASE}/api/tasks/${taskId}`, {
                status: "Failed",
                output,
            });
            // Trigger debugger
            await axios_1.default.post(`${API_BASE}/api/projects/${res.data.projectId}/tasks`, {
                title: `Fix Task ${taskId}`,
                description: `Task failed with error: ${output}`,
                agentName: "Debugger Agent",
            });
            console.log(`❌ Task ${taskId} marked as Failed. Debugger Agent triggered.`);
        }
        else if (command === "task-status") {
            const projectId = args[1];
            const res = await axios_1.default.get(`${API_BASE}/api/projects/${projectId}/tasks/status`);
            console.log(`📊 Task Status for Project ${projectId}:`);
            console.log(`Total: ${res.data.total} | Todo: ${res.data.todo} | InProgress: ${res.data.inProgress} | Done: ${res.data.done} | Failed: ${res.data.failed}`);
            console.log(`Active/Pending Tasks:`);
            res.data.tasks
                .filter((t) => t.status !== "Done")
                .forEach((t) => {
                console.log(`- [${t.id}] ${t.title} (${t.status}) -> ${t.agent}`);
            });
        }
        else if (command === "run-visual-audit") {
            const url = args[1] || "http://localhost:5173";
            const outputName = args[2] || "audit-screenshot.png";
            const scriptPath = path_1.default.resolve(__dirname, "../../scripts/visual-audit.mjs");
            try {
                console.log(`📸 Running Playwright visual audit on ${url}...`);
                const result = (0, child_process_1.execSync)(`node ${scriptPath} "${url}" "${outputName}"`, {
                    encoding: "utf-8",
                });
                console.log(result);
            }
            catch (err) {
                console.error("❌ Visual audit script failed:", err.message);
                if (err.stdout)
                    console.log(err.stdout);
                if (err.stderr)
                    console.error(err.stderr);
            }
        }
        else if (command === "save-adr") {
            const title = args[1];
            const context = args[2];
            const decision = args[3];
            const consequences = args[4];
            const date = new Date().toISOString().split("T")[0];
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const filename = `${date}-${slug}.md`;
            const adrPath = path_1.default.resolve(__dirname, "../../docs/architecture/decisions", filename);
            const content = `# ADR: ${title}\n\n## Context\n${context}\n\n## Decision\n${decision}\n\n## Consequences\n${consequences}\n`;
            fs_1.default.writeFileSync(adrPath, content);
            console.log(`🧠 ADR Saved: ${adrPath}`);
        }
        else if (command === "update-fact-sheet") {
            const fact = args[1];
            const factPath = path_1.default.resolve(__dirname, "../../PROJECT_FACT_SHEET.md");
            fs_1.default.appendFileSync(factPath, `- ${fact}\n`);
            console.log(`🧠 Project Fact Sheet updated.`);
        }
        else {
            console.log("Unknown command. Available commands: sync-questions, sync-plan, create-task, claim-task, complete-task, fail-task, task-status, run-visual-audit, save-adr, update-fact-sheet");
        }
    }
    catch (error) {
        console.error("❌ Command failed:", error.response?.data || error.message);
    }
}
runCommand();
