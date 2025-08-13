import gulp from "gulp";
import fileInclude from "gulp-file-include";
import replace from "gulp-replace";
import webpHTML from "gulp-webp-html-nosvg";
import { paths as allPaths } from "../config.js";

const MODE = process.env.MODE === "wp" ? "wp" : "build";

export function html(cb) {
  if (MODE === "wp") return cb();

  return gulp
    .src(allPaths.src.html)
    .pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
    .pipe(replace(/@images\//g, "images/"))
    .pipe(webpHTML())
    .pipe(gulp.dest(allPaths[MODE].root));
}
