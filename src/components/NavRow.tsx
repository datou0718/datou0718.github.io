import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import CeiWordmark from './CeiWordmark';
import { ThemeToggleIcon } from './ThemeToggleIcon';
import type { ThemeControls } from '../types/theme';

const navigation = [
  { path: '/', label: 'About' },
  { path: '/experience/', label: 'Experience' },
  { path: '/publications/', label: 'Publications' },
  { path: '/posts/', label: 'Posts' },
];

/** Sticky tab bar spanning the full glass card width, above both the
 *  sidebar and content columns (see .page-nav-row in index.css). */
const NavRow: React.FC<ThemeControls> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const path = location.pathname.replace(/\/+$/, '') || '/';

  const active = navigation.find(item =>
    path === (item.path.replace(/\/$/, '') || '/') ||
    (item.path === '/posts/' && path.startsWith(item.path))
  );

  return (
    <div className="page-nav-row">
      <CeiWordmark className="nav-cei-wordmark" />
      <h1 className="page-nav-title">{active?.label ?? 'About'}</h1>
      <nav className="page-nav-tabs">
        {navigation.map(item => (
          <Link key={item.path} to={item.path} className={`page-nav-link ${active === item ? 'active' : ''}`}>
            {item.label}
          </Link>
        ))}
        <button
          onClick={toggleTheme}
          className="page-nav-link theme-toggle-nav"
          aria-label="Toggle Theme"
        >
          <ThemeToggleIcon theme={theme} />
        </button>
      </nav>
    </div>
  );
};

export default NavRow;
