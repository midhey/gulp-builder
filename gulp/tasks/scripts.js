import gulp from "gulp";
import path from "node:path";
import webpack from "webpack";
import webpackStream from "webpack-stream";
import { paths as allPaths } from "../config.js";
import { bs } from "../utils/bs.js";

const MODE = process.env.MODE === "wp" ? "wp" : "build";
const isProd = process.env.NODE_ENV === "production";

export function scripts() {
  const rawEntry = allPaths.src.jsEntry ?? "src/js/main.js";
  const entry = path.resolve(process.cwd(), rawEntry);
  const outDir = allPaths[MODE].js;
  const filename = "main.min.js";

  const webpackConfig = {
    context: process.cwd(),
    mode: isProd ? "production" : "development",
    entry,
    output: {
      filename,
      library: { type: "var", name: "App" },
      chunkFormat: "array-push",
    },
    target: "web",
    devtool: isProd ? false : "source-map",
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: "defaults", modules: false }],
              ],
            },
          },
        },
      ],
    },
    optimization: {
      minimize: isProd,
    },
    infrastructureLogging: { level: "error" },
    stats: "errors-warnings",
    resolve: {
      alias: { "@": path.resolve(process.cwd(), "src/js") },
      extensions: [".js"],
    },
  };

  return gulp
    .src(rawEntry, { allowEmpty: true })
    .pipe(
      webpackStream(webpackConfig, webpack).on("error", function (err) {
        console.error(err.toString());
        this.emit("end");
      }),
    )
    .pipe(gulp.dest(outDir))
    .on("end", () => bs.reload());
}
