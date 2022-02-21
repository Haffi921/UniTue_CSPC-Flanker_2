const path = require("path");
const fs = require("fs");
const { default: slugify } = require("slugify");
const { exit } = require("process");

const uuid = require("uuid").v4;

const validate_uuid = (uuid) =>
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(uuid);
const create_slug = (str) => slugify(str, { replacement: "_", lower: true });

function getFile(fileName, vital = true) {
  function readJSONFile(file) {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  }

  try {
    return readJSONFile(fileName);
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
    if (vital) {
      console.error(`File '${fileName}' not found`);
      exit(1);
    }
    return undefined;
  }
}

function saveJSONFile(fileName, content) {
  fs.writeFileSync(fileName, JSON.stringify(content, null, 4));
}

function resolveEntry(entry) {
  let resolved_entry = false;
  try {
    if (!fs.lstatSync(entry).isFile()) {
      entry = path.resolve(entry, "index.ts");
    }
    if (fs.lstatSync(entry).isFile()) {
      resolved_entry = entry;
    }
  } catch (e) {
    if (e.code === "ENOENT") {
      try {
        entry += ".ts";
        if (fs.lstatSync(entry).isFile()) {
          resolved_entry = entry;
        }
      } catch (e) {}
    }
  }
  return resolved_entry;
}

function getEntries(entryList) {
  function entryFilter(entries, item) {
    let entry = resolveEntry(path.resolve(entryList[item]));
    if (entry) entries[item] = entry;
    return entries;
  }
  return Object.keys(entryList).reduce(entryFilter, {});
}

function createLockedComponent(component) {
  return {
    uuid: uuid(),
    title: component,
    htmlFilePath: `${component}/index.html`,
  };
}

function createLockedExperiment(title, dirName) {
  return {
    uuid: uuid(),
    title,
    dirName,
    componentList: [],
  };
}

function createLockFile(experiment_name, slug, entries) {
  let lock_file = getFile("jatos-lock.json", false);
  let save_lock = false;

  if (!lock_file) {
    // No lock file exists so we create one with information from json file
    lock_file = createLockedExperiment(experiment_name, slug);
    lock_file.componentList = entries.map(createLockedComponent);
    save_lock = true;
  } else {
    // A lock file exists so we compare the values for changes
    // Experiment Name
    if (lock_file.title !== experiment_name) {
      lock_file.title = experiment_name;
      lock_file.dirName = slug;
      save_lock = true;
    }

    const new_list = [];

    for (let entry of entries) {
      const existing_component = lock_file.componentList.find(
        (item) => entry === item.title
      );
      if (existing_component) {
        if (validate_uuid(existing_component.uuid)) {
          new_list.push(existing_component);
          continue;
        }
      }
      new_list.push(createLockedComponent(entry));
      save_lock = true;
    }

    if (lock_file.componentList.length !== new_list.length || save_lock) {
      lock_file.componentList = new_list;
      save_lock = true;
    }
  }

  if (save_lock) {
    saveJSONFile("jatos-lock.json", lock_file);
  }

  return { lock_file, save_lock };
}

function getJatosConfig(lock_file) {
  return JSON.stringify({
    version: "3",
    data: lock_file,
  });
}

const jatos_json = getFile("jatos.json");

const experiment_title = jatos_json.title;
const slug = create_slug(experiment_title);
const entries = getEntries(jatos_json.components);

const jatos_config = getJatosConfig(
  createLockFile(experiment_title, slug, Object.keys(entries))
);

module.exports = {
  experiment_name,
  slug,
  entries,
  jatos_config,
};
