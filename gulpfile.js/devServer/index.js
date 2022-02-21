const { argv } = require("yargs");

const { src, series, parallel, watch } = require("gulp");
const connect = require("gulp-connect");

const clean = require("../clean");
const { createComponent } = require("../build/components");

const { experiment_title, entries } = require("../jatos");

function devServer() {
  connect.server({
    root: "dist/.server",
    livereload: true,
  });
}

function getComponent(name) {
  return Object.entries(entries).reduce((file, [entry, path]) => {
    if (entry === name) file = path;
    return file;
  }, "");
}

function serveComponent() {
  return createComponent(
    experiment_title,
    getComponent("experiment"),
    "dist/.server"
  );
}

function fileWatch() {
  // const reload = () =>
  //   series(serveComponent, src("dist/.server/*").pipe(connect.reload()));
  return watch(
    ["src/**/*", "style/**/*"],
    {
      events: "change",
      delay: 1000,
    },
    refresh
  );
}

const refresh = series(
  clean("dist/.server/*"),
  serveComponent(),
  function restart() {
    return src("dist/.server/*").pipe(connect.reload());
  }
);

const serve = series(
  clean("dist/.server/*"),
  serveComponent(),
  parallel(devServer, fileWatch)
);

module.exports = serve;
