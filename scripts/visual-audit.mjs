import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:5173'; // Default vite port
const outputName = process.argv[3] || 'screenshot.png';

async function runAudit() {
  console.log(`📸 Starting visual audit for ${url}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });

    const outputPath = path.join(process.cwd(), 'docs', 'visual-audits', outputName);

    // Capture full page screenshot
    await page.screenshot({ path: outputPath, fullPage: true });

    console.log(`✅ Visual audit complete. Screenshot saved to ${outputPath}`);

    // In a real scenario, this could compare against a baseline using pixelmatch.
    // For this AI orchestrator, we just capture it so the AI can use a multimodal model
    // or report the path to the UI Designer agent.

  } catch (error) {
    console.error(`❌ Visual audit failed:`, error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAudit();
