import React, { useState, useRef, useLayoutEffect } from 'react';
import { content, type NewsItem, type Publication } from '../data/content';
import newsData from '../data/news.json';
import publicationsData from '../data/publications.json';

import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

export const ResearchInterests: React.FC = () => (
    <section className="fade-in">
        <h2>Research Interests</h2>
        <ul style={{ listStyleType: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {content.researchInterests.map((interest, index) => (
                <li key={index} className="glass-card" style={{ padding: '0.5rem 1rem', fontWeight: 500 }}>
                    {interest}
                </li>
            ))}
        </ul>
    </section>
);

export const Bio: React.FC = () => (
    <section className="fade-in">
        <div className="markdown-body" style={{ fontSize: '1.1rem' }}>
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {content.bio}
            </ReactMarkdown>
        </div>
    </section>
);

export const News: React.FC = () => {
    const typedNewsData = newsData as NewsItem[];
    const listRef = useRef<HTMLDivElement>(null);
    // Cap the list to exactly the first 3 items' rendered height (rather than a
    // guessed px value) so a 4th+ item always scrolls instead of just showing.
    const [maxHeight, setMaxHeight] = useState<number | 'none'>('none');

    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list) return;
        const items = list.querySelectorAll<HTMLElement>('.news-item');
        setMaxHeight(items.length > 3 ? items[3].offsetTop : 'none');
    }, [typedNewsData.length]);

    return (
        <section className="fade-in" style={{ marginBottom: '1.25rem' }}>
            <h2>Recent News</h2>
            <div className="glass-card news-card">
                <div className="news-scroll-list" ref={listRef} style={{ maxHeight }}>
                    {typedNewsData.map((item, index) => (
                        <div key={index} className="news-item">
                            <span className="news-date">{item.date}</span>
                            <span className="news-content">{item.content}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const institutionDetails: Record<string, { fallbackText: string; logo: string; bgClass: string }> = {
    "Duke University": {
        fallbackText: "D",
        logo: "/logos/duke.svg",
        bgClass: "bg-duke"
    },
    "National Taiwan University": {
        fallbackText: "NTU",
        logo: "/logos/ntu.png",
        bgClass: "bg-ntu"
    },
    "University of Notre Dame": {
        fallbackText: "ND",
        logo: "/logos/notredame.svg",
        bgClass: "bg-notredame"
    },
    "Academia Sinica": {
        fallbackText: "AS",
        logo: "/logos/sinica.svg",
        bgClass: "bg-sinica"
    },
    "Irving T. Ho Memorial Foundation": {
        fallbackText: "ITH",
        logo: "/logos/irving-t-ho-foundation.png",
        bgClass: ""
    }
};

const TimelineLogo: React.FC<{ institution: string }> = ({ institution }) => {
    const [imgError, setImgError] = React.useState(false);
    const details = institutionDetails[institution] || {
        fallbackText: institution.charAt(0),
        logo: "",
        bgClass: ""
    };

    if (imgError || !details.logo) {
        return (
            <div className={`timeline-logo-fallback ${details.bgClass}`} style={!details.bgClass ? { backgroundColor: 'var(--primary)' } : undefined}>
                {details.fallbackText}
            </div>
        );
    }

    return (
        <img
            src={details.logo}
            alt={`${institution} logo`}
            className="timeline-logo-img"
            onError={() => setImgError(true)}
        />
    );
};

const TimelineAffiliation: React.FC<{ institution: string }> = ({ institution }) => {
    return (
        <span className="timeline-affiliation">
            {institution}
        </span>
    );
};

interface TimelineItemProps {
    title: string;
    time: string;
    affiliation: string;
    location?: string;
    note?: string;
}


/** A single row within a unified section card — icon and text are both normal-flow
 *  children inside the glass card (icon centered via flexbox, not absolute positioning). */
const TimelineRow: React.FC<TimelineItemProps & { isLast: boolean }> = ({ title, time, affiliation, location, note, isLast }) => (
    <div className={`exp-row${isLast ? '' : ' exp-row-divider'}`}>
        <div className="exp-icon-col">
            <TimelineLogo institution={affiliation} />
        </div>

        <div className="exp-body">
            <div className="timeline-row">
                <h3>{title}</h3>
                <span className="timeline-meta-text">{time}</span>
            </div>
            <div className="timeline-row">
                <TimelineAffiliation institution={affiliation} />
                {location && <span className="timeline-meta-text timeline-location">{location}</span>}
            </div>
            {note && <p className="text-secondary timeline-note">{note}</p>}
        </div>
    </div>
);

/** Shared by Education/Experience/SelectedAwards/Teaching below — each just
 *  maps its own content array's field names onto TimelineRow's shape. */
function TimelineSection<T>({ heading, items, map }: {
    heading: string;
    items: T[];
    map: (item: T) => TimelineItemProps;
}) {
    return (
        <section className="fade-in">
            <h2>{heading}</h2>
            <div className="glass-card section-card">
                {items.map((item, index) => (
                    <TimelineRow key={index} {...map(item)} isLast={index === items.length - 1} />
                ))}
            </div>
        </section>
    );
}

export const Education: React.FC = () => (
    <TimelineSection
        heading="Education"
        items={content.education}
        map={(item) => ({ title: item.degree, time: item.year, affiliation: item.institution, location: item.location, note: item.details })}
    />
);

export const Experience: React.FC = () => (
    <TimelineSection
        heading="Experience"
        items={content.experience}
        map={(item) => ({ title: item.role, time: item.time, affiliation: item.institution, location: item.location, note: item.details })}
    />
);

export const SelectedAwards: React.FC = () => (
    <TimelineSection
        heading="Selected Awards"
        items={content.awards}
        map={(item) => ({ title: item.name, time: item.year, affiliation: item.organization, location: item.location, note: item.description })}
    />
);

export const Publications: React.FC<{ title?: string; selectedOnly?: boolean }> = ({ title = "Publications", selectedOnly = false }) => {
    const [visibleCount, setVisibleCount] = useState(5);
    const typedPublicationsData = publicationsData as Publication[];

    const filteredPubs = selectedOnly
        ? typedPublicationsData.filter(pub => pub.selected)
        : typedPublicationsData;

    return (
        <section className="fade-in">
            {title && <h2>{title}</h2>}
            <div className="glass-card">
                <div>
                    {filteredPubs.slice(0, visibleCount).map((pub, index) => (
                        <div key={index} className="pub-entry">
                            {pub.status && (
                                <div className="pub-status">
                                    {pub.status}
                                </div>
                            )}
                            <h3 className="pub-title">{pub.title}</h3>
                            <p className="pub-authors">
                                {pub.authors.map((a, i) => (
                                    <span key={i} style={{ fontWeight: a === "Yi-Chun Liao" ? 700 : 400 }}>
                                        {a}{i < pub.authors.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </p>
                            <p className="text-secondary pub-venue">
                                {pub.venue}, {pub.year}
                            </p>

                            <details className="pub-abstract">
                                <summary>Abstract</summary>
                                <p className="pub-abstract-text">{pub.abstract}</p>
                            </details>

                            <div className="pub-links">
                                {pub.links.paper && <a href={pub.links.paper} target="_blank" rel="noopener noreferrer" className="glass-card btn pub-btn">Paper</a>}
                                {pub.links.github && <a href={pub.links.github} target="_blank" rel="noopener noreferrer" className="glass-card btn pub-btn">GitHub</a>}
                                {pub.links.arxiv && <a href={pub.links.arxiv} target="_blank" rel="noopener noreferrer" className="glass-card btn pub-btn">Arxiv</a>}
                                {pub.links.ieee && <a href={pub.links.ieee} target="_blank" rel="noopener noreferrer" className="glass-card btn pub-btn">IEEE</a>}
                                {pub.links.acm && <a href={pub.links.acm} target="_blank" rel="noopener noreferrer" className="glass-card btn pub-btn">ACM</a>}
                                {pub.links.code && <a href={pub.links.code} target="_blank" rel="noopener noreferrer" className="glass-card btn pub-btn">Code</a>}
                                {pub.links.pdf && <a href={pub.links.pdf} target="_blank" rel="noopener noreferrer" className="glass-card btn pub-btn">PDF</a>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {visibleCount < filteredPubs.length && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => setVisibleCount(prev => prev + 5)}
                        className="btn text-primary"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', padding: '0.5rem 1rem' }}
                        title="Show more publications"
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
    <TimelineSection
        heading="Teaching"
        items={content.teaching}
        map={(item) => ({ title: item.course, time: item.year, affiliation: item.institution, location: item.location, note: item.details })}
    />
);

export const Service: React.FC = () => (
    <section className="fade-in">
        <h2>Professional Service</h2>
        <div className="glass-card">
            <div>
                {content.service.map((item, index) => (
                    <div key={index} className="mobile-stack service-entry" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        <div>
                            <p style={{ fontWeight: 700, margin: 0 }}>{item.role}</p>
                            <p className="text-secondary" style={{ margin: 0 }}>{item.organization}</p>
                        </div>
                        <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{item.years}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export const VisitorMap: React.FC = () => {
    const [mapKey, setMapKey] = React.useState(0);
    const [currentTheme, setCurrentTheme] = React.useState(document.documentElement.getAttribute('data-theme') || 'light');

    React.useEffect(() => {
        let timeoutId: any;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setMapKey(prev => prev + 1);
            }, 1000);
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    setCurrentTheme(newTheme);
                    setMapKey(prev => prev + 1);
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, []);

    React.useEffect(() => {
        const container = document.getElementById('map-container');
        if (container) {
            container.innerHTML = '';
            const oldScript = document.getElementById('mapmyvisitors');
            if (oldScript) oldScript.remove();

            const isDark = currentTheme === 'dark';
            const landColor = isDark ? 'd4af37' : '002147';
            const oceanColor = isDark ? '001938' : 'fefefe';
            const textColor = isDark ? 'ffffff' : '002147';
            const dotColor = isDark ? 'ffffff' : 'd4af37';

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = 'mapmyvisitors';
            script.src = `//mapmyvisitors.com/map.js?d=mo0RB99k6P3fYzjUxr00Is-1QQvHCH6gC-ZSKlyMPIQ&cl=${landColor}&w=a&co=${oceanColor}&ct=${textColor}&t=tt&cmn=${dotColor}&cmo=${dotColor}`;
            container.appendChild(script);
        }
    }, [mapKey, currentTheme]);

    return (
        <section className="fade-in">
            <h2>Visitors</h2>
            <div className="glass-card" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', padding: 0, overflow: 'hidden' }}>
                <div id="map-container" style={{ width: '100%' }}></div>
            </div>
        </section>
    );
};
