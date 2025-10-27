import fs from "fs";
import path from "path";
import chalk from "chalk";
import Table from "cli-table3";
import simpleGit from "simple-git";

export async function scanProjects(folderpath) {
  if (!fs.existsSync(folderpath)) {
    console.error(chalk.red("[X] Folder not found!"));
    process.exit(1);
  }

  const projects = fs
    .readdirSync(folderpath)
    .filter((f) => fs.statSync(path.join(folderpath, f)).isDirectory());

  if (projects.length === 0) {
    console.log(chalk.yellow("[i] No sub-folders found."));
    return;
  }

  const table = new Table({
    head: ["Project", "Languages", "Lines", "Last Commit"],
    colWidths: [20, 35, 12, 20],
  });

  for (const project of projects) {
    const fullPath = path.join(folderpath, project);
    const git = simpleGit(fullPath);
    const isGit = fs.existsSync(path.join(fullPath, ".git"));
    let lastCommit = "—";

    if (isGit) {
      try {
        const log = await git.log({ maxCount: 1 });
        lastCommit = log.latest?.date?.split("T")[0] || "—";
      } catch {
        lastCommit = "No commits";
      }
    }

    const { summary, totalLines } = analyzeProject(fullPath);
    table.push([
      chalk.cyan(project),
      summary,
      chalk.yellow(totalLines.toString()),
      chalk.gray(lastCommit),
    ]);
  }

  console.log(chalk.greenBright(`\n Scanned ${projects.length} projects\n`));
  console.log(table.toString());
}

/**
 * Analyzes a folder to find languages and count lines.
 */
function analyzeProject(folder) {
  const lineCounts = {};
  const ignoreExts = [
    ".png",
    ".jpg",
    ".jpeg",
    ".exe",
    ".dll",
    ".zip",
    ".sample",
    ".lnk",
  ];
  const textExts = [
    ".js",
    ".ts",
    ".py",
    ".html",
    ".css",
    ".lua",
    ".json",
    ".md",
    ".cpp",
    ".c",
    ".h",
    ".hpp",
    ".cs",
    ".java",
  ];

  function walk(dir) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) walk(full);
      else {
        const ext = path.extname(file).toLowerCase();
        if (ignoreExts.includes(ext)) continue;

        if (textExts.includes(ext)) {
          const content = fs.readFileSync(full, "utf8");
          const lines = content.split(/\r?\n/).length;
          lineCounts[ext] = (lineCounts[ext] || 0) + lines;
        }
      }
    }
  }

  walk(folder);

  const totalLines = Object.values(lineCounts).reduce((a, b) => a + b, 0);
  const extMap = {
    ".js": "JavaScript",
    ".ts": "TypeScript",
    ".py": "Python",
    ".html": "HTML",
    ".css": "CSS",
    ".lua": "Lua",
    ".json": "JSON",
    ".md": "Markdown",
    ".cpp": "C++",
    ".c": "C",
    ".h": "C Header",
    ".hpp": "C++ Header",
    ".cs": "C#",
    ".java": "Java",
  };

  const summary = Object.entries(lineCounts)
    .map(([ext, count]) => {
      const percent = ((count / totalLines) * 100).toFixed(1);
      return `${extMap[ext] || ext} (${percent}%)`;
    })
    .join(", ");

  return { summary, totalLines };
}
