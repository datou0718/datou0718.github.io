import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { PostMeta } from '../types/content';

const PostsList: React.FC = () => {
    const [posts, setPosts] = useState<PostMeta[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this might be a dynamic fetch, but here we can just import the JSON
        import('../data/posts.json')
            .then((module) => {
                // Sort posts by date descending
                const sortedPosts = module.default.sort((a: PostMeta, b: PostMeta) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setPosts(sortedPosts);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error loading posts:", error);
                setLoading(false);
            });
    }, []);

    return (
        <div className="fade-in">
            <section>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p className="text-secondary" style={{ fontSize: '1.2rem', margin: 0 }}>No posts found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                        {posts.map((post) => (
                            <Link to={`/posts/${post.id}`} key={post.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                                <div className="glass-card btn" style={{ width: '100%', display: 'block', textAlign: 'left' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary)', fontSize: '1.25rem' }}>{post.title}</h3>
                                    <p className="text-secondary" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 400 }}>{post.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default PostsList;
