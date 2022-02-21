const { src, dest, parallel, series } = require("gulp");

const gulpFile = require("gulp-file");
const gulpZip = require("gulp-zip");

const { BUILD_DIR } = require("./util");
const { javascript, css, html } = require("./filetypes");

const { experiment_title, slug, entries, jatos_config } = require("./jatos");

function createComponents() {
  const tasks = [];
  for (let [name, file] of Object.entries(entries)) {
    tasks.push(javascript(name, file), html(name), css(name));
  }
  return parallel(...tasks);
}

function createJASFile() {
  return gulpFile(`${slug}.jas`, jatos_config, { src: true }).pipe(
    dest(`${BUILD_DIR}/source`)
  );
}

function zip() {
  return src(`${BUILD_DIR}/source/**/*`)
    .pipe(gulpZip(`${slug}.zip`))
    .pipe(dest(BUILD_DIR));
}

module.exports = series(parallel(createComponents(), createJASFile), zip);
