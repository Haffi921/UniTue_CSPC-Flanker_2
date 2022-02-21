// Gulp
const { src, dest } = require("gulp");
const uglify = require("gulp-uglify");
const replace = require("gulp-replace");
const gulpExtReplace = require("gulp-ext-replace");

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

const { BUILD_DIR } = require("./util");
const { experiment_title, slug } = require("./jatos");

const get_component_dest = (name) => `${BUILD_DIR}/source/${slug}/${name}`;

module.exports.javascript = function (name, file) {
  return function javascript() {
    return src(file)
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
      .pipe(dest(get_component_dest(name)));
  };
};

module.exports.css = function (name) {
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
      .pipe(dest(get_component_dest(name)));
  };
};

module.exports.html = function (name) {
  return function html() {
    return src("assets/index.html")
      .pipe(replace(/(style.css|index.js)/g, name + "/$1"))
      .pipe(
        replace(/<title>\w+<\/title>/g, `<title>${experiment_title}</title>`)
      )
      .pipe(dest(get_component_dest(name)));
  };
};
