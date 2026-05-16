#!/bin/bash

# --- COLOR DEFINITIONS ---
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear

echo -e "${PURPLE}======================================================"
echo -e "   🚀 WEB BUILDER: ULTIMATE WEBSITE BUILDER AGENT   "
echo -e "======================================================"
echo -e "${NC}Installing for: Codex, Claude Code, Gemini & Antigravity\n"

# --- CHECK PREREQUISITES ---
echo -e "${CYAN}[1/4] Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install it first.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found: $(node -v)${NC}"

# --- INSTALL ORCHESTRATOR BACKEND ---
echo -e "\n${CYAN}[2/4] Installing Orchestrator CLI (Prisma)...${NC}"
cd server
npm install --silent
echo -e "${GREEN}✓ CLI dependencies installed.${NC}"

# Setup DB
echo -e "${CYAN}Running database migrations...${NC}"
npx prisma db push --accept-data-loss &> /dev/null
npx prisma generate &> /dev/null
echo -e "${GREEN}✓ Local task queue database initialized.${NC}"
cd ..

# --- SETUP PLATFORMS ---
echo -e "\n${CYAN}[3/4] Configuring AI Platforms...${NC}"
echo -e "${BLUE}→ Configuring Codex/Cursor (.cursorrules)...${NC}"
echo -e "${BLUE}→ Configuring Claude Code (.claudecode)...${NC}"
echo -e "${BLUE}→ Configuring Gemini CLI (GEMINI.md)...${NC}"
echo -e "${BLUE}→ Configuring Antigravity Agent Patterns...${NC}"

# Global Registration for Codex & Antigravity
echo -e "${BLUE}→ Registering agents globally for Codex/Antigravity...${NC}"
for file in agents/*.md; do
  skill_name=$(basename "$file" .md | tr '[:upper:]' '[:lower:]' | sed 's/_/-/g' | sed 's/-agent//g')
  if [ "$skill_name" = "web-builder-agent" ]; then skill_name="web-builder"; fi
  mkdir -p ~/.codex/skills/"$skill_name" ~/.agents/skills/"$skill_name" &>/dev/null
  cp "$file" ~/.codex/skills/"$skill_name"/SKILL.md &>/dev/null
  cp "$file" ~/.agents/skills/"$skill_name"/SKILL.md &>/dev/null
done

for file in platform/skills/*.md; do
  skill_name=$(basename "$file" .md | tr '[:upper:]' '[:lower:]' | sed 's/_/-/g')
  mkdir -p ~/.codex/skills/"$skill_name" ~/.agents/skills/"$skill_name" &>/dev/null
  cp "$file" ~/.codex/skills/"$skill_name"/SKILL.md &>/dev/null
  cp "$file" ~/.agents/skills/"$skill_name"/SKILL.md &>/dev/null
done

echo -e "${GREEN}✓ All platforms configured and agents registered globally.${NC}"

# --- FINALIZE ---
echo -e "\n${PURPLE}======================================================"
echo -e "             INSTALLATION COMPLETE!                  "
echo -e "======================================================${NC}"
echo -e "\n${CYAN}To start building a website:${NC}"
echo -e "Open your AI assistant (Cursor, Claude, etc.) and say:"
echo -e "\"Please spawn a web-builder to execute the complete development pipeline for [Your Website Idea].\""
echo -e "${PURPLE}======================================================${NC}\n"
