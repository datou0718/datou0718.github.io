import React, { useLayoutEffect, useRef } from 'react';
import { content } from '../data/content';
import { useLayout } from '../context/LayoutContext';

/**
 * CV, email, and academic/professional profile links (GitHub, Scholar, LinkedIn, Instagram) —
 * not "social media", just the external places to find/contact the author.
 * Reused by both Sidebar (desktop) and MobileProfile (mobile).
 */
export const ProfileLinks: React.FC = () => (
  <div className="social-links">
    {content.cv && (
      <a href={content.cv} target="_blank" rel="noopener noreferrer"
        className="social-icon-btn" title="CV">
        <i className="ai ai-cv"></i>
      </a>
    )}
    <a href={`mailto:${content.email}`}
      className="social-icon-btn" title="Email">
      <i className="fas fa-envelope"></i>
    </a>
    <a href={content.profiles.github} target="_blank" rel="noopener noreferrer"
      className="social-icon-btn" title="GitHub">
      <i className="fab fa-github"></i>
    </a>
    <a href={content.profiles.scholar} target="_blank" rel="noopener noreferrer"
      className="social-icon-btn" title="Google Scholar">
      <i className="fas fa-graduation-cap"></i>
    </a>
    {content.profiles.linkedin && (
      <a href={content.profiles.linkedin} target="_blank" rel="noopener noreferrer"
        className="social-icon-btn" title="LinkedIn">
        <i className="fab fa-linkedin"></i>
      </a>
    )}
    {content.profiles.instagram && (
      <a href={content.profiles.instagram} target="_blank" rel="noopener noreferrer"
        className="social-icon-btn" title="Instagram">
        <i className="fab fa-instagram"></i>
      </a>
    )}
  </div>
);

const Sidebar: React.FC = () => {
  const { sidebarContent } = useLayout();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sidebar = sidebarRef.current;
    const column = sidebar?.parentElement;
    if (!sidebar || !column) return;

    // A sticky box is pushed upward when it reaches its column's bottom.
    // Give the TOC only the space above that boundary, preserving the profile.
    const syncHeight = () => {
      if (!column.getClientRects().length) return;
      const { top, bottom } = column.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(sidebar).top);
      const available = Math.max(0, Math.min(window.innerHeight, bottom) - Math.max(stickyTop, top));
      sidebar.style.setProperty('--sidebar-available-height', `${available}px`);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(column);
    window.addEventListener('scroll', syncHeight, { passive: true });
    window.addEventListener('resize', syncHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', syncHeight);
      window.removeEventListener('resize', syncHeight);
    };
  }, []);

  return (
    <div className="sidebar-wrap sidebar-affix" ref={sidebarRef}>
      <aside className="sidebar-inner">
        {/* Avatar */}
        {content.headshot ? (
          <img src={content.headshot} alt={content.name.english} className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">
            {content.name.english.charAt(0)}
          </div>
        )}

        <div className="name-section">
          <div className="sidebar-identity">
            <h2>{content.name.english}</h2>
            <h3>{content.name.chinese}</h3>
          </div>

          <div className="sidebar-details">
            <p className="sidebar-title">{content.title}</p>
          </div>

          {/* Profile links row (includes email as icon) */}
          <div className="social-row">
            <ProfileLinks />
          </div>
        </div>

        {/* The TOC can shrink independently of the avatar and profile details. */}
        {sidebarContent && (
          <div className="toc-area">
            <hr />
            {sidebarContent}
          </div>
        )}
      </aside>
    </div>
  );
};

export default Sidebar;
