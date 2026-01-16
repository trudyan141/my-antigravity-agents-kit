#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { Command } from 'commander';
import readline from 'readline';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(os.homedir(), '.antigravity-kit-config.json');
const targetDir = process.cwd();
const packageRoot = path.join(__dirname, '..');
const templateDir = path.join(packageRoot, 'templates', '.agent');
const destDir = path.join(targetDir, '.agent');

// ============================================================================
// UI UTILS
// ============================================================================

const showBanner = () => {
  console.log(chalk.cyan(`
    █████  ███▄    █ ▄▄▄█████╗ ██████╗ ██████╗  █████╗ ██╗   ██╗██╗████████╗██╗   ██╗
   ██╔══██╗██ ▀█   █ ▀  ██  ▀  ██╔════╝ ██╔══██╗██╔══██╗██║   ██║██║╚══██╔══╝╚██╗ ██╔╝
   ███████║██  ▀█  █    ██     ██║  ███╗██████╔╝███████║██║   ██║██║   ██║    ╚████╔╝ 
   ██╔══██║██   ▀█ █    ██     ██║   ██║██╔══██╗██╔══██║╚██╗ ██╔╝██║   ██║     ╚██╔╝  
   ██║  ██║██    ▀██    ██     ╚██████╔╝██║  ██║██║  ██║ ╚████╔╝ ██║   ██║      ██║   
   ╚═╝  ╚═╝╚═╝     ╚═╝    ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝   ╚═╝      ╚═╝   
                               🚀 AGENTIC OS KIT PRO MAX 🚀
  `));
};

