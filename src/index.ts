import { app, BrowserWindow, shell } from 'electron';
import * as cache from './cache';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const url = 'https://mail.proton.me';
let firstPageURL = url;
const pageCacheFileName = 'page-cache.txt';

try {
  firstPageURL = cache.load(pageCacheFileName).toString();
} catch (error) {
  if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
    throw error;
  }
  // ignore ENOENT.
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url: urlString }) => {
    const url = new URL(urlString);
    if (url.host !== 'mail.proton.me') {
      shell.openExternal(urlString);
    }
    return { action: 'deny' };
  });

  mainWindow.webContents.on('did-navigate-in-page', (_, url) => {
    firstPageURL = url;
  });

  mainWindow.loadURL(firstPageURL);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  try {
    cache.store(pageCacheFileName, firstPageURL);
  } catch (error) {
    console.log(error);
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
