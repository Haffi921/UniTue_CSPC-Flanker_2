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

module.exports = series(
  clean,
  parallel(createComponents(), createJASFile),
  zip
);
