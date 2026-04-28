const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('nova', {
  // Window controls
  window: {
    minimize:    () => ipcRenderer.send('window:minimize'),
    maximize:    () => ipcRenderer.send('window:maximize'),
    close:       () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.sendSync('window:is-maximized'),
  },

  store: {
    get:    (key)        => ipcRenderer.invoke('store:get', key),
    set:    (key, value) => ipcRenderer.invoke('store:set', key, value),
    delete: (key)        => ipcRenderer.invoke('store:delete', key),
    getAll: ()           => ipcRenderer.invoke('store:getAll'),
  },

  // Proxy
  proxy: {
    set:   (config) => ipcRenderer.invoke('proxy:set', config),
    clear: ()       => ipcRenderer.invoke('proxy:clear'),
  },

  // AdBlocker
  adblock: {
    enable:     () => ipcRenderer.invoke('adblock:enable'),
    disable:    () => ipcRenderer.invoke('adblock:disable'),
    stats:      () => ipcRenderer.invoke('adblock:stats'),
    resetStats: () => ipcRenderer.invoke('adblock:reset-stats'),
  },

  // Downloads
  download: {
    start:      (opts) => ipcRenderer.invoke('download:start', opts),
    pause:      (id)   => ipcRenderer.invoke('download:pause', id),
    cancel:     (id)   => ipcRenderer.invoke('download:cancel', id),
    getAll:     ()     => ipcRenderer.invoke('download:get-all'),
    openFile:   (p)    => ipcRenderer.invoke('download:open-file', p),
    openFolder: (p)    => ipcRenderer.invoke('download:open-folder', p),
    onNew:      (cb)   => ipcRenderer.on('download:new',    (_, d) => cb(d)),
    onUpdate:   (cb)   => ipcRenderer.on('download:update', (_, d) => cb(d)),
  },

  // App
  app: {
    version: () => ipcRenderer.invoke('app:version'),
    path:    () => ipcRenderer.invoke('app:path'),
  },

  on:                 (ch, cb) => ipcRenderer.on(ch, cb),
  removeAllListeners: (ch)     => ipcRenderer.removeAllListeners(ch),
})