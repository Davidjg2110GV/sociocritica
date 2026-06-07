interface HeaderProps {
  pendSync: number;
  theme: string;
  toggleTheme: () => void;
}

export const Header = ({ pendSync, theme, toggleTheme }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="header-title">KONSENSO</div>
        <div className="header-subtitle">PROYECTO NEXUS · PMV · OFFLINE-FIRST</div>
      </div>
      <div className="header-actions">
        {pendSync > 0 && (
          <div className="sync-badge">
            <span>⟳</span> {pendSync} sync
          </div>
        )}
        <div className="offline-badge">
          <div className="offline-dot" />
          <span className="offline-text">OFFLINE</span>
        </div>
        <button 
          onClick={toggleTheme} 
          className="theme-btn" 
          title={theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
};
