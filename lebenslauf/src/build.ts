import { writeFileSync, mkdirSync, copyFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { join, dirname, resolve } from "path";
import { generateTypst } from "./generate-typst.js";

export interface BuildOptions {
  input: string;
  output: string;
}

export function buildPdf(options: BuildOptions): string {
  const { input, output } = options;
  const inputPath = resolve(input);
  const inputDir = dirname(inputPath);

  // Generate Typst source from YAML
  const typstSource = generateTypst(inputPath);

  // Ensure output directory exists
  mkdirSync(dirname(resolve(output)), { recursive: true });

  // Write Typst source + copy photo to tmp dir
  const tmpDir = join(dirname(resolve(output)), ".cv-tmp");
  mkdirSync(tmpDir, { recursive: true });

  const typstPath = join(tmpDir, "cv.typ");
  writeFileSync(typstPath, typstSource);

  // Copy photo if referenced
  const photoMatch = typstSource.match(/image\("([^"]+)"/);
  if (photoMatch) {
    const photoName = photoMatch[1];
    const photoSrc = join(inputDir, photoName);
    if (existsSync(photoSrc)) {
      copyFileSync(photoSrc, join(tmpDir, photoName));
    }
  }

  // Run Typst
  const outputPath = resolve(output);
  try {
    execSync(`typst compile "${typstPath}" "${outputPath}"`, {
      stdio: "inherit",
      cwd: tmpDir,
    });
  } catch {
    console.error("Typst compilation failed. Is Typst installed? (brew install typst)");
    process.exit(1);
  }

  // Clean up tmp
  try {
    execSync(`rm -rf "${tmpDir}"`);
  } catch {
    // ignore cleanup errors
  }

  return outputPath;
}
