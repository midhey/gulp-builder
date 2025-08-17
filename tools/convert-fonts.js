#!/usr/bin/env node
import fs from "fs";
import path from "path";
import ttf2woff2 from "ttf2woff2";
import ttf2woff from "ttf2woff";
import otf2ttf from "otf2ttf";
import { Logger } from "./logger.js";

const fontsDir = "src/fonts";
const scssFile = "src/styles/base/_fonts.scss";

if (!fs.existsSync(fontsDir)) {
  console.error(`ERROR: Fonts folder not found (${fontsDir})`);
  process.exit(1);
}

const files = fs
  .readdirSync(fontsDir)
  .filter((f) => f.endsWith(".ttf") || f.endsWith(".otf"));
const logger = new Logger("Fonts Conversion", files.length);

let scssContent = "";

let i = 0;
for (const file of files) {
  try {
    const fontName = path.basename(file, path.extname(file));
    const inputPath = path.join(fontsDir, file);
    let ttfBuffer = fs.readFileSync(inputPath);

    if (file.endsWith(".otf")) {
      ttfBuffer = Buffer.from(otf2ttf(ttfBuffer).buffer);
      fs.writeFileSync(path.join(fontsDir, `${fontName}.ttf`), ttfBuffer);
    }

    // WOFF
    fs.writeFileSync(
      path.join(fontsDir, `${fontName}.woff`),
      Buffer.from(ttf2woff(new Uint8Array(ttfBuffer), {}).buffer),
    );

    // WOFF2
    fs.writeFileSync(
      path.join(fontsDir, `${fontName}.woff2`),
      ttf2woff2(ttfBuffer),
    );

    // SCSS
    scssContent += `
    @font-face {
      font-family: "${fontName}";
      src: url("../fonts/${fontName}.woff2") format("woff2"),
          url("../fonts/${fontName}.woff") format("woff");
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    `;

    logger.update(++i);
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
}

fs.writeFileSync(scssFile, scssContent);

logger.success();
