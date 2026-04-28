<div align="center">

# ⚡ NOVA Personal Browser Suite

**Un navegador personal, ligero, privado y modular construido con Electron + React**

![NOVA Browser](https://img.shields.io/badge/NOVA-Browser-7c6aff?style=for-the-badge&logo=electron)
![Electron](https://img.shields.io/badge/Electron-28-47848F?style=for-the-badge&logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-Personal-red?style=for-the-badge)

*Inspirado en Arc, Brave y Opera — construido para uso personal y control total*

</div>

---

## 🧠 ¿Qué es NOVA?

NOVA es un navegador de escritorio para Windows construido sobre Electron y React. No es una extensión de Chrome — es un navegador completo e independiente diseñado para ser:

- **🔐 Privado** — Ad blocker integrado, proxy con split tunneling
- **⚡ Modular** — Sidebar con paneles: Hub de red, IA, Descargas, Favoritos
- **🤖 Inteligente** — IA integrada (Groq API) flotante en cualquier página
- **🎨 Personal** — Temas dark/light + 7 colores de acento
- **🌐 Completo** — Gestor de descargas multi-segmento estilo IDM

---

## ✨ Características

### 🌐 Navegador
- Múltiples tabs con animaciones fluidas
- URL bar inteligente (detecta URL vs búsqueda)
- 5 motores de búsqueda: Google, DuckDuckGo, Brave, Bing, Ecosia
- Historial de navegación
- Back/Forward/Reload nativos
- Barra de favoritos (Ctrl+B) con click derecho contextual

### 🔐 Privacidad
- **Ad Blocker** powered by @cliqz/adblocker (mismo engine que Ghostery)
- Listas EasyList + EasyPrivacy con cache local
- Proxy global con soporte Oxylabs + Cloudflare Workers
- Split tunneling por dominio

### 🤖 NOVA AI
- Botón flotante ✨ en cualquier página web
- Panel en sidebar para chat extendido
- Powered by **Groq API** (gratuito, ultra-rápido)
- Modelos: Llama 3 8B/70B, Mixtral 8x7B, Gemma 2
- Requiere proxy activo para funcionar

### 📥 Download Manager *(en desarrollo)*
- Interceptación automática de descargas
- Descarga multi-segmento (hasta 8 partes simultáneas)
- Ventana flotante estilo IDM con progreso en tiempo real
- Soporte para YouTube, Facebook, TikTok, Instagram via yt-dlp
- Categorías: Video, Audio, Documentos, Imágenes, Programas, Comprimidos

### 🎨 Personalización
- Dark Mode / Light Mode con transición suave
- 7 colores de acento: Violeta, Azul, Verde, Naranja, Rosa, Rojo, Plateado
- Tinte sutil del color de acento en toda la UI
- Selector de motor de búsqueda en Home Page

### 🏠 Home Page
- Reloj en tiempo real (HH:MM:SS)
- Widget de clima (OpenWeatherMap API)
- Buscador central con icono del motor activo
- Accesos rápidos a favoritos

### 🔌 Hub de Red *(en desarrollo)*
- **ISP Manager** — Portal Nauta/ETECSA (KonohaWISP)
- **Proxy Manager** — Oxylabs + Cloudflare Workers
- **Ubiquiti Panel** — NanoStation M5 via AirOS API

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Runtime | Electron 28 |
| UI Framework | React 18 + Vite 5 |
| Estilos | Tailwind CSS 3 + CSS Variables |
| Estado | Zustand |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Ad Blocker | @cliqz/adblocker-electron |
| Persistencia | electron-store@8 |
| IA | Groq API (Llama 3, Mixtral) |
| Clima | OpenWeatherMap API |
| Videos | yt-dlp (bundleado) |
| Build | electron-builder |

---

## 🚀 Instalación para Desarrollo

### Prerrequisitos
- Node.js v18+
- npm + pnpm (`npm install -g pnpm`)
- Windows 10/11

### Setup

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/nova-browser.git
cd nova-browser

# Instalar dependencias
pnpm install

# Instalar Electron (SIEMPRE con npm, no pnpm)
npm install electron@28 --save-dev

# Iniciar en modo desarrollo
# Opción 1: doble click en dev.bat
# Opción 2: dos terminales separadas
pnpm run dev:vite        # Terminal 1
pnpm exec electron .     # Terminal 2 (después de que Vite esté listo)
```

### ⚠️ Notas importantes

> **Electron** debe instalarse siempre con `npm install electron@28 --save-dev`
> pnpm pierde el binario al reinstalar otras dependencias.

> **electron-store** usa la versión 8 (CommonJS).
> La v9+ es ESM puro e incompatible con el proceso main de Electron.

> **Vite** usa la versión 5.
> La v8+ es incompatible con el setup actual.

---

## 📁 Estructura del Proyecto
nova-browser/
├── electron/                    # Proceso principal Electron
│   ├── main.js                  # Entry point + IPC handlers
│   ├── preload.js               # Bridge seguro renderer ↔ main
│   ├── preload-download.js      # Bridge para ventana de descargas
│   └── handlers/
│       ├── adblock.js           # Engine de bloqueo de anuncios
│       ├── download.js          # Gestor de descargas multi-parte
│       └── store.js             # Persistencia con electron-store
├── src/                         # Proceso renderer (React)
│   ├── browser/                 # Componentes del navegador
│   │   ├── TitleBar.jsx         # Barra de título custom + controles
│   │   ├── TabBar.jsx           # Pestañas animadas
│   │   ├── ToolBar.jsx          # URL bar + controles de navegación
│   │   ├── BookmarksBar.jsx     # Barra de favoritos (Ctrl+B)
│   │   └── WebViewContainer.jsx # Motor de renderizado web
│   ├── home/                    # Página de inicio
│   │   ├── HomePage.jsx
│   │   ├── SearchBar.jsx
│   │   └── widgets/             # Clock, Weather
│   ├── sidebar/                 # Panel lateral
│   │   ├── SidebarIcons.jsx     # Iconos de navegación
│   │   ├── SidebarPanel.jsx     # Panel deslizante
│   │   └── panels/              # AI, Bookmarks, History, Settings
│   ├── downloads/               # Gestor de descargas (WIP)
│   ├── settings/                # Página nova://settings (WIP)
│   ├── hub/                     # ISP + Proxy + Ubiquiti (WIP)
│   ├── store/index.js           # Estado global Zustand
│   └── styles/globals.css       # CSS Variables + Tailwind
├── dev.bat                      # Script de desarrollo Windows
├── index.html                   # Entry HTML
├── package.json
├── vite.config.js
└── tailwind.config.js

---

## ⚙️ Configuración

### APIs necesarias

| Servicio | Para qué | Costo | URL |
|----------|----------|-------|-----|
| Groq API | IA integrada | Gratis | [console.groq.com](https://console.groq.com) |
| OpenWeatherMap | Widget de clima | Gratis | [openweathermap.org](https://openweathermap.org) |

Configura las API keys en el panel de **Settings** (icono ⚙️ en el sidebar).

### Proxy (requerido para IA)
La IA integrada requiere acceso a internet sin restricciones.
Configura una cuenta de proxy en el panel Hub → Proxy Manager.

---

## 🗺️ Roadmap

- [x] Navegador base con tabs
- [x] Sistema de temas dark/light + 7 accents
- [x] Barra de favoritos
- [x] Ad Blocker (EasyList)
- [x] IA flotante (Groq)
- [x] Persistencia de datos
- [ ] Settings página completa (nova://settings)
- [ ] Download Manager con ventana IDM
- [ ] yt-dlp para videos YouTube/redes sociales
- [ ] Hub: ISP Manager (Nauta/ETECSA)
- [ ] Hub: Proxy Manager (Oxylabs + Cloudflare)
- [ ] Hub: Ubiquiti Panel (NanoStation M5)
- [ ] Traductor integrado (LibreTranslate)
- [ ] Extensiones Chrome (.crx)
- [ ] Build instalador .exe

---

## 📝 Notas

Este es un proyecto personal desarrollado para uso privado.
No está destinado a distribución pública ni a la Chrome Web Store.

Desarrollado con asistencia de Claude (Anthropic) como herramienta de programación.

---

<div align="center">

**NOVA Browser** — Construido con ❤️ y Electron

</div>
