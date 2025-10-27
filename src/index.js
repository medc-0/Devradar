import fs from "fs";
import path from "path";
import chalk from "chalk";
import Table from "cli-table3";
import simpleGit from "simple-git";

export async function scanProjects(folderpath) {
    if (!fs.existsSync(folderpath)) {
        console.error(chalk.red("[X] Folder not found!"))
        process.exit(1)
    }

    const projects = fs.readdirSync(folderpath)
    .filter(f => fs.statSync(path.join(folderpath, f)).isDirectory())

    if (projects.length === 0) {
        console.log(chalk.yellow("[i] No sub-folders found."))
        return;
    }

    const table = new Table({
        head: ["Project", "Languages", "Last Commit"],
        colWidths: [25, 25, 25]
    })

    for (const project of projects) {
        const fullPath = path.join(folderpath, project)
        const git = simpleGit(fullPath)
        const isGit = fs.existsSync(path.join(fullPath, ".git"))
        let lastCommit = "—"

        if (isGit) {
            try {
                const log = await git.log({ maxCount: 1})
                lastCommit = log.latest?.date?.split("T")[0] || "—"
            } catch {
                lastCommit = "No commits"
            }
        }

        const langs = detectLanguages(fullpath)
        table.push([chalk.cyan(project), langs, chalk.grey(lastCommit)])
    }

    console.log(chalk.greenBright(`\n Scanned ${projects.length} projects\n`))
    console.log(table.toString())
}

function detectLanguages(folder) {
    const extensions = new Set()

    function walk(dir) {
        for (const file of fs.readdirSync(dir)) {
            const full = path.join(dir, file)
            if (fs.statSync(full).isDirectory()) walk(full);
            else {
                const ext = path.extname(file)
                if (ext) extensions.add(ext)
            }
        }
    }

    walk(folder)

    const extMap = {
        ".js": "Javascript",
        ".ts": "Typescript",
        ".py": "Python",
        ".lua": "Lua",
        ".html": "HTML",
        ".css": "CSS",
        ".java": "Java",
        ".rs": "Rust",
        ".swift": "Swift",
        ".kt": "Kotlin",
        ".cpp": "C++",
        ".c": "C",
        ".cs": "C#",
        ".h": "C-Header",
        ".hpp": "C++ Header"
    }
}