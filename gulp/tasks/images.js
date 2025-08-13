import gulp from "gulp";
import path from "node:path";
import { promises as fsp } from "node:fs";
import { globby } from "globby";
import sharp from "sharp";
import { paths as allPaths } from "../config.js";

const MODE = process.env.MODE === "wp" ? "wp" : "build";
const SRC_ALL =
  allPaths.src.images ?? "src/images/**/*.{png,jpg,jpeg,svg,gif,ico}";
const SRC_RASTER =
  allPaths.src.imagesRaster ?? "src/images/**/*.{png,jpg,jpeg}";
const DEST_ORIG = allPaths[MODE].images;
const DEST_WEBP = DEST_ORIG;

async function isChanged(src, dest) {
  try {
    const [srcStat, destStat] = await Promise.all([
      fsp.stat(src),
      fsp.stat(dest),
    ]);
    return srcStat.mtimeMs > destStat.mtimeMs;
  } catch {
    return true;
  }
}

export async function imagesCopy() {
  const files = await globby(SRC_ALL, { onlyFiles: true });
  let processed = 0;

  await Promise.all(
    files.map(async (src) => {
      const rel = path
        .relative(path.join(process.cwd(), "src"), src)
        .replace(/^img[\\/]/, "")
        .replace(/^images[\\/]/, "");
      const dst = path.join(DEST_ORIG, rel);

      if (await isChanged(src, dst)) {
        await fsp.mkdir(path.dirname(dst), { recursive: true });
        await fsp.copyFile(src, dst);
        processed++;
      }
    }),
  );

  console.log(`[imagesCopy] processed: ${processed} files`);
}

export async function imagesWebp() {
  const files = await globby(SRC_RASTER, { onlyFiles: true });
  let processed = 0;

  await Promise.all(
    files.map(async (src) => {
      const rel = path
        .relative(path.join(process.cwd(), "src"), src)
        .replace(/^img[\\/]/, "")
        .replace(/^images[\\/]/, "");
      const dst = path.join(DEST_WEBP, rel).replace(/\.(png|jpe?g)$/i, ".webp");

      if (await isChanged(src, dst)) {
        await fsp.mkdir(path.dirname(dst), { recursive: true });
        await sharp(src).webp({ quality: 80, effort: 4 }).toFile(dst);
        processed++;
      }
    }),
  );

  console.log(`[imagesWebp] processed: ${processed} files`);
}

export const images = gulp.series(imagesCopy, imagesWebp);
