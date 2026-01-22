import { Link } from 'react-router-dom';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <div style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
        }}>
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                gap: 120,
                padding: '14px 32px',
                backgroundColor: '#FFFFFF',
                borderRadius: 50,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <span style={{ fontSize: 18, fontWeight: 700 }}>
                        <span style={{ color: colors.text }}>Sq</span>
                        <span style={{ color: colors.primary }}>U</span>
                        <span style={{ color: colors.text }}>are</span>
                    </span>
                </Link>

                {isLoggedIn ? (
                    <button
                        onClick={logout}
                        style={{
                            padding: '10px 24px',
                            borderRadius: 50,
                            background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1c2e 100%)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 14,
                        }}
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        style={{
                            padding: '10px 24px',
                            borderRadius: 50,
                            background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1c2e 100%)',
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: 14,
                        }}
                    >
                        Login
                    </Link>
                )}
            </nav>
        </div>
    );
}

export default Navbar;
