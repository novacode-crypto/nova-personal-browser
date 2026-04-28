const { BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')
const http = require('http')

let downloadWindow = null
let downloads = new Map()
let downloadIdCounter = 0

// Categorías por extensión
const CATEGORIES = {
  compressed: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
  programs:   ['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'appimage'],
  video:      ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'm4v'],
  audio:      ['mp3', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma'],
  images:     ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'],
  documents:  ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'],
}

function getCategory(filename) {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  for (const [cat, exts] of Object.entries(CATEGORIES)) {
    if (exts.includes(ext)) return cat
  }
  return 'documents'
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function formatSpeed(bytesPerSec) {
  if (bytesPerSec < 1024) return `${bytesPerSec.toFixed(0)} B/s`
  if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`
  return `${(bytesPerSec / (1024 * 1024)).toFixed(2)} MB/s`
}

// Crear ventana de descarga estilo IDM
function createDownloadWindow(downloadId) {
  if (downloadWindow && !downloadWindow.isDestroyed()) {
    downloadWindow.focus()
    return downloadWindow
  }

  downloadWindow = new BrowserWindow({
    width: 520,
    height: 400,
    minWidth: 480,
    minHeight: 350,
    frame: false,
    resizable: true,
    alwaysOnTop: false,
    backgroundColor: '#09090f',
    webPreferences: {
      preload: path.join(__dirname, '../preload-download.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  })

  const isDev = !require('electron').app.isPackaged
  if (isDev) {
    downloadWindow.loadURL(`http://localhost:5173/#/download-window`)
  } else {
    downloadWindow.loadFile(path.join(__dirname, '../../dist/index.html'), {
      hash: '/download-window'
    })
  }

  downloadWindow.once('ready-to-show', () => {
    downloadWindow.show()
  })

  downloadWindow.on('closed', () => {
    downloadWindow = null
  })

  return downloadWindow
}

// Interceptar descargas nativas del webview
function setupDownloadInterceptor(session, mainWindow) {
  session.on('will-download', (event, item, webContents) => {
    event.preventDefault()

    const url      = item.getURL()
    const filename = item.getFilename()
    const filesize = item.getTotalBytes()

    startDownload({
      url,
      filename,
      filesize,
      savePath: null, // se pedirá al usuario
      mainWindow,
    })
  })
}

// Iniciar descarga
async function startDownload({ url, filename, filesize, savePath, parts = 4, mainWindow }) {
  const id = `dl-${++downloadIdCounter}-${Date.now()}`
  const category = getCategory(filename)

  const download = {
    id,
    url,
    filename,
    filesize: filesize || 0,
    downloaded: 0,
    speed: 0,
    eta: 0,
    status: 'pending',
    resumable: false,
    category,
    savePath: savePath || '',
    parts: [],
    startTime: Date.now(),
    endTime: null,
    error: null,
  }

  downloads.set(id, download)

  // Notificar al renderer
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('download:new', download)
  }

  // Abrir ventana de descarga
  const dlWindow = createDownloadWindow(id)

  // Verificar si el servidor soporta Range requests
  try {
    const supportsRange = await checkRangeSupport(url)
    download.resumable = supportsRange
    download.status = 'downloading'
    updateDownload(id, download, mainWindow, dlWindow)

    if (supportsRange && parts > 1 && (filesize || 0) > 1024 * 1024) {
      // Descarga multi-partes
      await downloadMultiPart(id, url, filename, filesize, parts, savePath, mainWindow, dlWindow)
    } else {
      // Descarga simple
      await downloadSingle(id, url, filename, savePath, mainWindow, dlWindow)
    }
  } catch (err) {
    download.status = 'error'
    download.error = err.message
    updateDownload(id, download, mainWindow, dlWindow)
  }

  return id
}

async function checkRangeSupport(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http
    const req = protocol.request(url, { method: 'HEAD' }, (res) => {
      const acceptRanges = res.headers['accept-ranges']
      resolve(acceptRanges === 'bytes')
    })
    req.on('error', () => resolve(false))
    req.setTimeout(5000, () => { req.destroy(); resolve(false) })
    req.end()
  })
}

async function downloadSingle(id, url, filename, savePath, mainWindow, dlWindow) {
  return new Promise((resolve, reject) => {
    const dl = downloads.get(id)
    if (!dl) return reject(new Error('Download not found'))

    const protocol = url.startsWith('https') ? https : http
    const startTime = Date.now()
    let downloaded = 0
    let lastTime = Date.now()
    let lastBytes = 0

    const req = protocol.get(url, (res) => {
      const total = parseInt(res.headers['content-length'] || '0', 10)
      if (total > 0) {
        dl.filesize = total
      }

      // Crear el write stream
      const tmpPath = (savePath || require('os').tmpdir()) + path.sep + filename
      const writeStream = fs.createWriteStream(tmpPath)
      dl.savePath = tmpPath

      res.on('data', (chunk) => {
        downloaded += chunk.length
        dl.downloaded = downloaded

        // Calcular velocidad cada 500ms
        const now = Date.now()
        if (now - lastTime > 500) {
          const elapsed = (now - lastTime) / 1000
          dl.speed = (downloaded - lastBytes) / elapsed
          dl.eta = dl.speed > 0 ? (total - downloaded) / dl.speed : 0
          lastTime = now
          lastBytes = downloaded
        }

        updateDownload(id, dl, mainWindow, dlWindow)
        writeStream.write(chunk)
      })

      res.on('end', () => {
        writeStream.end()
        dl.status = 'completed'
        dl.downloaded = total || downloaded
        dl.endTime = Date.now()
        dl.speed = 0
        dl.eta = 0
        updateDownload(id, dl, mainWindow, dlWindow)
        resolve()
      })

      res.on('error', reject)
    })

    req.on('error', reject)
    dl.cancelFn = () => { req.destroy(); reject(new Error('Cancelled')) }
  })
}

