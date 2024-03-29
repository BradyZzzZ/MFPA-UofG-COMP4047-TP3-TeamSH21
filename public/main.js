/**
 * Creates the main window and handles the main process of the Electron app.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://github.com/arindam1997007/electron-betterSQLite/blob/master/public/electron.js
 * https://jaketrent.com/post/select-directory-in-electron/
 * https://www.electronjs.org/docs/latest/api/dialog
 * https://stackoverflow.com/a/67409223/17302377
 */

const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const contextMenu = require('electron-context-menu');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    title: 'Map File Preparation Application',
    icon: path.join(__dirname, 'icon', 'icon.png'),
    show: false,
    width: 1200,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });
  win.maximize();
  win.show();

  contextMenu({
    showSaveImageAs: true,
  });

  const appURL = app.isPackaged
    ? 'https://sh21-deployment.vercel.app/'
    : 'http://localhost:3000';
  win.loadURL(appURL);

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }

  /**
   * Open external links in default browser instead of Electron window
   */
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  /**
   * Show select directory dialog when requested by 'select-dir' event from
   * renderer and send selected directory path to renderer
   */
  ipcMain.on('select-dir', async (event, arg) => {
    await dialog
      .showOpenDialog(win, {
        properties: ['openDirectory'],
      })
      .then((result) => {
        event.reply('selected-dir', result.filePaths);
      })
      .catch((error) => {
        console.error('Error selecting directory:', error);
      });
  });

  /**
   * Show select file dialog when requested by 'select-file' event from
   * renderer and send selected file path to renderer
   */
  ipcMain.on('select-file', async (event, arg) => {
    await dialog
      .showSaveDialog(win, {
        properties: ['openFile'],
        filters: [{ name: 'Text documents', extensions: ['txt'] }],
        defaultPath:
          'MapLayerToolkit_' +
          new Date().toISOString().split('T')[0] +
          '_' +
          new Date()
            .toISOString()
            .split('T')[1]
            .split('.')[0]
            .replace(/:/g, ''),
      })
      .then((result) => {
        event.reply('selected-file', result.filePath);
      })
      .catch((error) => {
        console.error('Error selecting file:', error);
      });
  });
};

/**
 * Create main window when app is ready
 */
app.on('ready', () => {
  try {
    createWindow();
  } catch (error) {
    console.error('Error creating window:', error);
  }
});

/**
 * Quit when all windows are closed, except on macOS. There, it's common for
 * applications and their menu bar to stay active until the user quits
 * explicitly with Cmd + Q.
 */
app.on('window-all-closed', () => {
  try {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  } catch (error) {
    console.error('Error closing window:', error);
  }
});
