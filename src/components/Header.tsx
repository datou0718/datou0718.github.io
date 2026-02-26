import React from 'react';
import { Link } from 'react-router-dom';
import { content } from '../data/content';

const Header: React.FC = () => {
    return (
        <header className="fade-in" style={{ padding: '4rem 0 2rem' }}>
            <div className="glass-card mobile-stack" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 1 200px' }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '200px',
                        aspectRatio: '1/1',
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        {content.headshot ? (
                            <img src={content.headshot} alt={`${content.name} headshot`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(45deg, var(--primary), var(--accent))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 'clamp(2rem, 10vw, 5rem)',
                                fontWeight: 'bold'
                            }}>
                                {content.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ flex: '1 1 300px' }}>
                    <h1 style={{ margin: 0, color: 'var(--primary)', lineHeight: 1.2 }}>
                        <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>Yi-Chun Liao</span>{' '}
                        <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>(廖奕鈞)</span>
                    </h1>
                    <p className="text-secondary" style={{ fontSize: '1.25rem', fontWeight: 500, margin: '0.5rem 0 1rem' }}>
                        {content.title}
                    </p>
                    <p className="header-contact" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '1.5rem' }}>
                        <a href={`mailto:${content.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                            {content.email}
                        </a>
                    </p>

                    <div className="header-links" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {content.cv && (
                            <a href={content.cv} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
                                CV
                            </a>
                        )}
                        <Link to="/posts" className="glass-card btn" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', textDecoration: 'none' }}>
                            Posts
                        </Link>
                        <a href={content.socials.github} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
                            GitHub
                        </a>
                        <a href={content.socials.scholar} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
                            Google Scholar
                        </a>
                        <a href={content.socials.linkedin} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
