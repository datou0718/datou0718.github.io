import React from 'react';
import { Link } from 'react-router-dom';
import postsData from '../data/posts.json';

const posts = [...postsData].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
);

const PostsList: React.FC = () => {
    return (
        <div className="fade-in">
            <section>
                {posts.length === 0 ? (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p className="text-secondary" style={{ fontSize: '1.2rem', margin: 0 }}>No posts found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                        {posts.map((post) => (
                            <Link to={`/posts/${post.id}/`} key={post.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
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
