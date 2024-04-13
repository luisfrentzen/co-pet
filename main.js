// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("node:path");

function getPetWindowSize() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const petWindowHeight = Math.round(primaryDisplay.workAreaSize.height / 1.2)
  const petWindowWidth = petWindowHeight
  const petWindowSize = {
    width: petWindowWidth,
    height: petWindowHeight
  }

  return petWindowSize
}

function petStepHandler(event, dx, dy) {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  const petWindowSize = getPetWindowSize()
  const screenSize = screen.getPrimaryDisplay().workAreaSize;

  let newX = win.getPosition()[0] + dx
  let newY = win.getPosition()[1] + dy

  const minX = Math.floor(petWindowSize.width * 0.3) - petWindowSize.width
  const maxX = screenSize.width - Math.floor(petWindowSize.width * 0.3)

  const minY = Math.floor(petWindowSize.height * 0.3) - petWindowSize.height
  const maxY = screenSize.height - Math.floor(petWindowSize.height * 0.3)

  if (newX > maxX) {
    newX = minX
  } else if (newX < minX) {
    newX = maxX
  }

  if (newY > maxY) {
    newY = minY
  } else if (newY < minY) {
    newY = maxY
  }

  win.setBounds({
    width: petWindowSize.width,
    height: petWindowSize.height,
    x: newX,
    y: newY
  });
}

function createWindow() {
  const petWindowSize = getPetWindowSize()

  const mainWindow = new BrowserWindow({
    width: petWindowSize.width,
    height: petWindowSize.height,
    transparent: false,
    frame: false,
    useContentSize: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('pet-step', petStepHandler);
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
