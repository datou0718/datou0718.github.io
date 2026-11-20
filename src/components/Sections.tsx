import React, { useRef, useLayoutEffect } from 'react';
import { content } from '../content';
import type { AwardItem, EducationItem, ExperienceItem, Institution, NewsItem, TeachingItem } from '../types/content';
import newsData from '../../content/news.json';
import bio from '../../content/bio.md?raw';
import institutions from '../../content/institutions.json';
import TagList from './TagList';

import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

export const ResearchInterests: React.FC = () => (
    <section className="fade-in research-interests">
        <h2>Research Interests</h2>
        <TagList items={content.researchInterests} />
    </section>
);

export const Bio: React.FC = () => (
    <section className="fade-in">
        <div className="markdown-body bio-text">
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {bio}
            </ReactMarkdown>
        </div>
    </section>
);

export const News: React.FC = () => {
    const news: NewsItem[] = newsData;
    const listRef = useRef<HTMLDivElement>(null);
    // Cap the list to exactly the first 3 items' rendered height (rather than a
    // guessed px value) so a 4th+ item always scrolls instead of just showing.

    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list) return;
        const items = list.querySelectorAll<HTMLElement>('.news-item');
        const syncHeight = () => {
            const fourthItem = items[3];
            list.style.maxHeight = fourthItem
                ? `${fourthItem.getBoundingClientRect().top - list.getBoundingClientRect().top + list.scrollTop}px`
                : 'none';
        };
        syncHeight();
        // Row heights change when dates stack on mobile or text wraps after
        // fonts load. Observe the rows so the three-item cap stays accurate.
        const observer = new ResizeObserver(syncHeight);
        items.forEach(item => observer.observe(item));
        return () => observer.disconnect();
    }, [news.length]);

    return (
        <section className="fade-in">
            <h2>Recent News</h2>
            <div className="glass-card news-card">
                <div className="news-scroll-list" ref={listRef}>
                    {news.map((item, index) => (
                        <div key={index} className="news-item">
                            <span className="news-date">{item.date}</span>
                            <span className="news-content">
                                <ReactMarkdown
                                    allowedElements={['strong', 'em', 'a', 'code', 'br']}
                                    unwrapDisallowed
                                    skipHtml
                                >
                                    {item.content}
                                </ReactMarkdown>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const institutionDetails: Record<string, Institution> = institutions;

const TimelineLogo: React.FC<{ institution: string }> = ({ institution }) => {
    const [imgError, setImgError] = React.useState(false);
    const details = institutionDetails[institution] || {
        initials: institution.charAt(0),
        logo: ""
    };

    if (imgError || !details.logo) {
        return (
            <div className="timeline-logo-fallback" style={{ backgroundColor: details.color ?? 'var(--primary)' }}>
                {details.initials}
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

interface TimelineItemProps {
    title: string;
    time: string;
    affiliation: string;
    location?: string;
    note?: string;
}


/** A single row within a unified section card — icon and text are both normal-flow
 *  children inside the glass card (icon centered via flexbox, not absolute positioning). */
const TimelineRow: React.FC<TimelineItemProps> = ({ title, time, affiliation, location, note }) => (
    <div className="exp-row">
        <div className="exp-icon-col">
            <TimelineLogo institution={affiliation} />
        </div>

        <div className="exp-body">
            <div className="timeline-row">
                <h3>{title}</h3>
                <span className="timeline-meta-text">{time}</span>
            </div>
            <div className="timeline-row">
                <span className="timeline-affiliation">{affiliation}</span>
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
            <div className="glass-card">
                {items.map((item, index) => (
                    <TimelineRow key={index} {...map(item)} />
                ))}
            </div>
        </section>
    );
}

export const Education: React.FC = () => (
    <TimelineSection<EducationItem>
        heading="Education"
        items={content.education}
        map={(item) => ({ title: item.degree, time: item.year, affiliation: item.institution, location: item.location, note: item.details })}
    />
);

export const Experience: React.FC = () => (
    <TimelineSection<ExperienceItem>
        heading="Experience"
        items={content.experience}
        map={(item) => ({ title: item.role, time: item.time, affiliation: item.institution, location: item.location, note: item.details })}
    />
);

export const SelectedAwards: React.FC = () => (
    <TimelineSection<AwardItem>
        heading="Selected Awards"
        items={content.awards}
        map={(item) => ({ title: item.name, time: item.year, affiliation: item.organization, location: item.location, note: item.description })}
    />
);

export const Teaching: React.FC = () => (
    <TimelineSection<TeachingItem>
        heading="Teaching"
        items={content.teaching}
        map={(item) => ({ title: item.course, time: item.year, affiliation: item.institution, location: item.location, note: item.details })}
    />
);

export const Reviewer: React.FC = () => (
    <section className="fade-in">
        <h2>Reviewer</h2>
        <TagList items={content.reviewer.map(item => `${item.venue} ${item.years}`)} />
    </section>
);
