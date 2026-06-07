interface NavItem {
  id: string;
  icon: string;
  label: string;
}

interface BottomNavProps {
  screen: string;
  goNav: (s: string) => void;
  navItems: NavItem[];
}

export const BottomNav = ({ screen, goNav, navItems }: BottomNavProps) => {
  return (
    <nav className="bottom-nav">
      {navItems.map(t => (
        <button 
          key={t.id} 
          onClick={() => goNav(t.id)}
          className={`bottom-nav-btn ${screen === t.id ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">{t.icon}</span>
          <span className="bottom-nav-label">{t.label}</span>
          {screen === t.id && <div className="bottom-nav-dot" />}
        </button>
      ))}
    </nav>
  );
};
