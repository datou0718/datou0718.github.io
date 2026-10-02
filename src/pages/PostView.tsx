import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useLayout } from '../context/LayoutContext';
import postsData from '../data/posts.json';

// Eagerly glob import all markdown posts at compile time to prevent runtime fetch failures.
const postsContent = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

// Shared slugifier to ensure 100% agreement between Table of Contents links and rendered headings
const slugify = (text: string) => {
    return text
        .toLowerCase()
        // Replace spaces/tabs/newlines with hyphens
        .replace(/\s+/g, '-')
        // Remove non-word, non-CJK, non-hyphen chars (keep English letters, numbers, CJK, hyphens, underscores)
        .replace(/[^\w\u4e00-\u9fa5\-\_]+/g, '')
        // Collapse multiple hyphens
        .replace(/-+/g, '-')
        // Trim leading and trailing hyphens
        .replace(/^-+|-+$/g, '');
};

// Helper to extract raw text content recursively from React nodes
const getParagraphText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getParagraphText).join('');
    if (node && node.props && node.props.children) return getParagraphText(node.props.children);
    return '';
};

// Slugified-id heading renderer shared by h1-h6 so TOC links resolve consistently.
const makeHeadingRenderer = (Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') =>
    ({ children }: { children?: React.ReactNode }) => {
        const text = getParagraphText(children);
        const id = slugify(text);
        return <Tag id={id}>{children}</Tag>;
    };

const parseHeadings = (text: string) => {
    // Strip code blocks first to avoid matching headings in code
    const strippedText = text.replace(/```[\s\S]*?```/g, '');
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const list: Array<{ id: string; text: string; depth: number }> = [];
    let match;
    while ((match = headingRegex.exec(strippedText)) !== null) {
        const depth = match[1].length;
        // Clean up basic markdown formatting from heading text to display clean text in TOC
        const headingText = match[2].replace(/[\*\_`#]/g, '').trim();
        const headingId = slugify(headingText);
        list.push({ id: headingId, text: headingText, depth });
    }
    return list;
};

const PostView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { hash } = useLocation();
    // These files are already bundled; synchronous reads also make the full post
    // available to the static renderer instead of an unindexable loading screen.
    const meta = postsData.find(post => post.id === id);
    const content = meta ? (postsContent[`../posts/${meta.file}`] as string | undefined) ?? '' : '';
    const error = !meta ? 'Post not found' : !content ? 'Could not load markdown file from bundle' : null;
    const headings = useMemo(() => parseHeadings(content), [content]);
    const [activeId, setActiveId] = useState<string>('');
    const { setSidebarContent } = useLayout();

    useEffect(() => {
        if (!hash) return;
        const timeout = window.setTimeout(() => {
            try {
                document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' });
            } catch {
                // A malformed fragment should not prevent the article loading.
            }
        }, 100);
        return () => window.clearTimeout(timeout);
    }, [id, hash]);

    // IntersectionObserver to highlight current active heading in TOC
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) {
                    setActiveId(visible.target.id);
                }
            },
            { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
        );

        headings.forEach((h) => {
            const el = document.getElementById(h.id);
            if (el) observer.observe(el);
        });

        return () => {
            headings.forEach((h) => {
                const el = document.getElementById(h.id);
                if (el) observer.unobserve(el);
            });
        };
    }, [headings]);

    // Push Table of Contents to Sidebar
    useEffect(() => {
        if (headings.length > 0) {
            setSidebarContent(
                <nav className="toc-nav">
                    <h3>Table of Contents</h3>
                    <ul className="toc-list">
                        {headings.filter(h => h.depth >= 2 && h.depth <= 3).map((heading, i) => (
                            <li key={i}>
                                <a
                                    href={`#${heading.id}`}
                                    className={activeId === heading.id ? 'active' : ''}
                                    style={{ '--depth-pad': `${Math.max(0, heading.depth - 2) * 0.75}rem` } as React.CSSProperties}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const element = document.getElementById(heading.id);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth' });
                                            setActiveId(heading.id);
                                            window.history.pushState(null, '', `#${encodeURIComponent(heading.id)}`);
                                        }
                                    }}
                                >
                                    {heading.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            );
        }
        return () => {
            setSidebarContent(null);
        };
    }, [headings, activeId, setSidebarContent]);

    if (error || !meta) {
        return (
            <div className="fade-in" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--primary)' }}>Oops!</h1>
                <p className="text-secondary">{error || "Post not found"}</p>
                <Link to="/posts/" className="glass-card btn" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', marginTop: '2rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, borderRadius: '0.75rem' }}>
                    Return to Posts
                </Link>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <section>
                <div className="markdown-body" style={{
                    color: 'var(--text-primary)',
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    backgroundColor: 'transparent'
                }}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                            h1: makeHeadingRenderer('h1'),
                            h2: makeHeadingRenderer('h2'),
                            h3: makeHeadingRenderer('h3'),
                            h4: makeHeadingRenderer('h4'),
                            h5: makeHeadingRenderer('h5'),
                            h6: makeHeadingRenderer('h6'),
                            a: ({ node, href, children, ...props }) => {
                                if (href && href.startsWith('#')) {
                                    return (
                                        <a
                                            href={href}
                                            {...(props as any)}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                let targetId = href.substring(1);
                                                try {
                                                    targetId = decodeURIComponent(targetId);
                                                } catch (err) { }

                                                const element = document.getElementById(targetId);
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                        >
                                            {children}
                                        </a>
                                    );
                                }
                                return <a href={href} {...(props as any)}>{children}</a>;
                            }
                        }}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            </section>
        </div>
    );
};

export default PostView;
