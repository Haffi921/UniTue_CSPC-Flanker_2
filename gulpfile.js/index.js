const { series } = require("gulp");

const BUILD_DIR = require("./util");
const clean = require("./clean");
const build = require("./build");

exports.build = series(clean(`${BUILD_DIR}/*`), build);
