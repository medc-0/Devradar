#!/usr/bin/env node
import { Command } from "commander";
import { scanProjects } from "../src/index.js";

const program = new Command();

program
  .name("devradar")
  .description("Analyze your coding projects and display stats.")
  .version("1.2.0");

program
  .command("scan")
  .argument("<path>", "Path to your projects folder")
  .option("--json", "Exports report as JSON")
  .option("--html", "Export report as HTML")
  .description("Scan all projects in the given folder")
  .action((path, options) => {
    scanProjects(path, options);
  });

program.parse();