const confirm = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(chalk.yellow(`${question} (y/N): `), (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
};

// ============================================================================
// CONFIG UTILS
// ============================================================================

const getMasterPath = async () => {
  if (await fs.pathExists(CONFIG_PATH)) {
    const config = await fs.readJson(CONFIG_PATH);
    return config.masterPath;
  }
  return null;
};

const saveMasterPath = async (p) => {
  await fs.writeJson(CONFIG_PATH, { masterPath: path.resolve(p) });
};

// ============================================================================
// CORE LOGIC
// ============================================================================

async function mergeDirectories(src, dest, force = false, spinner, rootDestForRelative = dest) {
  const items = await fs.readdir(src);
  for (const item of items) {
    if (item === '.git' || item === 'node_modules') continue;
    
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stats = await fs.lstat(srcPath);

    if (stats.isDirectory()) {
      await fs.ensureDir(destPath);
      await mergeDirectories(srcPath, destPath, force, spinner, rootDestForRelative);
    } else {
      const exists = await fs.pathExists(destPath);
      const relativePath = path.relative(rootDestForRelative, destPath);
      
      if (exists) {
        if (force) {
          spinner.info(chalk.yellow(`  [OVERWRITING] ${relativePath}`));
          await fs.copy(srcPath, destPath, { overwrite: true });
        } else {
          spinner.stop();
          const shouldOverwrite = await confirm(`  ⚠️  File exists: ${relativePath}. Overwrite?`);
          spinner.start();
          
          if (shouldOverwrite) {
            spinner.info(chalk.yellow(`  [UPDATED]     ${relativePath}`));
            await fs.copy(srcPath, destPath, { overwrite: true });
          } else {
            spinner.info(chalk.dim(`  [SKIPPED]     ${relativePath}`));
          }
        }
      } else {
        spinner.info(chalk.green(`  [NEW]         ${relativePath}`));
        await fs.copy(srcPath, destPath, { overwrite: true });
      }
    }
  }
}

// ============================================================================
// ACTIONS
// ============================================================================

const initAction = async (options) => {
  showBanner();
  const spinner = ora('Preparing agentic brain...').start();

  try {
    const exists = await fs.pathExists(destDir);
    if (exists) {
      spinner.info(chalk.cyan(`🔄 Existing ${chalk.bold('.agent')} folder detected. Smart Merge initiated.\n`));
    } else {
      spinner.info(chalk.cyan(`📦 Initializing new ${chalk.bold('.agent')} brain in this project...\n`));
      await fs.ensureDir(destDir);
    }

    await mergeDirectories(templateDir, destDir, options.force, spinner);

    const gitignorePath = path.join(targetDir, '.gitignore');
    const gitignoreEntry = '\n# Antigravity Agents\n.agent/\n';

    if (await fs.pathExists(gitignorePath)) {
      const content = await fs.readFile(gitignorePath, 'utf8');
      if (!content.includes('.agent/')) {
        await fs.appendFile(gitignorePath, gitignoreEntry);
      }
    } else {
      await fs.writeFile(gitignorePath, gitignoreEntry);
    }

    spinner.succeed(chalk.bold.green('✨ SUCCESS: Your AI brain has been upgraded.'));
  } catch (err) {
    spinner.fail(chalk.red(`Error: ${err.message}`));
  }
};

const setMasterAction = async () => {
  showBanner();
  const currentPath = process.cwd();
  
  if (!(await fs.pathExists(path.join(currentPath, 'templates')))) {
    console.log(chalk.red('❌ Error: This does not look like the Master Kit repository (no /templates folder).'));
    return;
  }

  await saveMasterPath(currentPath);
  console.log(chalk.green(`\n🏠 Headquarters Set: ${chalk.bold(currentPath)}`));
  console.log(chalk.dim('You can now run "sync" from any project to send improvements back here.\n'));
};

const syncAction = async (options) => {
  showBanner();
  const masterPath = await getMasterPath();

  if (!masterPath) {
    console.log(chalk.red('❌ Error: Master Kit path not set.'));
    console.log(chalk.yellow('💡 Run "init-agent set-master" inside your Master Kit repository first.'));
    return;
  }

  if (!(await fs.pathExists(destDir))) {
    console.log(chalk.red(`❌ Error: No ${chalk.bold('.agent')} folder found in this project to sync.`));
    return;
  }

  console.log(chalk.cyan(`📡 Syncing knowledge back to HQ: ${chalk.bold(masterPath)}...\n`));
  const spinner = ora('Merging improvements...').start();

  try {
    // Sync to root .agent of master
    const masterAgentDir = path.join(masterPath, '.agent');
    const masterTemplateDir = path.join(masterPath, 'templates', '.agent');

    spinner.text = 'Syncing to Master root...';
    await mergeDirectories(destDir, masterAgentDir, options.force, spinner, masterAgentDir);
    
    spinner.text = 'Syncing to Master templates...';
    await mergeDirectories(destDir, masterTemplateDir, options.force, spinner, masterTemplateDir);

    spinner.succeed(chalk.bold.green('✨ SUCCESS: Knowledge synced back to Master Kit.'));
    console.log(chalk.dim('Please go to your Master Kit folder and use "git diff" to review changes.\n'));
  } catch (err) {
    spinner.fail(chalk.red(`Sync failed: ${err.message}`));
  }
};

const statusAction = async () => {
  showBanner();
  const masterPath = await getMasterPath();

  if (await fs.pathExists(destDir)) {
    const stats = await fs.stat(destDir);
    const files = await fs.readdir(destDir, { recursive: true });
    console.log(chalk.green('  ✅ STATUS:  INSTALLED'));
    console.log(`  🏠 HQ:      ${masterPath ? chalk.cyan(masterPath) : chalk.yellow('Not set')}`);
    console.log(chalk.gray('  ────────────────────────────────────────'));
    console.log(`  📁 Path:     ${chalk.cyan(destDir)}`);
    console.log(`  📄 Items:    ${chalk.yellow(files.length)} files/folders`);
    console.log(chalk.gray('  ────────────────────────────────────────\n'));
  } else {
    console.log(chalk.red('  ❌ STATUS:  NOT INSTALLED'));
    console.log(chalk.yellow('  💡 Tip: Run "npx @trudyan141/antigravity-kit init" to start.\n'));
  }
};

// ============================================================================
// CLI CONFIGURATION
// ============================================================================

const program = new Command();
program.name('antigravity-kit').version('2.1.0');

program.command('init').alias('update').description('Install/Upgrade .agent kit').option('-f, --force', 'Force overwrite', false).action(initAction);
program.command('set-master').description('Set current directory as the Master Kit headquarters').action(setMasterAction);
program.command('sync').description('Sync local .agent changes back to Master Kit').option('-f, --force', 'Force overwrite', false).action(syncAction);
program.command('status').description('Check installation status').action(statusAction);

program.parse(process.argv);
if (!process.argv.slice(2).length) program.outputHelp();
