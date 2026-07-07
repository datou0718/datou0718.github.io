import React, { useLayoutEffect, useRef } from 'react';
import { content } from '../data/content';
import { ProfileLinks } from './Sidebar';
import { ThemeToggleIcon } from './ThemeToggleIcon';

interface MobileProfileProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const MobileProfile: React.FC<MobileProfileProps> = ({ theme, toggleTheme }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // The sticky nav row below this bar needs to know exactly how tall this bar
  // renders (avatar size, whether the name wraps, etc. can all change it) so
  // it can pin itself flush underneath instead of guessing a fixed px value
  // and ending up overlapping/jumping on scroll. The avatar itself is sized
  // to match the info block's real measured height (name row + profile-links
  // row) rather than a fixed px guess or a CSS aspect-ratio/stretch trick,
  // which is finicky to get pixel-exact when an <img>'s own intrinsic size
  // is also in play.
  useLayoutEffect(() => {
    const el = rootRef.current;
    const infoEl = infoRef.current;
    if (!el || !infoEl) return;
    const sync = () => {
      document.documentElement.style.setProperty('--mobile-profile-height', `${el.offsetHeight}px`);
      document.documentElement.style.setProperty('--mobile-avatar-size', `${infoEl.offsetHeight}px`);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    observer.observe(infoEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mobile-profile" ref={rootRef}>
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
  );
};

export default MobileProfile;
