const { app, BrowserWindow, ipcMain, session, shell, Menu } = require('electron')
const path = require('path')
const novaStore = require('./handlers/store')

// Eliminar menú inmediatamente
Menu.setApplicationMenu(null)

const isDev = !app.isPackaged
let mainWindow

// Importar handlers
const adblock  = require('./handlers/adblock')
const dlHandler = require('./handlers/download')

function createWindow() {
  Menu.setApplicationMenu(null)

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: '#09090f',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true,
      sandbox: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
    show: false,
  })

  mainWindow.setMenu(null)
  mainWindow.setMenuBarVisibility(false)

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173').catch(console.error)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.setMenu(null)
    mainWindow.show()
  })

  mainWindow.webContents.on('did-fail-load', (e, code, desc, url) => {
    console.error('did-fail-load:', code, desc, url)
  })

  mainWindow.webContents.setWindowOpenHandler(({ url, frameName, features }) => {
    // Permitir popups dentro del webview
    if (frameName === '_blank' || features.includes('popup')) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 900,
          height: 700,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
          }
        }
      }
    }
    shell.openExternal(url)
    return { action: 'deny' }
  })

  // Setup download interceptor
  dlHandler.setupDownloadInterceptor(session.defaultSession, mainWindow)

  // Configurar partition para webviews
const { session } = require('electron')
session.fromPartition('persist:nova').setUserAgent(
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
)
session.fromPartition('persist:nova').webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ["default-src * 'unsafe-inline' 'unsafe-eval' data: blob:"],
    }
  })
})
}

// ── IPC: Persistent Store ─────────────────────
ipcMain.handle('store:get',    (_, key)        => novaStore.get(key))
ipcMain.handle('store:set',    (_, key, value) => { novaStore.set(key, value); return true })
ipcMain.handle('store:delete', (_, key)        => { novaStore.delete(key); return true })
ipcMain.handle('store:getAll', ()              => novaStore.store)

// ── IPC: Window ──────────────────────────────
ipcMain.on('window:minimize',    () => mainWindow?.minimize())
ipcMain.on('window:maximize',    () => {
  mainWindow?.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
})
ipcMain.on('window:close',       () => mainWindow?.close())
ipcMain.on('window:is-maximized',(e) => {
  e.returnValue = mainWindow?.isMaximized() ?? false
})

// ── IPC: Proxy ────────────────────────────────
ipcMain.handle('proxy:set', async (_, config) => {
  try {
    await session.defaultSession.setProxy(config)
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})
ipcMain.handle('proxy:clear', async () => {
  try {
    await session.defaultSession.setProxy({ mode: 'direct' })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// ── IPC: AdBlocker ────────────────────────────
ipcMain.handle('adblock:enable', () => {
  adblock.enableAdBlocker(session.defaultSession)
  return { success: true }
})
ipcMain.handle('adblock:disable', () => {
  adblock.disableAdBlocker(session.defaultSession)
  return { success: true }
})
ipcMain.handle('adblock:stats', () => adblock.getStats())
ipcMain.handle('adblock:reset-stats', () => {
  adblock.resetStats()
  return { success: true }
})

// ── IPC: Downloads ────────────────────────────
ipcMain.handle('download:start', async (_, opts) => {
  return dlHandler.startDownload({ ...opts, mainWindow })
})
ipcMain.handle('download:pause',  (_, id) => dlHandler.pauseDownload(id))
ipcMain.handle('download:cancel', (_, id) => dlHandler.cancelDownload(id))
ipcMain.handle('download:get-all', ()    => dlHandler.getAllDownloads())
ipcMain.handle('download:open-file',   (_, p) => dlHandler.openFile(p))
ipcMain.handle('download:open-folder', (_, p) => dlHandler.openFolder(p))

// ── IPC: App ──────────────────────────────────
ipcMain.handle('app:version', () => app.getVersion())
ipcMain.handle('app:path',    () => app.getPath('userData'))

// ── Lifecycle ─────────────────────────────────
app.whenReady().then(async () => {
  Menu.setApplicationMenu(null)
  createWindow()

  // Inicializar ad blocker
  await adblock.initAdBlocker(session.defaultSession)
  console.log('✅ AdBlocker inicializado')

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('browser-window-created', (_, window) => {
  window.setMenu(null)
  window.setMenuBarVisibility(false)
})