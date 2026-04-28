const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('novaDownload', {
  onUpdate:   (cb) => ipcRenderer.on('download:update', (_, data) => cb(data)),
  onNew:      (cb) => ipcRenderer.on('download:new',    (_, data) => cb(data)),
  pause:      (id) => ipcRenderer.invoke('download:pause',  id),
  cancel:     (id) => ipcRenderer.invoke('download:cancel', id),
  openFile:   (p)  => ipcRenderer.invoke('download:open-file',   p),
  openFolder: (p)  => ipcRenderer.invoke('download:open-folder', p),
  getAll:     ()   => ipcRenderer.invoke('download:get-all'),
})