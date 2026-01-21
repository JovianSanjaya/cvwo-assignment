import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { colors } from '../theme/colors';
import { apiFetch, getToken } from '../services/api';

interface Comment {
    id: number;
    content: string;
    time_created: string;
}

function PostComments() {
    const { topicId, postId } = useParams();
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState("");
    const isLoggedIn = !!getToken();

    useEffect(() => {
        fetch(`http://localhost:8080/topics/${topicId}/posts/${postId}/comments`)
            .then(response => response.json())
            .then(data => setComments(data || []))
            .catch(error => console.error("Error fetching comments", error));
    }, [topicId, postId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim()) return;

        const response = await apiFetch(`/topics/${topicId}/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            const data = await response.json();
            const newComment: Comment = {
                id: data.id,
                content: content,
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
            {/* Header */}
            <header style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 40px',
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: '#FFFFFF',
                gap: 16,
            }}>
                <Link to={`/topics/${topicId}/posts`} style={{ color: colors.primary, textDecoration: 'none', fontWeight: 500 }}>
                    ← Back
                </Link>
                <h1 style={{ fontSize: 20, fontWeight: 700, color: colors.text, margin: 0 }}>
                    Comments
                </h1>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
                {/* Create Comment Form */}
                {isLoggedIn && (
                    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
                        <textarea
                            placeholder="Write a comment..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 12,
                                marginBottom: 12,
                                borderRadius: 8,
                                border: `1px solid ${colors.border}`,
                                fontSize: 16,
                                minHeight: 80,
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
                            Add Comment
                        </button>
                    </form>
                )}

                {/* Comments List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            style={{
                                padding: 16,
                                borderRadius: 12,
                                backgroundColor: '#FFFFFF',
                                border: `1px solid ${colors.border}`,
                            }}
                        >
                            <p style={{ color: colors.text, fontSize: 15, margin: 0 }}>
                                {comment.content}
                            </p>
                            <span style={{ color: colors.muted, fontSize: 12, marginTop: 8, display: 'block' }}>
                                {comment.time_created}
                            </span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default PostComments;
