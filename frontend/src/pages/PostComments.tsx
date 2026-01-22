import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { colors } from '../theme/colors';
import { apiFetch } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from '../utils/timeAgo';

interface Post {
    id: number;
    title: string;
    content: string;
    time_created: string;
}

interface Comment {
    id: number;
    content: string;
    username: string; // Added username field
    time_created: string;
}

function PostComments() {
    const { topicId, postId } = useParams();
    const [comments, setComments] = useState<Comment[]>([]);
    const [post, setPost] = useState<Post | null>(null);
    const [content, setContent] = useState("");
    const { isLoggedIn, user } = useAuth(); // Destructure user

    useEffect(() => {
        fetch(`http://localhost:8080/posts/${postId}`)
            .then(response => response.json())
            .then(data => setPost(data))
            .catch(error => console.error("Error fetching post", error));
    }, [postId]);

    useEffect(() => {
        fetch(`http://localhost:8080/topics/${topicId}/posts/${postId}/comments`)
            .then(response => response.json())
            .then(data => setComments(data || []))
            .catch(error => console.error("Error fetching comments", error));
    }, [topicId, postId]);

    async function handleSubmit() {
        if (!content.trim() || !user) return; // Ensure user is present

        const response = await apiFetch(`/topics/${topicId}/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            const data = await response.json();
            const newComment: Comment = {
                id: data.id,
                content: content,
                username: user.username, // Use current user's name
                time_created: "Just Now",
            };
            setComments([...comments, newComment]);
            setContent("");
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: colors.background,
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}>
            <Navbar />

            <main style={{ maxWidth: 800, margin: '0 auto', padding: '100px 40px 40px 40px' }}>
                <Link to={`/topics/${topicId}/posts`} style={{
                    color: colors.primary,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    marginBottom: 24,
                }}>
                    ← Back to Posts
                </Link>

                {post ? (
                    <div style={{
                        padding: 32,
                        borderRadius: 16,
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${colors.border}`,
                        marginBottom: 32,
                    }}>
                        <h1 style={{ color: colors.text, fontSize: 24, fontWeight: 700, margin: '0 0 16px 0' }}>
                            {post.title}
                        </h1>
                        <p style={{ color: colors.text, fontSize: 16, margin: '0 0 20px 0', lineHeight: 1.6 }}>
                            {post.content}
                        </p>
                        <div style={{ color: colors.muted, fontSize: 12 }}>
                            {formatTimeAgo(post.time_created)}
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: 40, textAlign: 'center', color: colors.muted }}>
                        Loading post...
                    </div>
                )}

                {/* Create Comment Form */}
                {isLoggedIn && (
                    <div style={{ marginBottom: 32 }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            borderRadius: 12,
                            padding: '4px 16px',
                            border: `1px solid ${colors.border}`,
                            gap: 12,
                        }}>
                            <textarea
                                placeholder="Join the conversation..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    padding: '12px 0',
                                    fontSize: 15,
                                    color: colors.text,
                                    outline: 'none',
                                    resize: 'none',
                                    fontFamily: 'inherit',
                                    minHeight: 24,
                                }}
                            />
                            {content.trim() && (
                                <button
                                    onClick={handleSubmit}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: 8,
                                        backgroundColor: colors.primary,
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 600,
                                        fontSize: 14,
                                    }}
                                >
                                    Comment
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            style={{
                                padding: 20,
                                borderRadius: 12,
                                backgroundColor: '#FFFFFF',
                                border: `1px solid ${colors.border}`,
                            }}
                        >
                            <div style={{ marginBottom: 8, fontSize: 12, color: colors.muted }}>
                                <span style={{ fontWeight: 600, color: colors.text }}>{comment.username}</span>
                                <span style={{ margin: '0 8px' }}>•</span>
                                {formatTimeAgo(comment.time_created)}
                            </div>
                            <p style={{ color: colors.text, fontSize: 15, margin: 0, lineHeight: 1.5 }}>
                                {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default PostComments;
