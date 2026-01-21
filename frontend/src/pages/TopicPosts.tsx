import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { colors } from '../theme/colors';
import { apiFetch, getToken } from '../services/api';

interface Post {
    id: number;
    title: string;
    content: string;
    time_created: string;
}

function TopicPosts() {
    const { id } = useParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const isLoggedIn = !!getToken();

    useEffect(() => {
        fetch(`http://localhost:8080/topics/${id}/posts`)
            .then(response => response.json())
            .then(data => setPosts(data || []))
            .catch(error => console.error("Error fetching posts", error));
    }, [id]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        const response = await apiFetch(`/topics/${id}/posts`, {
            method: 'POST',
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            const data = await response.json();
            const newPost: Post = {
                id: data.id,
                title: title,
                content: content,
                time_created: "Just Now",
            };
            setPosts([...posts, newPost]);
            setTitle("");
            setContent("");
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: colors.background,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 40px',
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: '#FFFFFF',
                gap: 16,
            }}>
                <Link to="/" style={{ color: colors.primary, textDecoration: 'none', fontWeight: 500 }}>
                    ← Back
                </Link>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.text, margin: 0 }}>
                    Posts
                </h1>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
                {/* Create Post Form */}
                {isLoggedIn && (
                    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
                        <input
                            type="text"
                            placeholder="Post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 12,
                                marginBottom: 12,
                                borderRadius: 8,
                                border: `1px solid ${colors.border}`,
                                fontSize: 16,
                                boxSizing: 'border-box',
                            }}
                        />
                        <textarea
                            placeholder="Post content..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 12,
                                marginBottom: 12,
                                borderRadius: 8,
                                border: `1px solid ${colors.border}`,
                                fontSize: 16,
                                minHeight: 100,
                                resize: 'vertical',
                                boxSizing: 'border-box',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '12px 24px',
                                borderRadius: 8,
                                backgroundColor: colors.primary,
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            Create Post
                        </button>
                    </form>
                )}

                {/* Posts List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {posts.map(post => (
                        <Link
                            key={post.id}
                            to={`/topics/${id}/posts/${post.id}/comments`}
                            style={{
                                padding: 20,
                                borderRadius: 12,
                                backgroundColor: '#FFFFFF',
                                border: `1px solid ${colors.border}`,
                                textDecoration: 'none',
                            }}
                        >
                            <h3 style={{ color: colors.text, fontSize: 18, fontWeight: 600, margin: 0 }}>
                                {post.title}
                            </h3>
                            <p style={{ color: colors.muted, fontSize: 14, margin: '8px 0' }}>
                                {post.content}
                            </p>
                            <span style={{ color: colors.muted, fontSize: 12 }}>
                                {post.time_created}
                            </span>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default TopicPosts;
