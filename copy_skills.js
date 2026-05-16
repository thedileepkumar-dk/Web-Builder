const fs = require('fs');
const path = require('path');

const agentsDir = '/Users/dileepkumar/Documents/Projects/Web-Builder/agents';
const skillsDir = '/Users/dileepkumar/Documents/Projects/Web-Builder/platform/skills';
const codexDir = '/Users/dileepkumar/.codex/skills';
const globalAgentsDir = '/Users/dileepkumar/.agents/skills';

function copyFiles(srcDir, isAgent) {
    if (!fs.existsSync(srcDir)) return;

    const files = fs.readdirSync(srcDir);
    files.forEach(file => {
        if (file.endsWith('.md')) {
            let name = file.replace('.md', '').toLowerCase().replace(/_/g, '-');
            if (isAgent) {
                name = name.replace('-agent', '');
            }
            if (name === 'web-builder-agent') name = 'web-builder';

            const codexTarget = path.join(codexDir, name);
            const globalTarget = path.join(globalAgentsDir, name);
            const srcPath = path.join(srcDir, file);

            if (!fs.existsSync(codexTarget)) {
                fs.mkdirSync(codexTarget, { recursive: true });
            }
            if (!fs.existsSync(globalTarget)) {
                fs.mkdirSync(globalTarget, { recursive: true });
            }

            fs.copyFileSync(srcPath, path.join(codexTarget, 'SKILL.md'));
            fs.copyFileSync(srcPath, path.join(globalTarget, 'SKILL.md'));
            console.log(`Copied ${file} to ${name}/SKILL.md`);
        }
    });
}

copyFiles(agentsDir, true);
copyFiles(skillsDir, false);
console.log('All files copied successfully.');
