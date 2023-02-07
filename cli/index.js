#! /usr/bin/env node

import { extractClassInfo } from "../dist/index.js";
import { Command } from "commander";
import { createRequire } from "module";
import inquirer from "inquirer";
import { readFileSync } from "fs";
import chalk from "chalk";

const program = new Command();

program
  .name("as-heap-analyzer")
  .description("tooling for analysis heap status for assemblyscript")
  .version(createRequire(import.meta.url)("../package.json").version);

program
  .command("frame")
  .description("analysis memory usage for one frame heap data")
  .argument("<wasm module>", "file path of transformed wasm moudle")
  .action(async (wasmPath) => {
    console.log(wasmPath);
    const wasm = readFileSync(wasmPath);
    const classInfo = extractClassInfo(wasm);
    const prompt = inquirer.createPromptModule();
    let answer = await prompt({
      type: "input",
      name: "trace",
      message: "input json format trace from assemblyscript running log",
    });
    const trace = JSON.parse(answer.trace);
    console.log(`total memory usage is ${chalk.greenBright(trace.totalUsage)}`);
    for (const k in trace.classDetail) {
      console.log(`  class ${chalk.greenBright(classInfo[k])} use ${chalk.greenBright(trace.classDetail[k])} bytes`);
    }
  });

program.parse();
