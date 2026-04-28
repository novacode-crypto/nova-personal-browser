import { useState } from "react";
import {
  Search,
  Palette,
  Bot,
  Download,
  Shield,
  ChevronDown,
  Check,
  Cloud,
} from "lucide-react";
import { useNovaStore, ACCENTS } from "../../store/index.js";

const SEARCH_ENGINES = [
  { id: "google", label: "Google" },
  { id: "duckduckgo", label: "DuckDuckGo" },
  { id: "brave", label: "Brave Search ⚠️ VPN" },
  { id: "bing", label: "Bing" },
  { id: "ecosia", label: "Ecosia" },
];

const GROQ_MODELS = [
  { id: "llama3-8b-8192", label: "Llama 3 8B (rápido)" },
  { id: "llama3-70b-8192", label: "Llama 3 70B (potente)" },
  { id: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
  { id: "gemma2-9b-it", label: "Gemma 2 9B" },
];

// Estilos base usando CSS variables
const S = {
  card: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "8px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    background: "var(--card)",
    border: "none",
    width: "100%",
    cursor: "pointer",
    textAlign: "left",
  },
  sectionBody: {
    padding: "12px",
    background: "var(--bg)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "11px",
    color: "var(--muted)",
    marginBottom: "4px",
    display: "block",
  },
  input: {
    width: "100%",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: "12px",
    color: "var(--text)",
    outline: "none",
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "6px 10px",
    fontSize: "12px",
    color: "var(--text)",
    outline: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

function Section({ icon: Icon, label, color, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={S.card}>
      <button
        style={S.sectionHeader}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        <Icon size={13} style={{ color, flexShrink: 0 }} />
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--text)",
            flex: 1,
          }}
        >
          {label}
        </span>
        <ChevronDown
          size={12}
          style={{
            color: "var(--muted)",
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && <div style={S.sectionBody}>{children}</div>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <span style={S.label}>{label}</span>
      {children}
    </div>
  );
}

function NovaInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={S.input}
      onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    />
  );
}

function NovaSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={S.select}
    >
      {options.map((o) => (
        <option
          key={o.id}
          value={o.id}
          style={{ background: "var(--card)", color: "var(--text)" }}
        >
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({ value, onChange, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ fontSize: "12px", color: "var(--text)" }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: "40px",
          height: "22px",
          borderRadius: "11px",
          background: value ? "var(--accent)" : "var(--border)",
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "white",
            transition: "transform 0.2s",
            transform: value ? "translateX(21px)" : "translateX(3px)",
          }}
        />
      </button>
    </div>
  );
}

function PartsSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      {[1, 2, 4, 8].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            flex: 1,
            padding: "6px",
            borderRadius: "6px",
            fontSize: "12px",
            border: `1px solid ${
              value === n ? "var(--accent)" : "var(--border)"
            }`,
            background: value === n ? "var(--accent-soft)" : "var(--card)",
            color: value === n ? "var(--accent)" : "var(--muted)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
        >
          {n}x
        </button>
      ))}
    </div>
  );
}

export default function SettingsPanel() {
  const {
    settings,
    setSettings,
    theme,
    setTheme,
    accentColor,
    setAccent,
    addToast,
  } = useNovaStore();

  const update = (key, val) => setSettings({ [key]: val });

  return (
    <div style={{ padding: "4px" }}>
      {/* 🔍 Búsqueda */}
      <Section icon={Search} label="Búsqueda" color="var(--accent)">
        <Field label="Motor por defecto">
          <NovaSelect
            value={settings.searchEngine}
            onChange={(v) => update("searchEngine", v)}
            options={SEARCH_ENGINES}
          />
        </Field>
      </Section>

      {/* 🎨 Apariencia */}
      <Section icon={Palette} label="Apariencia" color="#ec4899">
        <Field label="Tema">
          <div style={{ display: "flex", gap: "6px" }}>
            {["dark", "light"].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  border: `1px solid ${
                    theme === t ? "var(--accent)" : "var(--border)"
                  }`,
                  background:
                    theme === t ? "var(--accent-soft)" : "var(--card)",
                  color: theme === t ? "var(--accent)" : "var(--muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                {theme === t && <Check size={11} />}
                {t === "dark" ? "🌙 Oscuro" : "☀️ Claro"}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Color de acento">
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAccent(a.id)}
                title={a.label}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  backgroundColor: a.color,
                  border: "none",
                  cursor: "pointer",
                  outline:
                    accentColor === a.id ? `2px solid ${a.color}` : "none",
                  outlineOffset: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {accentColor === a.id && <Check size={13} color="white" />}
              </button>
            ))}
          </div>
        </Field>
        <Toggle
          value={useNovaStore.getState().showBookmarksBar}
          onChange={(v) => useNovaStore.getState().toggleBookmarksBar()}
          label="Mostrar barra de favoritos (Ctrl+B)"
        />
      </Section>

      {/* 🤖 IA */}
      <Section icon={Bot} label="IA — Groq" color="#7c6aff">
        <Field label="API Key">
          <NovaInput
            type="password"
            value={settings.groqApiKey}
            onChange={(v) => update("groqApiKey", v)}
            placeholder="gsk_••••••••••••••••"
          />
          <p
            style={{
              fontSize: "10px",
              color: "var(--muted)",
              marginTop: "4px",
            }}
          >
            Gratis en{" "}
            <span style={{ color: "var(--accent)" }}>console.groq.com</span>
          </p>
        </Field>
        <Field label="Modelo">
          <NovaSelect
            value={settings.groqModel}
            onChange={(v) => update("groqModel", v)}
            options={GROQ_MODELS}
          />
        </Field>
      </Section>

      {/* 🌤️ Clima */}
      <Section icon={Cloud} label="Clima" color="#3b82f6">
        <Field label="API Key de OpenWeatherMap">
          <NovaInput
            type="password"
            value={settings.weatherApiKey || ""}
            onChange={(v) => update("weatherApiKey", v)}
            placeholder="tu-api-key-aquí"
          />
          <p
            style={{
              fontSize: "10px",
              color: "var(--muted)",
              marginTop: "4px",
            }}
          >
            Gratis en{" "}
            <span style={{ color: "var(--accent)" }}>openweathermap.org</span>
          </p>
        </Field>
      </Section>

      {/* 📥 Descargas */}
      <Section icon={Download} label="Descargas" color="#06b6d4">
        <Field label="Carpeta de descargas">
          <NovaInput
            value={settings.downloadPath}
            onChange={(v) => update("downloadPath", v)}
            placeholder="C:\Users\...\Downloads"
          />
        </Field>
        <Field label="Partes simultáneas">
          <PartsSelector
            value={settings.downloadParts}
            onChange={(v) => update("downloadParts", v)}
          />
        </Field>
      </Section>

      {/* 🛡️ Privacidad */}
      <Section icon={Shield} label="Privacidad" color="#10b981">
        <Toggle
          value={settings.adblock}
          onChange={(v) => update("adblock", v)}
          label="Bloqueador de anuncios"
        />
      </Section>

      {/* Guardar */}
      <button
        onClick={() =>
          addToast({ type: "success", message: "Configuración guardada" })
        }
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          background: "var(--accent)",
          color: "white",
          border: "none",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
          marginTop: "4px",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Guardar configuración
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "var(--muted)",
          marginTop: "12px",
        }}
      >
        NOVA Browser v1.0.0
      </p>
    </div>
  );
}
