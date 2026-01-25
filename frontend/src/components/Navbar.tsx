import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Link as MUILink } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { isLoggedIn, logout } = useAuth();

    return (
        <Box sx={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1100,
            width: 'auto',
        }}>
            <Box component="nav" sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 4, md: 10 },
                padding: '10px 10px 10px 24px',
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: '50px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
                <MUILink component={RouterLink} to={isLoggedIn ? "/home" : "/"} sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>
                        <Box component="span" sx={{ color: colors.text }}>Sq</Box>
                        <Box component="span" sx={{ color: colors.primary }}>U</Box>
                        <Box component="span" sx={{ color: colors.text }}>are</Box>
                    </Typography>
                </MUILink>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {isLoggedIn ? (
                        <Button
                            onClick={logout}
                            variant="contained"
                            startIcon={<LogoutIcon fontSize="small" />}
                            sx={{
                                borderRadius: '50px',
                                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1c2e 100%)',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3,
                                py: 1,
                                '&:hover': {
                                    boxShadow: '0 4px 15px rgba(15, 28, 46, 0.4)',
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="contained"
                            startIcon={<LoginIcon fontSize="small" />}
                            sx={{
                                borderRadius: '50px',
                                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1c2e 100%)',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3,
                                py: 1,
                                '&:hover': {
                                    boxShadow: '0 4px 15px rgba(15, 28, 46, 0.4)',
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default Navbar;
