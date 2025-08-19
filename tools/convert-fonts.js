#!/usr/bin/env node
import fs from "fs";
import path from "path";
import ttf2woff2 from "ttf2woff2";
import ttf2woff from "ttf2woff";
import otf2ttf from "otf2ttf";
import crypto from "crypto";
import { Logger } from "./logger.js";

const fontsDir = "src/fonts";
const scssFile = "src/styles/base/_fonts.scss";

if (!fs.existsSync(fontsDir)) {
  console.error(`ERROR: Fonts folder not found (${fontsDir})`);
  process.exit(1);
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function writeAtomicIfChanged(targetPath, buffer) {
  const dir = path.dirname(targetPath);
  const tmp = path.join(
    dir,
    `.tmp-${path.basename(targetPath)}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`,
  );

  if (fs.existsSync(targetPath)) {
    const existing = fs.readFileSync(targetPath);
    if (
      existing.length === buffer.length &&
      sha256(existing) === sha256(buffer)
    ) {
      return false;
    }
  }

  fs.writeFileSync(tmp, buffer);
  fs.renameSync(tmp, targetPath);
  return true;
}

function assertMagic(filePath, expected) {
  const fd = fs.openSync(filePath, "r");
  const magic = Buffer.alloc(4);
  fs.readSync(fd, magic, 0, 4, 0);
  fs.closeSync(fd);
  const m = magic.toString("ascii");
  if (m !== expected) {
    throw new Error(
      `Bad magic "${m}" in ${path.relative(process.cwd(), filePath)}`,
    );
  }
}

function fontFamilyFromFile(base) {
  return base.replace(/[_-]+/g, " ");
}

const entries = new Map();
for (const f of fs.readdirSync(fontsDir)) {
  const ext = path.extname(f).toLowerCase();
  const base = path.basename(f, ext);
  if (!entries.has(base)) entries.set(base, {});
  entries.get(base)[ext.slice(1)] = path.join(fontsDir, f);
}

const bases = [...entries.keys()].sort((a, b) => a.localeCompare(b));

const logger = new Logger("Fonts Conversion", bases.length);
let scssContent = "";

let i = 0;
for (const base of bases) {
  try {
    const e = entries.get(base);

    let ttfBuffer = null;

    if (e.ttf || e.otf) {
      if (e.otf && !e.ttf) {
        const otfBuf = fs.readFileSync(e.otf);
        ttfBuffer = Buffer.from(otf2ttf(otfBuf).buffer);
        const ttfOut = path.join(fontsDir, `${base}.ttf`);
        const changed = writeAtomicIfChanged(ttfOut, ttfBuffer);
        if (changed) {
        }
        e.ttf = ttfOut;
      } else if (e.ttf) {
        ttfBuffer = fs.readFileSync(e.ttf);
      }
    }

    if (ttfBuffer) {
      const woffOut = path.join(fontsDir, `${base}.woff`);
      const woffBuf = Buffer.from(
        ttf2woff(new Uint8Array(ttfBuffer), {}).buffer,
      );
      const woffChanged = writeAtomicIfChanged(woffOut, woffBuf);
      if (woffChanged || !e.woff) {
        assertMagic(woffOut, "wOFF");
        e.woff = woffOut;
      }

      const woff2Out = path.join(fontsDir, `${base}.woff2`);
      const woff2Buf = ttf2woff2(ttfBuffer);
      const woff2Changed = writeAtomicIfChanged(woff2Out, woff2Buf);
      if (woff2Changed || !e.woff2) {
        assertMagic(woff2Out, "wOF2");
        e.woff2 = woff2Out;
      }
    }

    if (e.woff && e.woff2) {
      const family = fontFamilyFromFile(base);
      scssContent += `
      @font-face {
        font-family: "${family}";
        src: url("../fonts/${base}.woff2") format("woff2"),
            url("../fonts/${base}.woff") format("woff");
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }`;
    }

    logger.update(++i);
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
}

writeAtomicIfChanged(scssFile, Buffer.from(scssContent, "utf8"));
logger.success();
