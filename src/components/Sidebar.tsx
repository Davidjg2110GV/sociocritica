import React from "react";

interface NavItem {
  id: string;
  icon: string;
  label: string;
}

interface SidebarProps {
  screen: string;
  goNav: (s: string) => void;
  navItems: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ screen, goNav, navItems }) => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(t => (
          <button 
            key={t.id} 
            onClick={() => goNav(t.id)}
            className={`sidebar-nav-btn ${screen === t.id ? 'active' : ''}`}
          >
            <span className="sidebar-nav-icon">{t.icon}</span>
            <span className="sidebar-nav-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
