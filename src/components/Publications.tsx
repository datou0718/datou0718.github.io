import { useState } from 'react';
import publicationsData from '../../content/publications.json';
import { content } from '../content';
import type { Publication } from '../types/content';

const publications: Publication[] = publicationsData;

const publicationLinkLabels: Record<keyof Publication['links'], string> = {
    paper: 'Paper',
    github: 'GitHub',
    arxiv: 'Arxiv',
    ieee: 'IEEE',
    acm: 'ACM',
    code: 'Code',
    pdf: 'PDF',
    project: 'Project',
};

function PublicationLinks({ publication }: { publication: Publication }) {
    return (
        <div className="pub-links">
            {(Object.keys(publicationLinkLabels) as (keyof Publication['links'])[]).map(key => {
                const href = publication.links[key];
                return href ? (
                    <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="glass-card btn pub-btn">
                        {publicationLinkLabels[key]}
                    </a>
                ) : null;
            })}
        </div>
    );
}

function PublicationAuthors({ publication }: { publication: Publication }) {
    return (
        <p className="pub-authors">
            {publication.authors.map((author, index) => (
                <span key={`${author}-${index}`} style={{ fontWeight: author === content.name.english ? 700 : 400 }}>
                    {author}{index < publication.authors.length - 1 ? ', ' : ''}
                </span>
            ))}
        </p>
    );
}

function PublicationVenue({ publication }: { publication: Publication }) {
    return (
        <p className="text-secondary pub-venue">
            {publication.venue}, {publication.year}
        </p>
    );
}

function SelectedPublicationCard({ publication }: { publication: Publication }) {
    const question = publication.researchQuestion?.trim();

    return (
        <article className="glass-card selected-publication-card">
            {publication.figure && (
                <figure className="selected-publication-figure">
                    <img
                        src={publication.figure.src}
                        alt={publication.figure.alt}
                        width={publication.figure.width}
                        height={publication.figure.height}
                        loading="lazy"
                        decoding="async"
                    />
                </figure>
            )}
            <div className="selected-publication-content">
                {publication.status && <p className="pub-status">{publication.status}</p>}
                <h3 className="pub-title">{publication.title}</h3>
                <PublicationAuthors publication={publication} />
                {question && <p className="pub-research-question"><em>{question}</em></p>}
                <details className="selected-publication-details">
                    <summary>Details &amp; abstract</summary>
                    <div className="selected-publication-details-content">
                        <PublicationVenue publication={publication} />
                        <p className="selected-publication-abstract">{publication.abstract}</p>
                    </div>
                </details>
                <PublicationLinks publication={publication} />
            </div>
        </article>
    );
}

function PublicationEntry({ publication }: { publication: Publication }) {
    return (
        <article className="pub-entry">
            {publication.status && <div className="pub-status">{publication.status}</div>}
            <h3 className="pub-title">{publication.title}</h3>
            <PublicationAuthors publication={publication} />
            <PublicationVenue publication={publication} />
            <details className="pub-abstract">
                <summary>Abstract</summary>
                <p className="pub-abstract-text">{publication.abstract}</p>
            </details>
            <PublicationLinks publication={publication} />
        </article>
    );
}

interface PublicationsProps {
    title?: string;
    selectedOnly?: boolean;
}

export default function Publications({ title = 'Publications', selectedOnly = false }: PublicationsProps) {
    const [visibleCount, setVisibleCount] = useState(5);
    const filteredPublications = selectedOnly ? publications.filter(publication => publication.selected) : publications;
    const visiblePublications = filteredPublications.slice(0, visibleCount);

    return (
        <section className="fade-in">
            {title && <h2>{title}</h2>}
            {selectedOnly ? (
                <div className="selected-publications-grid">
                    {visiblePublications.map(publication => <SelectedPublicationCard key={publication.title} publication={publication} />)}
                </div>
            ) : (
                <div className="glass-card">
                    {visiblePublications.map(publication => <PublicationEntry key={publication.title} publication={publication} />)}
                </div>
            )}
            {visibleCount < filteredPublications.length && (
                <div className="publications-more">
                    <button onClick={() => setVisibleCount(count => count + 5)} className="btn publications-more-button" title="Show more publications">
                        Show More
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                </div>
            )}
        </section>
    );
}
