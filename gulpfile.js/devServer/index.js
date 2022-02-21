const { argv } = require("yargs");

const { series, parallel, watch } = require("gulp");
const connect = require("gulp-connect");

const clean = require("../clean");
const { createComponents } = require("../build/components");

const { experiment_title, entries } = require("../jatos");

function devServer() {
  connect.server({
    root: "dist/.server",
    livereload: true,
  });
}

function getComponent(name) {
  return Object.entries(entries).reduce((obj, [entry, path]) => {
    if (entry === name) obj[entry] = path;
    return obj;
  }, {});
}

function serveComponent() {
  return createComponents(
    experiment_title,
    getComponent("experiment"),
    "dist/.server"
  );
}

const serve = series(clean("dist/.server/*"), serveComponent(), devServer);

module.exports = serve;
