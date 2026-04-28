import { useState, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Shield,
  Lock,
  Bookmark,
  Plus,
} from "lucide-react";
import { useNovaStore } from "../store/index.js";
import { webviewRefs } from "./WebViewContainer.jsx";

const ENGINES = {
  google: {
    url: "https://www.google.com/search?q=",
    icon: "https://www.google.com/favicon.ico",
  },
  duckduckgo: {
    url: "https://duckduckgo.com/?q=",
    icon: "https://duckduckgo.com/favicon.ico",
  },
  brave: {
    url: "https://search.brave.com/search?q=",
    icon: "https://brave.com/favicon.ico",
  },
  bing: {
    url: "https://www.bing.com/search?q=",
    icon: "https://www.bing.com/favicon.ico",
  },
  ecosia: {
    url: "https://www.ecosia.org/search?q=",
    icon: "https://www.ecosia.org/favicon.ico",
  },
};

function isUrl(str) {
  try {
    const url = new URL(str.includes("://") ? str : `https://${str}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export default function ToolBar() {
  const { tabs, activeTabId, updateTab, settings, addBookmark, addToast } =
    useNovaStore();
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const [urlInput, setUrlInput] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const engine = ENGINES[settings.searchEngine] || ENGINES.google;
  const displayUrl = focused ? urlInput : activeTab?.url || "";
  const isSecure = activeTab?.url?.startsWith("https");
  const isHome = activeTab?.url === "nova://home";

  const handleNavigate = (e) => {
    e.preventDefault();
    const raw = urlInput.trim();
    if (!raw) return;
    let url;
    if (raw.startsWith("nova://")) url = raw;
    else if (isUrl(raw)) url = raw.includes("://") ? raw : `https://${raw}`;
    else url = engine.url + encodeURIComponent(raw);
    updateTab(activeTabId, { url, loading: true });
    setUrlInput(url);
    inputRef.current?.blur();
  };

  const handleAddBookmark = () => {
    if (!activeTab || isHome) return;
    const { bookmarks } = useNovaStore.getState();
    const exists = bookmarks.find((b) => b.url === activeTab.url);
    if (exists) {
      addToast?.({ type: "info", message: "Ya está en favoritos" });
      return;
    }
    addBookmark({
      title: activeTab.title || activeTab.url,
      url: activeTab.url,
      favicon: activeTab.favicon,
    });
    addToast?.({ type: "success", message: "Agregado a favoritos" });
  };

  const btnStyle = {
    width: "28px",
    height: "28px",
    background: "transparent",
    border: "none",
    borderRadius: "6px",
    color: "var(--muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s, color 0.15s",
    flexShrink: 0,
  };

  return (
    <div
      className="flex items-center shrink-0"
      style={{
        height: "40px",
        padding: "0 8px",
        gap: "4px",
        background: "var(--surface-tinted)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Nav buttons */}
      {[
        { icon: <ArrowLeft size={14} />, action: goBack },
        { icon: <ArrowRight size={14} />, action: goForward },
        { icon: <RotateCw size={13} />, action: reload },
        { icon: <Home size={13} />, action: goHome },
      ].map((btn, i) => (
        <button
          key={i}
          onClick={btn.action}
          style={btnStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--card)";
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          {btn.icon}
        </button>
      ))}

      {/* URL Bar */}
      <form onSubmit={handleNavigate} style={{ flex: 1 }}>
        <div
          className="flex items-center"
          style={{
            height: "28px",
            padding: "0 10px",
            gap: "8px",
            background: "var(--card)",
            border: `1px solid ${focused ? "var(--accent)" : "var(--border)"}`,
            borderRadius: "8px",
            transition: "border-color 0.15s",
            boxShadow: focused ? "0 0 0 2px var(--accent-soft)" : "none",
          }}
        >
          {isHome ? (
            <Shield
              size={12}
              style={{ color: "var(--accent)", flexShrink: 0 }}
            />
          ) : isSecure ? (
            <Lock size={12} style={{ color: "#10b981", flexShrink: 0 }} />
          ) : (
            <Lock size={12} style={{ color: "#f59e0b", flexShrink: 0 }} />
          )}

          <input
            ref={inputRef}
            type="text"
            value={displayUrl}
            onChange={(e) => setUrlInput(e.target.value)}
            onFocus={() => {
              setUrlInput(activeTab?.url || "");
              setFocused(true);
            }}
            onBlur={() => setFocused(false)}
            placeholder="Buscar o escribir URL..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "12px",
              fontFamily: "JetBrains Mono, monospace",
              color: "var(--text)",
              minWidth: 0,
            }}
          />

          {/* Icono motor búsqueda */}
          <img
            src={engine.icon}
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "3px",
              flexShrink: 0,
              opacity: 0.7,
            }}
            alt=""
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      </form>

      {/* Bookmark actual */}
      {!isHome && (
        <button
          onClick={handleAddBookmark}
          title="Agregar a favoritos"
          style={btnStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--card)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          <Bookmark size={13} />
        </button>
      )}

      {/* Ad block indicator */}
      {settings.adblock && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 6px",
            height: "22px",
            borderRadius: "6px",
            background: "#10b98115",
            border: "1px solid #10b98130",
            gap: "4px",
          }}
        >
          <Shield size={11} style={{ color: "#10b981" }} />
          <span
            style={{
              fontSize: "10px",
              color: "#10b981",
              fontFamily: "monospace",
            }}
          >
            AD
          </span>
        </div>
      )}
    </div>
  );
}
