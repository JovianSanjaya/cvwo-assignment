import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../theme/colors';
import { apiFetch } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from '../utils/timeAgo';

interface Topic {
    id: number;
    title: string;
    user_id: number;
    time_created: string;
}

function Home() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { isLoggedIn, user } = useAuth();
    const currentUserID = user?.id;

    useEffect(() => {
        fetch('http://localhost:8080/topics')
            .then(response => response.json())
            .then(data => setTopics(data || []))
            .catch(error => console.error("Error fetching topics", error));
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        const response = await apiFetch('/topics', {
            method: 'POST',
            body: JSON.stringify({ title }),
        });

        if (response.ok) {
            const data = await response.json();
            const newTopic: Topic = {
                id: data.id,
                title: title,
                user_id: currentUserID || 0,
                time_created: "Just Now",
            };
            setTopics([...topics, newTopic]);
            setTitle("");
        }
    }

    async function handleDelete(topicID: number) {
        if (!confirm("Are you sure you want to delete this topic?")) return;

        await apiFetch(`/topics/${topicID}`, {
            method: 'DELETE',
        });

        setTopics(topics.filter(topic => topic.id !== topicID));
    }

    async function handleEdit(topicId: number) {
        if (!editTitle.trim()) return;

        const response = await apiFetch(`/topics/${topicId}`, {
            method: 'PUT',
            body: JSON.stringify({ title: editTitle }),
        });

        if (response.ok) {
            setTopics(topics.map(t =>
                t.id === topicId ? { ...t, title: editTitle } : t
            ));
            setEditingId(null);
            setEditTitle("");
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
                <h2 style={{ color: colors.text, fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
                    Forum Topics
                </h2>

                <div style={{ marginBottom: 24 }}>
                    <input
                        type="text"
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: 12,
                            border: `1px solid ${colors.border}`,
                            fontSize: 16,
                            backgroundColor: '#fff',
                            boxSizing: 'border-box',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        }}
                    />
                </div>

                {isLoggedIn && (
                    <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <input
                                type="text"
                                placeholder="Start a new discussion..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    borderRadius: 8,
                                    border: `1px solid ${colors.border}`,
                                    fontSize: 16,
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
                                Create
                            </button>
                        </div>
                    </form>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {topics
                        .filter(topic => topic.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(topic => (
                            <div
                                key={topic.id}
                                style={{
                                    padding: 20,
                                    borderRadius: 12,
                                    backgroundColor: '#FFFFFF',
                                    border: `1px solid ${colors.border}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                {editingId === topic.id ? (
                                    <div style={{ flex: 1, display: 'flex', gap: 8, marginRight: 16 }}>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: 8,
                                                borderRadius: 4,
                                                border: `1px solid ${colors.border}`,
                                            }}
                                        />
                                        <button
                                            onClick={() => handleEdit(topic.id)}
                                            style={{
                                                padding: '4px 12px',
                                                borderRadius: 4,
                                                backgroundColor: colors.success,
                                                color: '#fff',
                                                border: 'none',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        to={`/topics/${topic.id}/posts`}
                                        style={{
                                            textDecoration: 'none',
                                            flex: 1,
                                        }}
                                    >
                                        <h3 style={{ color: colors.text, fontSize: 18, fontWeight: 600, margin: 0 }}>
                                            {topic.title}
                                        </h3>
                                        <p style={{ color: colors.muted, fontSize: 14, margin: '8px 0 0 0' }}>
                                            {formatTimeAgo(topic.time_created)}
                                        </p>
                                    </Link>
                                )}

                                {currentUserID === topic.user_id && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => {
                                                setEditingId(topic.id);
                                                setEditTitle(topic.title);
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: 8,
                                                backgroundColor: colors.muted,
                                                color: '#fff',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(topic.id)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: 8,
                                                backgroundColor: colors.error,
                                                color: '#fff',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </main>
        </div>
    );
}

export default Home;
