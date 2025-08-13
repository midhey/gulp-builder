import path from "path";

export const paths = {
  src: {
    html: "src/**/*.html",
    scss: "src/styles/**/*.scss",
    scssEntry: "src/styles/main.scss",
    js: "src/js/**/*.js",
    jsEntry: "src/js/main.js",
    images: "src/images/**/*.{png,jpg,jpeg,svg,gif,ico}",
    imagesRaster: "src/images/**/*.{png,jpg,jpeg}",
    fonts: "src/fonts/**/*.{ttf,otf}",
  },
  build: {
    root: "dist",
    css: "dist/css",
    js: "dist/js",
    images: "dist/images",
    fonts: "dist/fonts",
  },
  wp: {
    root: "theme/assets",
    css: "theme/assets/css",
    js: "theme/assets/js",
    images: "theme/assets/images",
    fonts: "theme/assets/fonts",
  },
};
