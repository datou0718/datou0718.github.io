import React from 'react';
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

  return (
    <div className="sidebar-wrap">
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

          {/* Dynamic Content (Table of Contents) */}
          {sidebarContent && (
            <div className="toc-area">
              <hr />
              {sidebarContent}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
