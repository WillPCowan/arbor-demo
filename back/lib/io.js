import fs from "fs";
import path from "path";

/**
 * Remove the "/<pathComponent>" at the end of the path
 * @param {*} uri
 * @returns
 */
// ! Same as path.dirname() :(((((
function removeEndPathComponent(uri) {
  let components = uri.split("/");
  components.pop();
  return components.join("/");
}

/**
 * Create a directory if it doesn't already exist.
 * @param {*} dirURI
 * @returns
 */
export function createDirectory(dirURI) {
  if (fs.existsSync(dirURI)) {
    return true;
  }
  createDirectory(path.dirname(dirURI));
  fs.mkdirSync(dirURI);
}

/**
 * Create a file and its precursor directories.
 * @param {*} filepath
 */
export function createFile(fileURI) {
  const dirURI = path.dirname(fileURI);
  createDirectory(dirURI);
  fs.writeFileSync(fileURI, "");
}

/**
 *
 */
/**
 * Get a version of given filename with '_backup' appended (before extension).
 * @param {String} filepath
 * @returns A backup filename, e.g. "data.txt" returns "data_backup.txt"
 */
export function getBackupFilename(fileURI) {
  const fileExtentionStart = fileURI.lastIndexOf(".");
  return (
    fileURI.substr(0, fileExtentionStart) +
    "_backup" +
    fileURI.substr(fileExtentionStart)
  );
}
