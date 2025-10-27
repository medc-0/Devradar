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

    for (const project of projects)
}