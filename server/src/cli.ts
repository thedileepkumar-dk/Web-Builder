import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

async function runCommand() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    if (command === "create-project") {
      const prompt = args[1];
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
      console.log(`✅ Project created: ${project.id}`);
    } else if (command === "sync-questions") {
      const projectId = args[1];
      const questions = JSON.parse(args[2]);

      await prisma.project.update({
        where: { id: projectId },
        data: { status: "Clarify" },
      });
      await prisma.clarificationQuestion.deleteMany({ where: { projectId } });
      await prisma.clarificationQuestion.createMany({
        data: questions.map((q: any, i: number) => ({
          projectId,
          question: q.question,
          answer: q.answer,
          order: i,
        })),
      });
      console.log("✅ Questions synced.");
    } else if (command === "sync-plan") {
      const projectId = args[1];
      const content = args[2];

      const existingPlan = await prisma.plan.findUnique({
        where: { projectId },
      });
      if (existingPlan) {
        await prisma.plan.update({ where: { projectId }, data: { content } });
      } else {
        await prisma.plan.create({
          data: { projectId, content, approved: false },
        });
      }
      console.log("✅ Plan synced.");
    } else if (command === "create-task") {
      const projectId = args[1];
      const title = args[2];
      const description = args[3];
      const agentName = args[4];
      const dependencies = args[5] ? args[5] : null;

      let agent = await prisma.agent.findFirst({
        where: { projectId, name: agentName },
      });

      if (!agent) {
        agent = await prisma.agent.create({
          data: {
            projectId,
            name: agentName,
            scope: "Autonomous Execution",
            status: "Queued",
          },
        });
      }

      const task = await prisma.task.create({
        data: {
          projectId,
          agentId: agent.id,
          title,
          description,
          dependencies,
        },
      });
      console.log(`✅ Task created: ${task.id}`);
    } else if (command === "claim-task") {
      const projectId = args[1];
      const agentName = args[2];

      const agent = await prisma.agent.findFirst({
        where: { projectId, name: agentName },
      });

      if (!agent) {
        console.log(`No pending tasks for ${agentName}.`);
        return;
      }

      const tasks = await prisma.task.findMany({
        where: { projectId, agentId: agent.id, status: "Todo" },
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
      });

      let taskToClaim = null;

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

      if (!taskToClaim) {
        console.log(`No pending tasks for ${agentName}.`);
        return;
      }

      const updatedTask = await prisma.task.update({
        where: { id: taskToClaim.id },
        data: { status: "InProgress" },
      });

      await prisma.agent.update({
        where: { id: agent.id },
        data: { status: "Running", output: `Working on: ${taskToClaim.title}` },
      });

      console.log(`✅ Claimed task: ${updatedTask.id} - ${updatedTask.title}`);
      console.log(`Description: ${updatedTask.description}`);
    } else if (command === "complete-task") {
      const taskId = args[1];
      const output = args[2];
      const handoffData = args[3] || null;

      const task = await prisma.task.update({
        where: { id: taskId },
        data: { status: "Done", output, handoffData },
      });

      if (task.agentId) {
        await prisma.agent.update({
          where: { id: task.agentId },
          data: { status: "Passed", output },
        });
      }

      console.log(`✅ Task ${taskId} marked as Done.`);
    } else if (command === "fail-task") {
      const taskId = args[1];
      const output = args[2];

      const task = await prisma.task.update({
        where: { id: taskId },
        data: { status: "Failed", output },
      });

      if (task.agentId) {
        await prisma.agent.update({
          where: { id: task.agentId },
          data: { status: "Needs work", output },
        });
      }

      let debuggerAgent = await prisma.agent.findFirst({
        where: { projectId: task.projectId, name: "Debugger Agent" },
      });

      if (!debuggerAgent) {
        debuggerAgent = await prisma.agent.create({
          data: {
            projectId: task.projectId,
            name: "Debugger Agent",
            scope: "Fixing bugs",
            status: "Queued",
          },
        });
      }

      await prisma.task.create({
        data: {
          projectId: task.projectId,
          agentId: debuggerAgent.id,
          title: `Fix Task ${taskId}`,
          description: `Task failed with error: ${output}`,
        },
      });

      console.log(
        `❌ Task ${taskId} marked as Failed. Debugger Agent triggered.`,
      );
    } else if (command === "task-status") {
      const projectId = args[1];
      const tasks = await prisma.task.findMany({
        where: { projectId },
        include: { agent: true },
      });

      const summary = {
        total: tasks.length,
        todo: tasks.filter((t) => t.status === "Todo").length,
        inProgress: tasks.filter((t) => t.status === "InProgress").length,
        done: tasks.filter((t) => t.status === "Done").length,
        failed: tasks.filter((t) => t.status === "Failed").length,
      };

      console.log(`📊 Task Status for Project ${projectId}:`);
      console.log(
        `Total: ${summary.total} | Todo: ${summary.todo} | InProgress: ${summary.inProgress} | Done: ${summary.done} | Failed: ${summary.failed}`,
      );
      console.log(`Active/Pending Tasks:`);
      tasks
        .filter((t: any) => t.status !== "Done")
        .forEach((t: any) => {
          console.log(
            `- [${t.id}] ${t.title} (${t.status}) -> ${t.agent?.name || "Unassigned"}`,
          );
        });
    } else if (command === "run-visual-audit") {
      const url = args[1] || "http://localhost:5173";
      const outputName = args[2] || "audit-screenshot.png";
      const scriptPath = path.resolve(
        __dirname,
        "../../scripts/visual-audit.mjs",
      );
      try {
        console.log(`📸 Running Playwright visual audit on ${url}...`);
        const result = execSync(`node ${scriptPath} "${url}" "${outputName}"`, {
          encoding: "utf-8",
        });
        console.log(result);
      } catch (err: any) {
        console.error("❌ Visual audit script failed:", err.message);
        if (err.stdout) console.log(err.stdout);
        if (err.stderr) console.error(err.stderr);
      }
    } else if (command === "save-adr") {
      const title = args[1];
      const context = args[2];
      const decision = args[3];
      const consequences = args[4];
      const date = new Date().toISOString().split("T")[0];
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const filename = `${date}-${slug}.md`;
      const adrPath = path.resolve(
        __dirname,
        "../../docs/architecture/decisions",
        filename,
      );

      const content = `# ADR: ${title}\n\n## Context\n${context}\n\n## Decision\n${decision}\n\n## Consequences\n${consequences}\n`;
      fs.writeFileSync(adrPath, content);
      console.log(`🧠 ADR Saved: ${adrPath}`);
    } else if (command === "update-fact-sheet") {
      const fact = args[1];
      const factPath = path.resolve(__dirname, "../../PROJECT_FACT_SHEET.md");
      fs.appendFileSync(factPath, `- ${fact}\n`);
      console.log(`🧠 Project Fact Sheet updated.`);
    } else {
      console.log(
        "Unknown command. Available commands: create-project, sync-questions, sync-plan, create-task, claim-task, complete-task, fail-task, task-status, run-visual-audit, save-adr, update-fact-sheet",
      );
    }
  } catch (error: any) {
    console.error("❌ Command failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

runCommand();
