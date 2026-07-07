import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useLayout } from '../context/LayoutContext';

interface PostMeta {
    id: string;
    title: string;
    date: string;
    description: string;
    file: string;
}

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

const PostView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [meta, setMeta] = useState<PostMeta | null>(null);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [headings, setHeadings] = useState<Array<{ id: string; text: string; depth: number }>>([]);
    const [activeId, setActiveId] = useState<string>('');
    const { setSidebarContent } = useLayout();

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

    useEffect(() => {
        const loadPost = async () => {
            try {
                // 1. Fetch metadata to get the filename
                const metaModule = await import('../data/posts.json');
                const postMeta = metaModule.default.find((p: PostMeta) => p.id === id);

                if (!postMeta) {
                    setError("Post not found");
                    setLoading(false);
                    return;
                }

                setMeta(postMeta);

                // 2. Load the actual markdown file from eagerness glob import
                const filePath = `../posts/${postMeta.file}`;
                const text = postsContent[filePath] as string;
                if (!text) throw new Error("Could not load markdown file from bundle");

                setContent(text);
                setHeadings(parseHeadings(text));
                setLoading(false);

                // After content loads, wait a tick for ReactMarkdown to render and then scroll
                setTimeout(() => {
                    const fullHash = window.location.hash; // e.g. "#/posts/application_sharing#前言"
                    const hashParts = fullHash.split('#');
                    if (hashParts.length >= 3) {
                        const targetId = hashParts.slice(2).join('#'); // Everything after the second #
                        try {
                            const decodedId = decodeURIComponent(targetId);
                            const element = document.getElementById(decodedId);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        } catch (err) { }
                    }
                }, 100);
            } catch (err: any) {
                console.error("Error loading post:", err);
                setError(err.message || "An error occurred");
                setLoading(false);
            }
        };

        if (id) loadPost();
    }, [id]);

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
                                            const hashParts = window.location.hash.split('#');
                                            if (hashParts.length >= 2) {
                                                window.history.pushState(null, '', `#${hashParts[1]}#${heading.id}`);
                                            }
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

    if (loading) {
        return <div style={{ paddingTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading post...</div>;
    }

    if (error || !meta) {
        return (
            <div className="fade-in" style={{ paddingTop: '4rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--primary)' }}>Oops!</h1>
                <p className="text-secondary">{error || "Post not found"}</p>
                <Link to="/posts" className="glass-card btn" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', marginTop: '2rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, borderRadius: '0.75rem' }}>
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
                            h1: ({ children }) => {
                                const text = getParagraphText(children);
                                const id = slugify(text);
                                return <h1 id={id}>{children}</h1>;
                            },
                            h2: ({ children }) => {
                                const text = getParagraphText(children);
                                const id = slugify(text);
                                return <h2 id={id}>{children}</h2>;
                            },
                            h3: ({ children }) => {
                                const text = getParagraphText(children);
                                const id = slugify(text);
                                return <h3 id={id}>{children}</h3>;
                            },
                            h4: ({ children }) => {
                                const text = getParagraphText(children);
                                const id = slugify(text);
                                return <h4 id={id}>{children}</h4>;
                            },
                            h5: ({ children }) => {
                                const text = getParagraphText(children);
                                const id = slugify(text);
                                return <h5 id={id}>{children}</h5>;
                            },
                            h6: ({ children }) => {
                                const text = getParagraphText(children);
                                const id = slugify(text);
                                return <h6 id={id}>{children}</h6>;
                            },
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
