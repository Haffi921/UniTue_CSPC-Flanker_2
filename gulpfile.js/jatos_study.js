const path = require("path");
const fs = require("fs");
const { default: slugify } = require("slugify");

const uuid = require("uuid").v4;

function getJatosFile(title, dirName, components) {
  const componentList = [];

  for (let component of Object.keys(components)) {
    componentList.push({
      uuid: uuid(),
      title: component,
      htmlFilePath: component + "/index.html",
    });
  }

  return {
    version: "3",
    data: {
      uuid: uuid(),
      title,
      dirName,
      componentList,
    },
  };
}

const json = JSON.parse(fs.readFileSync("src/jatos.config.json", "utf-8"));

const experiment_name = json.name;
const slug = slugify(experiment_name, {
  replacement: "_",
  lower: true,
});
const components = Object.keys(json.components).reduce((entries, item) => {
  let entry = path.resolve(`src/${json.components[item]}`);
  try {
    if (!fs.lstatSync(entry).isFile()) {
      entry = path.resolve(entry, "index.ts");
    }
    if (fs.lstatSync(entry).isFile()) {
      entries[item] = entry;
    }
  } finally {
    return entries;
  }
}, {});

const jatos_file = JSON.stringify(
  getJatosFile(experiment_name, slug, components)
);

module.exports = {
  experiment_name,
  slug,
  components,
  jatos_file,
};
