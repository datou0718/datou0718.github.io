import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ThemeToggleIcon } from './ThemeToggleIcon';

interface NavRowProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

/** Sticky tab bar spanning the full glass card width, above both the
 *  sidebar and content columns (see .page-nav-row in index.css). */
const NavRow: React.FC<NavRowProps> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const path = location.pathname;

  const isAboutActive = path === '/';
  const isExperienceActive = path === '/experience';
  const isPublicationsActive = path === '/publications';
  const isPostsActive = path === '/posts' || path.startsWith('/posts/');

  let title = 'About';
  if (isExperienceActive) title = 'Experience';
  else if (isPublicationsActive) title = 'Publications';
  else if (isPostsActive) title = 'Posts';

  return (
    <div className="page-nav-row">
      <h1 className="page-nav-title">{title}</h1>
      <nav className="page-nav-tabs">
        <Link to="/" className={`page-nav-link ${isAboutActive ? 'active' : ''}`}>
          About
        </Link>
        <Link to="/experience" className={`page-nav-link ${isExperienceActive ? 'active' : ''}`}>
          Experience
        </Link>
        <Link to="/publications" className={`page-nav-link ${isPublicationsActive ? 'active' : ''}`}>
          Publications
        </Link>
        <Link to="/posts" className={`page-nav-link ${isPostsActive ? 'active' : ''}`}>
          Posts
        </Link>
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
