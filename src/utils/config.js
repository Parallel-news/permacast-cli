import Configstore from "configstore";
const config = new Configstore("PERMACAST-CLI");

export async function setConfig(key, data) {
  config.set(key, data);
}

export async function hasConfig(key) {
  return config.has(key);
}

export async function getConfig(key) {
  return config.get(key);
}

export async function delConfig(key) {
  return config.delete(key);
}

// utils
export async function hasSavedKeyfile() {
  return (await hasConfig("keyfile")) ? true : false;
}
