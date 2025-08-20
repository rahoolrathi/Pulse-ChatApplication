import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
let sessionToken: string | null = null;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  Menu.setApplicationMenu(null);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load your Vite dev server or the production build
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // 👉 Only install React DevTools in development
  if (!app.isPackaged) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name: any) => console.log(`✅ Added Extension: ${name}`))
      .catch((err: any) => console.log("❌ An error occurred: ", err));

    // Open DevTools by default in dev
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
};

ipcMain.handle("auth:set-token", (event, token: string) => {
  sessionToken = token;
  console.log("🔐 Token stored in session");
});

ipcMain.handle("auth:get-token", () => {
  return sessionToken;
});

ipcMain.handle("auth:clear-token", () => {
  sessionToken = null;
  console.log("🗑️ Token cleared from session");
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
