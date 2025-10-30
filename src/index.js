import fs from "fs";
import path from "path";
import chalk from "chalk";
import Table from "cli-table3";
import simpleGit from "simple-git";

export async function scanProjects(folderpath, options = {}) {
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

  const results = [];

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

    const { summary, totalLines, raw } = analyzeProject(fullPath);
    results.push({ project, languages: raw, summary, totalLines, lastCommit });

    table.push([
      chalk.cyan(project),
      summary,
      chalk.yellow(totalLines.toString()),
      chalk.gray(lastCommit),
    ]);
  }

  console.log(chalk.greenBright(`\n Scanned ${projects.length} projects\n`));
  console.log(table.toString());

  // JSON Export
  if (options.json) {
    fs.writeFileSync("report.json", JSON.stringify(results, null, 2));
    console.log(chalk.green("\n[✓] report.json created!\n"));
  }

  // HTML Export
  if (options.html) {
    const html = generateHTMLReport(results);
    fs.writeFileSync("report.html", html, "utf8");
    console.log(chalk.green("\n[✓] report.html created!\n"));
  }
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
    "node_modules",
    ".venv",
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

  return { summary, totalLines, raw: lineCounts };
}

/*
 * HTML Report
 */
function generateHTMLReport(data) {
  const rows = data
    .map(
      (d) => `
    <tr>
      <td>${d.project}</td>
      <td>${d.summary}</td>
      <td>${d.totalLines}</td>
      <td>${d.lastCommit}</td>
    </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DevRadar Report</title>
<style>
body { font-family: 'Segoe UI', sans-serif; background: #0e1116; color: #e5e5e5; padding: 30px; }
h1 { color: #00ff99; }
table { width: 100%; border-collapse: collapse; margin-top: 20px; }
th, td { border: 1px solid #222; padding: 10px; text-align: left; }
th { background: #1a1f27; color: #00ff99; }
tr:nth-child(even) { background: #1b1f24; }
tr:hover { background: #272e38; }
small { color: #888; }
</style>
</head>
<body>
  <h1>DevRadar Report</h1>
  <small>Generated on ${new Date().toLocaleString()}</small>
  <table>
    <tr>
      <th>Project</th>
      <th>Languages</th>
      <th>Lines</th>
      <th>Last Commit</th>
    </tr>
    ${rows}
  </table>
</body>
</html>`;
}
