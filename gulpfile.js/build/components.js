// Gulp
const { parallel, src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const replace = require("gulp-replace");
const gulpExtReplace = require("gulp-ext-replace");
const gulpIf = require("gulp-if");
//const sourcemaps = require("gulp-sourcemaps");

// Rollup
const rollup = require("gulp-better-rollup");
const { babel } = require("@rollup/plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");

// SCSS/CSS
const concatCss = require("gulp-concat-css");
const cssNano = require("gulp-cssnano");
const sass = require("gulp-sass")(require("node-sass"));
const tildeImporter = require("node-sass-tilde-importer");

function javascript(file_path, dest_path) {
  return function javascript() {
    return (
      src(file_path)
        //.pipe(sourcemaps.init())
        .pipe(
          rollup(
            {
              plugins: [
                typescript(),
                babel({
                  babelHelpers: "bundled",
                  exclude: [/node_modules/],
                }),
                nodeResolve(),
                commonjs(),
              ],
            },
            "umd"
          )
        )
        .pipe(uglify())
        .pipe(gulpExtReplace(".js"))
        //.pipe(sourcemaps.write())
        .pipe(dest(dest_path))
    );
  };
}

function css(dest_path) {
  return function css() {
    return src("styles/*.scss")
      .pipe(
        sass({
          outputStyle: "compressed",
          includePaths: ["node_modules"],
          sourceMap: true,
          importer: tildeImporter,
        })
      )
      .pipe(concatCss("style.css"))
      .pipe(cssNano())
      .pipe(dest(dest_path));
  };
}

function html(title, slug, dest_path, inject = true) {
  return function html() {
    return (
      src("assets/index.html")
        .pipe(gulpIf(inject, replace(/(style.css|index.js)/g, slug + "/$1")))
        //.pipe(replace(/(style.css|index.js)/g, slug + "/$1"))
        .pipe(replace(/<title>\w+<\/title>/g, `<title>${title}</title>`))
        .pipe(dest(dest_path))
    );
  };
}

function createComponents(title, entries, path) {
  const tasks = [];
  const entryList = Object.entries(entries);
  for (let [name, file] of entryList) {
    const dest_path = entryList.length === 1 ? path : `${path}/${name}`;
    tasks.push(
      javascript(file, dest_path),
      css(dest_path),
      html(title, name, dest_path, entryList.length > 1)
    );
  }
  return parallel(...tasks);
}

module.exports = {
  createComponents,
};
