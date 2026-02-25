import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface PostMeta {
    id: string;
    title: string;
    date: string;
    description: string;
    file: string;
}

const PostView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [meta, setMeta] = useState<PostMeta | null>(null);
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

                // 2. Fetch the actual markdown file from the public folder
                const response = await fetch(`/posts/${postMeta.file}`);
                if (!response.ok) throw new Error("Could not load markdown file");

                const text = await response.text();
                setContent(text);
                setLoading(false);
            } catch (err: any) {
                console.error("Error loading post:", err);
                setError(err.message || "An error occurred");
                setLoading(false);
            }
        };

        if (id) loadPost();
    }, [id]);

    if (loading) {
        return <div style={{ paddingTop: '8rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading post...</div>;
    }

    if (error || !meta) {
        return (
            <div className="fade-in" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <h1 style={{ color: 'var(--primary)' }}>Oops!</h1>
                <p className="text-secondary">{error || "Post not found"}</p>
                <Link to="/posts" className="glass-card btn" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', marginTop: '2rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, borderRadius: '0.75rem' }}>
                    Return to Posts
                </Link>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ padding: '4rem 0 2rem' }}>
            <section>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
                    <Link to="/posts" className="glass-card btn" style={{ padding: '0.5rem 1.25rem', fontWeight: 600, borderRadius: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Back to Posts
                    </Link>
                </div>

                <div className="markdown-body" style={{
                    color: 'var(--text-primary)',
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    backgroundColor: 'transparent'
                }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                        {content}
                    </ReactMarkdown>
                </div>
            </section>
        </div>
    );
};

export default PostView;
