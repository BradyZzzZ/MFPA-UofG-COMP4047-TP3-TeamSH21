/**
 * Expose the protected methods to the renderer process and listen for
 * async-reply messages from the main process
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://dev.to/arindam1997007/a-step-by-step-guide-to-integrating-better-sqlite3-with-electron-js-app-using-create-react-app-3k16
 * https://jaketrent.com/post/select-directory-in-electron/
 */

const { contextBridge, ipcRenderer } = require('electron');
const dbArea = require('./Database/dbAreaManager');
const {
  insertDirectory,
  getDirectory,
  deleteDirectory,
} = require('./Database/dbDirManager');
const { getBoundaries } = require('./Database/dbBoundManager');

const {
  runFileSearch,
  runGetFileSize,
  runUpdateDatabase,
  runCopyFileToDest,
  runMoveFileToDest,
  runWriteFileListToTxt,
} = require('./ScriptRunner/runner');

contextBridge.exposeInMainWorld('sqlite', {
  dbArea,
  insertDirectory,
  getDirectory,
  deleteDirectory,
  getBoundaries,
});

contextBridge.exposeInMainWorld('pyshell', {
  runFileSearch,
  runGetFileSize,
  runUpdateDatabase,
  runCopyFileToDest,
  runMoveFileToDest,
  runWriteFileListToTxt,
});

/**
 * Listen for select-dir and select-file events from renderer process
 */
process.once('loaded', () => {
  window.addEventListener('message', (event) => {
    if (event.data.type === 'select-dir') {
      ipcRenderer.send('select-dir');
    } else if (event.data.type === 'select-file') {
      ipcRenderer.send('select-file');
    }
  });
});

/**
 * Listen for selected-dir and selected-file events from main process
 */
ipcRenderer.on('selected-dir', (event, arg) => {
  window.postMessage({ type: 'selected-dir', data: arg });
});

/**
 * Listen for selected-file event from main process
 */
ipcRenderer.on('selected-file', (event, arg) => {
  window.postMessage({ type: 'selected-file', data: arg });
});
