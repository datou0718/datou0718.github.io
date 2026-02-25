import React, { useState } from 'react';
import { content, type NewsItem, type Publication } from '../data/content';
import newsData from '../data/news.json';
import publicationsData from '../data/publications.json';

import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

export const ResearchInterests: React.FC = () => (
    <section className="fade-in">
        <h2>Research Interests</h2>
        <ul style={{ listStyleType: 'none', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {content.researchInterests.map((interest, index) => (
                <li key={index} className="glass-card" style={{ padding: '0.75rem 1.5rem', fontWeight: 500 }}>
                    {interest}
                </li>
            ))}
        </ul>
    </section>
);

export const Bio: React.FC = () => (
    <section className="fade-in">
        <h2>About Me</h2>
        <div className="glass-card" style={{ padding: '2rem' }}>
            <div className="markdown-body" style={{ fontSize: '1.1rem' }}>
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                    {content.bio}
                </ReactMarkdown>
            </div>
        </div>
    </section>
);

export const News: React.FC = () => {
    const [visibleCount, setVisibleCount] = useState(3);
    const typedNewsData = newsData as NewsItem[];

    return (
        <section className="fade-in">
            <h2>Recent News</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {typedNewsData.slice(0, visibleCount).map((item, index) => (
                    <div key={index} className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', minWidth: '100px' }}>{item.date}</span>
                        <span style={{ flex: 1 }}>{item.content}</span>
                    </div>
                ))}
            </div>
            {visibleCount < typedNewsData.length && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => setVisibleCount(prev => prev + 5)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1rem' }}
                        title="Show 5 more news items"
                    >
                        Show More
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                </div>
            )}
        </section>
    );
};

export const Education: React.FC = () => (
    <section className="fade-in">
        <h2>Education</h2>
        <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {content.education.map((item, index) => (
                    <div key={index} style={{ borderBottom: index < content.education.length - 1 ? '1px solid var(--glass-border)' : 'none', paddingBottom: index < content.education.length - 1 ? '1.5rem' : '0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.25rem' }}>{item.degree}</h3>
                            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.year}</span>
                        </div>
                        <p style={{ fontWeight: 500, margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.institution}</p>
                        {item.details && <p className="text-secondary" style={{ margin: 0 }}>{item.details}</p>}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export const SelectedAwards: React.FC = () => (
    <section className="fade-in">
        <h2>Selected Awards</h2>
        <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {content.awards.map((item, index) => (
                    <div key={index} style={{ borderBottom: index < content.awards.length - 1 ? '1px solid var(--glass-border)' : 'none', paddingBottom: index < content.awards.length - 1 ? '1.5rem' : '0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.25rem' }}>{item.name}</h3>
                            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.year}</span>
                        </div>
                        <p style={{ fontWeight: 500, margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.organization}</p>
                        {item.description && <p className="text-secondary" style={{ margin: 0 }}>{item.description}</p>}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export const Publications: React.FC = () => {
    const [visibleCount, setVisibleCount] = useState(3);
    const typedPublicationsData = publicationsData as Publication[];

    return (
        <section className="fade-in">
            <h2>Representative Publications</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {typedPublicationsData.slice(0, visibleCount).map((pub, index) => (
                    <div key={index} className="glass-card" style={{ padding: '2rem' }}>
                        {pub.status && (
                            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
                                {pub.status}
                            </div>
                        )}
                        <h3 style={{ marginBottom: '0.5rem' }}>{pub.title}</h3>
                        <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
                            {pub.authors.map((a, i) => (
                                <span key={i} style={{ fontWeight: a === "Yi-Chun Liao" ? 700 : 400 }}>
                                    {a}{i < pub.authors.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </p>
                        <p className="text-secondary" style={{ fontStyle: 'italic', marginBottom: '1rem' }}>
                            {pub.venue}, {pub.year}
                        </p>

                        <details style={{ marginBottom: '1rem', cursor: 'pointer' }}>
                            <summary style={{ fontWeight: 600, color: 'var(--primary)' }}>Abstract</summary>
                            <p style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(0,0,0,0.05)', borderRadius: '0.5rem' }}>{pub.abstract}</p>
                        </details>

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {pub.links.paper && <a href={pub.links.paper} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>Paper</a>}
                            {pub.links.github && <a href={pub.links.github} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>Github</a>}
                            {pub.links.arxiv && <a href={pub.links.arxiv} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>Arxiv</a>}
                            {pub.links.ieee && <a href={pub.links.ieee} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>IEEE</a>}
                            {pub.links.acm && <a href={pub.links.acm} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>ACM</a>}
                            {pub.links.code && <a href={pub.links.code} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>Code</a>}
                            {pub.links.pdf && <a href={pub.links.pdf} target="_blank" rel="noopener noreferrer" className="glass-card btn" style={{ padding: '0.4rem 0.8rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>PDF</a>}
                        </div>
                    </div>
                ))}
            </div>
            {visibleCount < typedPublicationsData.length && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => setVisibleCount(prev => prev + 5)}
                        className="btn text-primary"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', padding: '0.5rem 1rem' }}
                        title="Show 5 more publications"
                    >
                        Show More
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                </div>
            )}
        </section>
    );
};

export const Teaching: React.FC = () => (
    <section className="fade-in">
        <h2>Teaching</h2>
        <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {content.teaching.map((item, index) => (
                    <div key={index} style={{ borderBottom: index < content.teaching.length - 1 ? '1px solid var(--glass-border)' : 'none', paddingBottom: index < content.teaching.length - 1 ? '1.5rem' : '0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.25rem' }}>
                                {item.role}{item.course ? ` of ${item.course}` : ''}
                            </h3>
                            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.years}</span>
                        </div>
                        <p style={{ fontWeight: 500, margin: 0, fontSize: '1.1rem' }}>{item.institution}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export const Service: React.FC = () => (
    <section className="fade-in">
        <h2>Professional Service</h2>
        <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {content.service.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: index < content.service.length - 1 ? '1px solid var(--glass-border)' : 'none', paddingBottom: index < content.service.length - 1 ? '1.5rem' : '0' }}>
                        <div>
                            <p style={{ fontWeight: 700, margin: 0 }}>{item.role}</p>
                            <p className="text-secondary" style={{ margin: 0 }}>{item.organization}</p>
                        </div>
                        <span style={{ fontWeight: 500 }}>{item.years}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export const VisitorMap: React.FC = () => (
    <section className="fade-in mb-8">
        <h2>Visitors</h2>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
            {/* Replace the href and src with your actual ClustrMaps tracking IDs */}
            <a href="https://clustrmaps.com/site/1b7y4" title="Visit tracker" target="_blank" rel="noopener noreferrer">
                <img
                    src="//www.clustrmaps.com/map_v2.png?d=yY4M2I_0FfXvY6d_1Hq9l2kO9_12Gj3hU_W44O5y69k&cl=ffffff"
                    alt="Visitor Map"
                    style={{ borderRadius: '0.5rem', border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-md)', maxWidth: '100%' }}
                />
            </a>
        </div>
    </section>
);
