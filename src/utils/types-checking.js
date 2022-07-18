import axios from "axios";

export function checkFileExtension(path, extension) {
  try {
    const pathArray = path.split(".");
    const expectedExtensionIndex = pathArray.length - 1;
    const isJson =
      pathArray[expectedExtensionIndex] === extension ? true : false;

    return isJson;
  } catch (error) {
    return false;
  }
}

export function isParsable(stringified) {
  try {
    JSON.parse(stringified);

    return true;
  } catch (error) {
    return false;
  }
}
