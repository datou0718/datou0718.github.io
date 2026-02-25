import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import {
  Bio,
  News,
  ResearchInterests,
  Publications,
  Teaching,
  // Service,
  VisitorMap,
  Education,
  SelectedAwards
} from './components/Sections';

import PostsList from './pages/PostsList';
import PostView from './pages/PostView';

const Home: React.FC = () => (
  <>
    <Header />
    <main>
      <Bio />
      <ResearchInterests />
      <News />
      <Education />
      <SelectedAwards />
      <Publications />
      <Teaching />
      {/* <Service /> */}
      <VisitorMap />
    </main>
  </>
);

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="container" style={{ paddingBottom: '5rem' }}>
        <button
          onClick={toggleTheme}
          className="glass-card btn theme-toggle"
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            padding: '0.75rem',
            zIndex: 100,
            cursor: 'pointer',
            borderRadius: '50%',
            width: '3.2rem',
            height: '3.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            boxShadow: 'var(--shadow-lg)'
          }}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
            </svg>
          )}
        </button>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<PostsList />} />
          <Route path="/posts/:id" element={<PostView />} />
        </Routes>

        <footer style={{ textAlign: 'center', marginTop: '4rem' }} className="text-secondary">
          <p>© Copyright {new Date().getFullYear()} Yi-Chun Liao. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