async function downloadMultiPart(id, url, filename, filesize, numParts, savePath, mainWindow, dlWindow) {
  const dl = downloads.get(id)
  if (!dl) return

  const partSize = Math.floor(filesize / numParts)
  const tmpDir = require('os').tmpdir()
  const partFiles = []

  // Inicializar partes
  dl.parts = Array.from({ length: numParts }, (_, i) => ({
    number: i + 1,
    status: 'pending',
    start: i * partSize,
    end: i === numParts - 1 ? filesize - 1 : (i + 1) * partSize - 1,
    downloaded: 0,
    total: i === numParts - 1 ? filesize - i * partSize : partSize,
  }))

  updateDownload(id, dl, mainWindow, dlWindow)

  // Descargar todas las partes en paralelo
  const partPromises = dl.parts.map((part, i) => {
    const partPath = path.join(tmpDir, `${id}-part-${i}`)
    partFiles.push(partPath)
    return downloadPart(id, url, part, partPath, mainWindow, dlWindow)
  })

  await Promise.all(partPromises)

  // Unir partes
  dl.status = 'merging'
  updateDownload(id, dl, mainWindow, dlWindow)

  const finalPath = path.join(savePath || tmpDir, filename)
  const writeStream = fs.createWriteStream(finalPath)

  for (const partPath of partFiles) {
    await new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(partPath)
      readStream.pipe(writeStream, { end: false })
      readStream.on('end', () => {
        fs.unlinkSync(partPath) // limpiar parte temporal
        resolve()
      })
      readStream.on('error', reject)
    })
  }

  writeStream.end()
  dl.savePath = finalPath
  dl.status = 'completed'
  dl.endTime = Date.now()
  updateDownload(id, dl, mainWindow, dlWindow)
}

function downloadPart(id, url, part, partPath, mainWindow, dlWindow) {
  return new Promise((resolve, reject) => {
    const dl = downloads.get(id)
    if (!dl) return reject(new Error('Download not found'))

    const protocol = url.startsWith('https') ? https : http
    const writeStream = fs.createWriteStream(partPath)

    part.status = 'downloading'
    updateDownload(id, dl, mainWindow, dlWindow)

    const req = protocol.get(url, {
      headers: { Range: `bytes=${part.start}-${part.end}` }
    }, (res) => {
      res.on('data', (chunk) => {
        part.downloaded += chunk.length
        dl.downloaded = dl.parts.reduce((sum, p) => sum + p.downloaded, 0)
        dl.speed = dl.downloaded / ((Date.now() - dl.startTime) / 1000)
        dl.eta = dl.speed > 0 ? (dl.filesize - dl.downloaded) / dl.speed : 0
        writeStream.write(chunk)
        updateDownload(id, dl, mainWindow, dlWindow)
      })

      res.on('end', () => {
        writeStream.end()
        part.status = 'completed'
        updateDownload(id, dl, mainWindow, dlWindow)
        resolve()
      })

      res.on('error', (err) => {
        part.status = 'error'
        reject(err)
      })
    })

    req.on('error', reject)
  })
}

function updateDownload(id, data, mainWindow, dlWindow) {
  downloads.set(id, data)

  const payload = { ...data }

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('download:update', payload)
  }
  if (dlWindow && !dlWindow.isDestroyed()) {
    dlWindow.webContents.send('download:update', payload)
    dlWindow.setTitle(`${data.filename} — ${Math.round((data.downloaded / (data.filesize || 1)) * 100)}%`)
  }
}

function pauseDownload(id) {
  const dl = downloads.get(id)
  if (!dl) return
  dl.status = 'paused'
  dl.cancelFn?.()
}

function cancelDownload(id) {
  const dl = downloads.get(id)
  if (!dl) return
  dl.status = 'cancelled'
  dl.cancelFn?.()
}

function getAllDownloads() {
  return Array.from(downloads.values())
}

function openFile(savePath) {
  shell.openPath(savePath)
}

function openFolder(savePath) {
  shell.showItemInFolder(savePath)
}

module.exports = {
  setupDownloadInterceptor,
  startDownload,
  pauseDownload,
  cancelDownload,
  getAllDownloads,
  getCategory,
  openFile,
  openFolder,
  formatBytes,
  formatSpeed,
}