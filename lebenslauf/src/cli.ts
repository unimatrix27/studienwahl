#!/usr/bin/env node

import { Command } from "commander";
import { buildPdf } from "./build.js";
import { initCv } from "./init.js";

const program = new Command();

program
  .name("cv")
  .description("CLI tool to build a polished PDF CV from YAML")
  .version("1.0.0");

program
  .command("build")
  .description("Compile YAML to PDF")
  .option("-i, --input <path>", "Path to CV YAML file", "cv.yaml")
  .option("-o, --output <path>", "Output PDF path", "output/cv.pdf")
  .action((opts) => {
    console.log(`Building CV from ${opts.input}...`);
    const outputPath = buildPdf({
      input: opts.input,
      output: opts.output,
    });
    console.log(`PDF created: ${outputPath}`);
  });

program
  .command("init")
  .description("Create an example CV YAML file")
  .option("-o, --output <path>", "Output file path", "cv.yaml")
  .action((opts) => {
    initCv(opts.output);
  });

program.parse();
