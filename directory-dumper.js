#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { program } from "commander";
import ignore from "ignore";
import ora from "ora";
import chalk from "chalk";

// CLI setup
program
  .option("-d, --dir <path>", "Root directory to scan", ".")
  .option("-e, --ext <list>", "Only include extensions (comma-separated)", "")
  .option("-i, --ignore <patterns>", "Extra ignore patterns (comma-separated)", "")
  .option("--hidden", "Include hidden files", false)
  .option("-m, --max-size <mb>", "Skip files larger than N MB", "0")
  .option("--json", "Output as JSON")
  .option("--markdown", "Output as Markdown")
  .option("-o, --output <file>", "Write to file instead of stdout")
  .option("--show-skipped", "Show skipped files summary")
  .parse(process.argv);


const opts = program.opts();
const rootDir = path.resolve(opts.dir);
const maxSizeBytes = parseInt(opts.maxSize) * 1024 * 1024;

// Setup ignore
const ig = ignore();
try {
  const gitignore = await fs.readFile(path.join(rootDir, ".gitignore"), "utf8");
  ig.add(gitignore.split("\n"));
} catch (e) {}

// Add custom ignore
if (opts.ignore) ig.add(opts.ignore.split(","));

// Extension filter
const allowedExts = opts.ext ? opts.ext.split(",").map(e => "." + e) : [];

// Collect results
const results = [];
const skipped = [];

async function dumpDir(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(rootDir, fullPath);

    if (ig.ignores(relPath)) {
      if (opts.showSkipped) skipped.push({ file: relPath, reason: "gitignore" });
      continue;
    }
    if (!opts.hidden && entry.name.startsWith(".")) {
      if (opts.showSkipped) skipped.push({ file: relPath, reason: "hidden" });
      continue;
    }

    if (entry.isDirectory()) {
      await dumpDir(fullPath);
    } else {
      if (allowedExts.length > 0 && !allowedExts.includes(path.extname(entry.name))) {
        if (opts.showSkipped) skipped.push({ file: relPath, reason: "extension filter" });
        continue;
      }

      const stats = await fs.stat(fullPath);
      if (maxSizeBytes > 0 && stats.size > maxSizeBytes) {
        if (opts.showSkipped) skipped.push({ file: relPath, reason: "too large" });
        continue;
      }

      const content = await fs.readFile(fullPath, "utf8");

      if (opts.json) {
        results.push({ file: relPath, content });
      } else if (opts.markdown) {
        results.push(`### ${relPath}\n\`\`\`\n${content}\n\`\`\``);
      } else {
        results.push(`--- ${relPath} ---\n${content}\n`);
      }
    }
  }
}

// Run
const spinner = ora(`Scanning ${rootDir}`).start();
await dumpDir(rootDir);
spinner.succeed("Scan complete!");

// Output
let output;
if (opts.json) {
  output = JSON.stringify(results, null, 2);
} else {
  output = results.join("\n");
}

if (opts.output) {
  await fs.writeFile(opts.output, output, "utf8");
  console.log(chalk.green(`Output written to ${opts.output}`));
} else {
  console.log(output);
}

if (opts.showSkipped && skipped.length > 0) {
  console.log(chalk.yellow("\nSkipped files:"));
  skipped.forEach(s => console.log(`- ${s.file} (${s.reason})`));
}
