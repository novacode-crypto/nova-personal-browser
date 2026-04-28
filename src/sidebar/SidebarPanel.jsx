import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useNovaStore } from "../store/index.js";
import BookmarksPanel from "./panels/BookmarksPanel.jsx";
import HistoryPanel from "./panels/HistoryPanel.jsx";
import AIPanel from "./panels/AIPanel.jsx";
import HubPanel from "./panels/HubPanel.jsx";
import SettingsPanel from "./panels/SettingsPanel.jsx";
import LaLigaPanel from "./extensions/LaLigaPanel.jsx";

const PANEL_LABELS = {
  hub: "Hub",
  ai: "IA Assistant",
  bookmarks: "Favoritos",
  history: "Historial",
  settings: "Configuración",
  laliga: "LaLiga",
};

const panels = {
  hub: HubPanel,
  ai: AIPanel,
  bookmarks: BookmarksPanel,
  history: HistoryPanel,
  settings: SettingsPanel,
  laliga: LaLigaPanel,
};

export default function SidebarPanel() {
  const { activePanel, closePanel } = useNovaStore();
  const PanelComponent =
    panels[activePanel] ||
    (() => (
      <div className="text-center py-8">
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Panel no encontrado
        </p>
      </div>
    ));

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 300, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="h-full flex flex-col overflow-hidden shrink-0"
      style={{
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        minWidth: "300px",
        maxWidth: "300px",
      }}
    >
      {/* Header */}
      <div
        className="h-10 flex items-center justify-between px-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--text)" }}
        >
          {PANEL_LABELS[activePanel] || activePanel}
        </span>
        <button
          onClick={closePanel}
          className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
          style={{ color: "var(--muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--card)";
            e.currentTarget.style.color = "var(--text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--muted)";
          }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-3">
        <PanelComponent />
      </div>
    </motion.div>
  );
}
