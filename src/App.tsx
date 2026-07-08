import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutProvider } from './context/LayoutContext';
import Sidebar from './components/Sidebar';
import MobileProfile from './components/MobileProfile';
import NavRow from './components/NavRow';
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
