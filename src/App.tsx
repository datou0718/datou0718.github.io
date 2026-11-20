import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LayoutProvider } from './context/LayoutProvider';
import Sidebar from './components/Sidebar';
import MobileProfile from './components/MobileProfile';
import NavRow from './components/NavRow';
import {
  Bio,
  News,
  ResearchInterests,
  Reviewer,
} from './components/Sections';
import Publications from './components/Publications';
import VisitorMap from './components/VisitorMap';
import type { Theme } from './types/theme';

import ExperiencePage from './pages/ExperiencePage';
import PublicationsPage from './pages/PublicationsPage';
import PostsList from './pages/PostsList';
import PostView from './pages/PostView';
import Seo from './components/Seo';
import { content } from './content';

const Home: React.FC = () => (
  <main className="compact-sections">
    <Bio />
    <News />
    <ResearchInterests />
    <Publications title="Selected Publications" selectedOnly={true} />
    <Reviewer />
  </main>
);

const AppContent: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="outer-padding">
      <Seo />
      {/* Mobile Sticky Header */}
      <MobileProfile theme={theme} toggleTheme={toggleTheme} />

      <div className="container">
        <div className="glass-card page-glass">
          {/* Nav bar spans full glass card width, sticky above both columns */}
          <NavRow theme={theme} toggleTheme={toggleTheme} />

          <div className="layout-grid">
            {/* Left Column (Sidebar) */}
            <div className="sidebar-col sidebar-with-map">
              <Sidebar>
                <VisitorMap theme={theme} />
              </Sidebar>
            </div>

            {/* Right Column (Content) */}
            <div className="content-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/experience" element={<ExperiencePage />} />
                <Route path="/publications" element={<PublicationsPage />} />
                <Route path="/posts" element={<PostsList />} />
                <Route path="/posts/:id" element={<PostView />} />
                <Route path="*" element={
                  <div className="fade-in">
                    <h1>Page not found</h1>
                    <Link to="/">Return to About</Link>
                  </div>
                } />
              </Routes>
            </div>
          </div>
        </div>
        <footer className="site-footer text-secondary">
          <p>© Copyright {new Date().getFullYear()} {content.name.english}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LayoutProvider>
      <AppContent />
    </LayoutProvider>
  );
};

export default App;
