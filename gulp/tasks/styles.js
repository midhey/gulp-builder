import gulp from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import { bs } from "../utils/bs.js";
import { paths as allPaths } from "../config.js";

const MODE = process.env.MODE === "wp" ? "wp" : "build";

const scss = gulpSass(dartSass);

export function styles() {
  return gulp
    .src(allPaths.src.scssEntry ?? allPaths.src.scss, { sourcemaps: true })
    .pipe(scss().on("error", scss.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(allPaths[MODE].css, { sourcemaps: "." }))
    .pipe(bs.stream());
}
