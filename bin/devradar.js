#!/usr/bin/env node
import { Command } from "commander";
import { scanProjects } from "../src/index.js";

const program = new Command();

program
  .name("devradar")
  .description("Analyze your coding projects and display stats")
  .version("0.1.0");

program
  .command("scan")
  .argument("<path>", "Path to your peojects folder")
  .description("Scan all projects in the given folder")
  .action(scanProjects);
  
program.parse();
