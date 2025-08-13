import gulp from "gulp";
import { paths as allPaths } from "./gulp/config.js";
import { clean } from "./gulp/tasks/clean.js";
import { styles } from "./gulp/tasks/styles.js";
import { scripts } from "./gulp/tasks/scripts.js";
import { html } from "./gulp/tasks/html.js";
import { fonts } from "./gulp/tasks/fonts.js";
import { images, imagesCopy, imagesWebp } from "./gulp/tasks/images.js";
import { bs } from "./gulp/utils/bs.js";

const MODE = process.env.MODE === "wp" ? "wp" : "build";
const paths = allPaths[MODE];

export const build = gulp.series(
  clean(paths.root),
  gulp.parallel(styles, scripts, html, fonts, images),
);

export function serve() {
  bs.init({ server: paths.root, notify: false, open: false });
  gulp.watch(allPaths.src.scss, styles);
  gulp.watch(
    allPaths.src.js,
    gulp.series(scripts, (done) => {
      done();
    }),
  );
  gulp.watch(allPaths.src.html, html).on("change", bs.reload);
  gulp.watch(
    allPaths.src.images,
    gulp.series(imagesCopy, (done) => {
      bs.reload();
      done();
    }),
  );
  gulp.watch(
    allPaths.src.imagesRaster,
    gulp.series(imagesWebp, (done) => {
      bs.reload();
      done();
    }),
  );
  gulp.watch(
    allPaths.src.fonts,
    gulp.series(fonts, (done) => {
      bs.reload();
      done();
    }),
  );
}

export const dev = gulp.series(build, serve);
export default dev;
