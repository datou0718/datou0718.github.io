import React, { useLayoutEffect, useRef } from 'react';
import { content } from '../content';
import { ProfileLinks } from './Sidebar';
import CeiWordmark from './CeiWordmark';
import { ThemeToggleIcon } from './ThemeToggleIcon';
import type { ThemeControls } from '../types/theme';

const MobileProfile: React.FC<ThemeControls> = ({ theme, toggleTheme }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Keep the avatar square and aligned with the profile links; position the
  // sticky navigation directly beneath the header's measured height.
  useLayoutEffect(() => {
    const el = rootRef.current;
    const infoEl = infoRef.current;
    if (!el || !infoEl) return;
    const sync = () => {
      document.documentElement.style.setProperty(
        '--mobile-profile-height',
        `${el.getBoundingClientRect().height}px`,
      );
      document.documentElement.style.setProperty(
        '--mobile-avatar-size',
        `${infoEl.getBoundingClientRect().height}px`,
      );
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    observer.observe(infoEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mobile-profile" ref={rootRef}>
      <CeiWordmark className="mobile-cei-wordmark" />

      <div className="mobile-profile-main">
        {content.headshot ? (
          <img src={content.headshot} alt={content.name.english} className="mobile-avatar" />
        ) : (
          <div className="mobile-avatar-placeholder">
            {content.name.english.charAt(0)}
          </div>
        )}

        <div className="mobile-profile-info" ref={infoRef}>
          <div className="mobile-row">
            <div className="mobile-name-block">
              <span className="mobile-name">{content.name.english}</span>
              <span className="mobile-name-alt">{content.name.chinese}</span>
            </div>

            <button onClick={toggleTheme} className="mobile-theme-btn" aria-label="Toggle theme">
              <ThemeToggleIcon theme={theme} size={18} />
            </button>
          </div>

          <div className="mobile-row">
            <div className="mobile-social">
              <ProfileLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProfile;
