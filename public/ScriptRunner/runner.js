/**
 * Run the Python scripts
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://github.com/extrabacon/python-shell
 */

const { PythonShell } = require('python-shell');

/**
 * Get supported file list from directory
 * @param {string} dirpath
 * @returns {Promise<string>}
 */
const runFileSearch = async (dirpath) => {
  const msg = await PythonShell.run('./resources/backend/FileSearch.py', {
    args: [dirpath],
  });
  return msg;
};

/**
 * Get file size in bytes, given a path to the file
 * @param {string} dirpath
 * @returns {Promise<string>}
 */
const runGetFileSize = async (dirpath) => {
  const msg = await PythonShell.run('./resources/backend/GetFileSize.py', {
    args: [dirpath],
  });
  return msg;
};

/**
 * Update database from the directories listed in the `boundaries` table
 * @returns {Promise<string>}
 */
const runUpdateDatabase = async () => {
  const msg = await PythonShell.run('./resources/backend/UpdateDatabase.py', {
    // do not remove, for some Mac users to use
    // pythonPath: '/opt/homebrew/bin/python3.9',
  });
  return msg;
};

/**
 * Copy files to destination
 * @param {string[]} fileList
 * @param {string} dest
 * @returns {Promise<string>}
 */
const runCopyFileToDest = async (fileList, dest) => {
  const msg = await PythonShell.run('./resources/backend/CopyFiles.py', {
    args: [fileList, dest],
  });
  return msg;
};

/**
 * Move files to destination
 * @param {string[]} fileList
 * @param {string} dest
 * @returns {Promise<string>}
 */
const runMoveFileToDest = async (fileList, dest) => {
  const msg = await PythonShell.run('./resources/backend/MoveFiles.py', {
    args: [fileList, dest],
  });
  return msg;
};

/**
 * Write file list to text file
 * @param {string} text
 * @param {string} dest
 * @returns {Promise<string>}
 */
const runWriteFileListToTxt = async (text, dest) => {
  const msg = await PythonShell.run('./resources/backend/CreateTxtFile.py', {
    args: [text, dest],
  });
  return msg;
};

exports.runFileSearch = runFileSearch;
exports.runGetFileSize = runGetFileSize;
exports.runUpdateDatabase = runUpdateDatabase;
exports.runCopyFileToDest = runCopyFileToDest;
exports.runMoveFileToDest = runMoveFileToDest;
exports.runWriteFileListToTxt = runWriteFileListToTxt;
