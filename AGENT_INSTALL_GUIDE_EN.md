# Guide: Installing & Distributing Personal .agent Kits

This file guides you on how to package your `.agent` folder (the AI brain) into a tool that can be quickly installed into any project using the `init-agent` command or `npx`.

---

## 🚀 Option 1: Professional NPM Installation (Recommended)

Once you have published this repository to NPM, you can install the AI brain professionally into any project:

```bash
# Navigate to your project
cd your-project

# Initialize the kit
npx @trudyan141/antigravity-kit init
```

This command will automatically:

1. Copy the `.agent` folder to your current project.
2. Add `.agent/` to your `.gitignore` file (creating it if necessary).

---

## 🚀 Option 2: Offline Local Installation

If you want to install the kit already on your machine into other projects:

1. Go to the root directory of this repository.
2. Link it to your global system:
   ```bash
   npm link
   ```
3. In your new project, run:
   ```bash
   init-agent
   ```

---

## 🔄 AI Brain Evolution Workflow

This is a unique feature that allows your AI brain to get smarter with every project you work on.

### Step 1: Mark "Headquarters" (One-time)

Inside this Master Kit folder, run:

```bash
npx . set-master
```

This tells the tool where your primary source of truth is located on your machine.

### Step 2: Learn in Sub-projects

While working on a different project, if you've added or improved a Skill in the `.agent` folder, just run:

```bash
npx @trudyan141/antigravity-kit sync
```

The installer will automatically "harvest" those improvements and send them back to your Master Kit.

### Step 3: Review & Finalize

Go back to your Master Kit folder, use `git diff` to review the newly synced knowledge, and then `git push` to GitHub to save it forever.

---

## 🚀 Option 2: Creating an Online "Installer" (npx Initializer) - Step-by-Step

To create an `npx my-agent-init` command that "transplants" the AI brain into any project from a remote repository, follow these steps:

### Step 1: Initialize CLI Project

Create a new directory to hold the installer source code.

```bash
mkdir my-agent-init && cd my-agent-init
npm init -y
mkdir bin
```

### Step 2: Configure `package.json`

Open `package.json` and add the `bin` field. This is the most crucial part for npm to recognize the command.

```json
{
  "name": "my-agent-init",
  "version": "1.0.0",
  "bin": {
    "my-agent-init": "./bin/init.js"
  },
  "type": "module",
  "dependencies": {
    "chalk": "^5.0.0"
  }
}
```

### Step 3: Write Initializer Script (`bin/init.js`)

This file will automatically clone the `.agent` folder from your GitHub to the current project.

```javascript
#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import chalk from "chalk";

// ⚠️ CHANGE THIS URL TO THE REPO CONTAINING YOUR OWN .AGENT FOLDER
const REPO_URL = "https://github.com/your-username/your-ai-brain.git";

console.log(chalk.blue('🚀 Preparing to "transplant" AI brain...'));

if (fs.existsSync(".agent")) {
  console.log(chalk.yellow("⚠️ .agent folder already exists in this project."));
  process.exit(0);
}

try {
  // Clone repo into temporary .agent folder
  execSync(`git clone ${REPO_URL} .agent`, { stdio: "inherit" });

  // Remove the internal .git folder to avoid conflicts with the project's repo
  fs.rmSync(".agent/.git", { recursive: true, force: true });

  console.log(
    chalk.green("✅ Installation successful! Your AI is ready to work.")
  );
} catch (error) {
  console.error(
    chalk.red("❌ Error: Could not download AI brain:"),
    error.message
  );
  process.exit(1);
}
```

### Step 4: Publish to NPM

If you want to use the `npx` command globally, you need to publish it to npm.

```bash
npm login
npm publish --access public
```

_(Note: You may need to choose a different package name if `my-agent-init` is already taken)._

### Step 5: Use it Anywhere

In any new project, just open the terminal and type:

```bash
npx my-agent-init
```

---

## 🔗 Other Methods

If you don't want to use npm, you can use:

- **Git Submodule:** `git submodule add <agent-repo-url> .agent`
- **Symbolic Link:** `ln -s /path/to/original/agent/folder .agent`

> [!TIP]
> Using `npx` allows you to "summon" your AI assistant anywhere with an internet connection, without needing to remember local file paths.
