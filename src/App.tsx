import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { LayoutProvider } from './context/LayoutContext';
import Sidebar from './components/Sidebar';
import MobileProfile from './components/MobileProfile';
import { ThemeToggleIcon } from './components/ThemeToggleIcon';
import {
  Bio,
  News,
  ResearchInterests,
  Publications,
  VisitorMap
} from './components/Sections';

import ExperiencePage from './pages/ExperiencePage';
import PublicationsPage from './pages/PublicationsPage';
import PostsList from './pages/PostsList';
import PostView from './pages/PostView';

const Home: React.FC = () => (
  <main className="compact-sections">
    <Bio />
    <News />
    <ResearchInterests />
    <Publications title="Selected Publications" selectedOnly={true} />
    <VisitorMap />
  </main>
);

interface NavRowProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

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

  // Padding-top only applies once the bar is actually pinned (sentinel
  // scrolled out of view), so resting layout keeps its tight top spacing
  // while the stuck bar gets breathing room matching its bottom padding.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <div ref={sentinelRef} />
    <div className={`page-nav-row${isStuck ? ' is-stuck' : ''}`}>
      <h1 className="page-nav-title">{title}</h1>
      <nav className="page-nav-tabs" style={{ display: 'flex', alignItems: 'center' }}>
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
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.4rem 0.8rem'
          }}
          aria-label="Toggle Theme"
        >
          <ThemeToggleIcon theme={theme} />
        </button>
      </nav>
    </div>
    </>
  );
};

const AppContent: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="outer-padding">
      {/* Mobile Sticky Header */}
      <MobileProfile theme={theme} toggleTheme={toggleTheme} />

      <div className="container">
        <div className="glass-card page-glass">
          {/* Nav bar spans full glass card width, sticky above both columns */}
          <NavRow theme={theme} toggleTheme={toggleTheme} />

          <div className="layout-grid">
            {/* Left Column (Sidebar) */}
            <div className="sidebar-col">
              <div className="sidebar-affix">
                <Sidebar />
              </div>
            </div>

            {/* Right Column (Content) */}
            <div className="content-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/publications" element={<PublicationsPage />} />
                <Route path="/posts" element={<PostsList />} />
                <Route path="/posts/:id" element={<PostView />} />
              </Routes>
            </div>
          </div>
        </div>
        <footer style={{ textAlign: 'center', marginTop: '2rem' }} className="text-secondary">
          <p>© Copyright {new Date().getFullYear()} Yi-Chun Liao. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <Router>
        <AppContent />
      </Router>
    </LayoutProvider>
  );
};

export default App;
