// Gulp
const { src, dest, parallel, series } = require("gulp");
const gulpClean = require("gulp-clean");
const uglify = require("gulp-uglify");
const replace = require("gulp-replace");
const gulpExtReplace = require("gulp-ext-replace");
const gulpFile = require("gulp-file");
const gulpZip = require("gulp-zip");

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

// Jatos
const {
  experiment_name,
  slug,
  jatos_file,
  components,
} = require("./jatos_study");

const BUILD_DIR = "dist";

const get_component_dest = (name) => `${BUILD_DIR}/source/${slug}/${name}`;

function clean() {
  return src(`${BUILD_DIR}/*`, { read: false }).pipe(gulpClean());
}

function javascript(name, file) {
  return function javascript() {
    return src(file)
      .pipe(
        rollup(
          {
            plugins: [
              typescript(),
              babel({
                babelHelpers: "bundled",
                exclude: /node_modules/,
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
}

function css(name) {
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
}

function html(name) {
  return function html() {
    return src("assets/index.html")
      .pipe(replace(/(style.css|index.js)/g, name + "/$1"))
      .pipe(
        replace(/<title>\w+<\/title>/g, `<title>${experiment_name}</title>`)
      )
      .pipe(dest(get_component_dest(name)));
  };
}

function createComponents() {
  const tasks = [];
  for (let [name, file] of Object.entries(components)) {
    tasks.push(javascript(name, file), html(name), css(name));
  }
  return parallel(...tasks);
}

function createJASFile() {
  return gulpFile(`${slug}.jas`, jatos_file, { src: true }).pipe(
    dest(`${BUILD_DIR}/source`)
  );
}

function zip() {
  return src(`${BUILD_DIR}/source/**/*`)
    .pipe(gulpZip(`${slug}.zip`))
    .pipe(dest(BUILD_DIR));
}

exports.build = series(clean, parallel(createComponents(), createJASFile), zip);
