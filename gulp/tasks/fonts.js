import gulp from "gulp";
import { paths as allPaths } from "../config.js";

const MODE = process.env.MODE === "wp" ? "wp" : "build";

export function fonts() {
  return gulp
    .src("src/fonts/**/*.{woff,woff2}")
    .pipe(gulp.dest(allPaths[MODE].fonts));
}
