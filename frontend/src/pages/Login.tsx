import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import { colors } from "../theme/colors";
import { useAuth } from "../context/AuthContext";

function Login() {
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const response = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            login(data.token);
            navigate("/");
        } else {
            setError("Invalid username or password");
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.background,
        }}>
            <div style={{
                width: 400,
                padding: 40,
                borderRadius: 25,
                backgroundColor: '#FFFFFF',
                border: `1px solid ${colors.border}`,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            }}>
                {/* Logo */}
                <h1 style={{
                    fontSize: 40,
                    fontWeight: 800,
                    marginBottom: 16,
                    letterSpacing: -1,
                    textAlign: 'center',
                }}>
                    <span style={{ color: colors.text }}>Sq</span>
                    <span style={{ color: colors.primary }}>U</span>
                    <span style={{ color: colors.text }}>are</span>
                </h1>

                <h2 style={{
                    color: colors.text,
                    fontSize: 28,
                    fontWeight: 700,
                    marginBottom: 32,
                    textAlign: 'center',
                }}>
                    Welcome back
                </h2>

                {error && <p style={{ color: colors.error, marginBottom: 16 }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '100%',
                            padding: 12,
                            marginBottom: 16,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            fontSize: 16,
                            boxSizing: 'border-box',
                        }}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: 12,
                            marginBottom: 24,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            fontSize: 16,
                            boxSizing: 'border-box',
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: 12,
                            borderRadius: 8,
                            backgroundColor: colors.primary,
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            boxSizing: 'border-box',
                        }}
                    >
                        Login
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: 24, color: colors.muted }}>
                    Don't have an account? <Link to="/register" style={{ color: colors.primary }}>Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
