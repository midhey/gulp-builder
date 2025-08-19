import { src } from "gulp";
import through2 from "through2";
import fs from "fs";
import path from "path";
import { paths as allPaths } from "../config.js";

const MODE = process.env.MODE === "wp" ? "wp" : "build";
const SRC = allPaths.src.fonts || "src/fonts/**/*.{woff,woff2}";
const DEST = allPaths[MODE].fonts || "dist/fonts";

export function fonts() {
  return src(SRC, { nodir: true, buffer: false }).pipe(
    through2.obj((file, _, cb) => {
      try {
        const abs = file.path;
        const disk = fs.readFileSync(abs);

        const ext = path.extname(abs).toLowerCase();
        if (ext === ".woff" || ext === ".woff2") {
          const magic = disk.slice(0, 4).toString("ascii");
          if (magic !== "wOFF" && magic !== "wOF2") {
            return cb(
              new Error(
                `Bad magic "${magic}" in ${path.relative(process.cwd(), abs)}`,
              ),
            );
          }
        }

        const relFromSrcFonts = path.relative(
          path.join(process.cwd(), "src/fonts"),
          abs,
        );
        const outPath = path.join(DEST, relFromSrcFonts);
        const outDir = path.dirname(outPath);

        let needWrite = true;

        if (fs.existsSync(outPath)) {
          const oldStat = fs.statSync(outPath);
          if (oldStat.size === disk.length) {
            const oldBuf = fs.readFileSync(outPath);
            if (oldBuf.equals(disk)) needWrite = false;
          }
        }

        if (!needWrite) return cb();

        fs.mkdirSync(outDir, { recursive: true });
        const tmp = path.join(
          outDir,
          `.tmp-${path.basename(outPath)}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        );
        fs.writeFileSync(tmp, disk);
        fs.renameSync(tmp, outPath);

        cb();
      } catch (e) {
        cb(e);
      }
    }),
  );
}
