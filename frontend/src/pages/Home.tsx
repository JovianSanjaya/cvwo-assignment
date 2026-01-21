import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { colors } from '../theme/colors';
import { apiFetch, getToken, removeToken } from '../services/api';

interface Topic {
    id: number;
    title: string;
    time_created: string;
}

function Home() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [title, setTitle] = useState("");
    const isLoggedIn = !!getToken();

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
                time_created: "Just Now",
            };
            setTopics([...topics, newTopic]);
            setTitle("");
        }
    }

    function handleLogout() {
        removeToken();
        window.location.reload();
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
                justifyContent: 'space-between',
                padding: '16px 40px',
                borderBottom: `1px solid ${colors.border}`,
                backgroundColor: '#FFFFFF',
            }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                    <span style={{ color: colors.text }}>Sq</span>
                    <span style={{ color: colors.primary }}>U</span>
                    <span style={{ color: colors.text }}>are</span>
                </h1>

                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 20px',
                            borderRadius: 8,
                            backgroundColor: colors.cardBg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        style={{
                            padding: '8px 20px',
                            borderRadius: 8,
                            backgroundColor: colors.primary,
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}
                    >
                        Login
                    </Link>
                )}
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: 800, margin: '0 auto', padding: 40 }}>
                <h2 style={{ color: colors.text, fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
                    Forum Topics
                </h2>

                {/* Create Topic Form */}
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

                {/* Topics List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {topics.map(topic => (
                        <Link
                            key={topic.id}
                            to={`/topics/${topic.id}/posts`}
                            style={{
                                padding: 20,
                                borderRadius: 12,
                                backgroundColor: '#FFFFFF',
                                border: `1px solid ${colors.border}`,
                                textDecoration: 'none',
                                transition: 'box-shadow 0.2s',
                            }}
                        >
                            <h3 style={{ color: colors.text, fontSize: 18, fontWeight: 600, margin: 0 }}>
                                {topic.title}
                            </h3>
                            <p style={{ color: colors.muted, fontSize: 14, margin: '8px 0 0 0' }}>
                                {topic.time_created}
                            </p>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Home;
