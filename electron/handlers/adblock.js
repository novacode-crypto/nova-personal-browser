const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const fetch = require('cross-fetch')
const path = require('path')
const fs = require('fs')
const { app } = require('electron')

let blocker = null
let isEnabled = true
let blockedCount = 0

const CACHE_PATH = path.join(app.getPath('userData'), 'adblocker-cache.bin')

async function initAdBlocker(session) {
  try {
    // Intentar cargar desde cache local primero
    if (fs.existsSync(CACHE_PATH)) {
      console.log('AdBlocker: cargando desde cache...')
      const buffer = fs.readFileSync(CACHE_PATH)
      blocker = ElectronBlocker.deserialize(new Uint8Array(buffer))
    } else {
      console.log('AdBlocker: descargando listas EasyList...')
      blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch)
      // Guardar cache
      const serialized = blocker.serialize()
      fs.writeFileSync(CACHE_PATH, Buffer.from(serialized))
    }

    if (isEnabled) {
      blocker.enableBlockingInSession(session)
    }

    // Contar requests bloqueados
    blocker.on('request-blocked', () => {
      blockedCount++
    })

    console.log('AdBlocker: ✅ inicializado correctamente')
    return true
  } catch (err) {
    console.error('AdBlocker error:', err)
    return false
  }
}

function enableAdBlocker(session) {
  if (!blocker) return
  isEnabled = true
  blocker.enableBlockingInSession(session)
  console.log('AdBlocker: activado')
}

function disableAdBlocker(session) {
  if (!blocker) return
  isEnabled = false
  blocker.disableBlockingInSession(session)
  console.log('AdBlocker: desactivado')
}

function getStats() {
  return {
    enabled: isEnabled,
    blocked: blockedCount,
    ready: blocker !== null,
  }
}

function resetStats() {
  blockedCount = 0
}

module.exports = {
  initAdBlocker,
  enableAdBlocker,
  disableAdBlocker,
  getStats,
  resetStats,
}