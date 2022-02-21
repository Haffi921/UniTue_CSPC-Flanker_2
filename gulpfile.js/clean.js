const { src } = require("gulp");
const gulpClean = require("gulp-clean");

module.exports = function clean(path) {
  return () => src(path, { read: false }).pipe(gulpClean());
};
