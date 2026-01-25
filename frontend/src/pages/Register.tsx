import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert,
    Link as MUILink,
    InputAdornment,
    IconButton,
    Stack
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { apiFetch } from "../services/api";
import { colors } from "../theme/colors";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const response = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            navigate("/login");
        } else {
            setError("Username already taken");
        }
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            bgcolor: '#FFFFFF',
            backgroundImage: `
                linear-gradient(rgba(229, 231, 235, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(229, 231, 235, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
        }}>
            <Paper elevation={0} sx={{
                width: '100%',
                maxWidth: 400,
                padding: { xs: 3, sm: 5 },
                borderRadius: '32px',
                backgroundColor: '#FFFFFF',
                border: `1px solid ${colors.border}`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            }}>
                {/* Logo */}
                <Typography variant="h3" sx={{
                    fontWeight: 900,
                    mb: 1,
                    letterSpacing: -1.5,
                    textAlign: 'center',
                }}>
                    <Box component="span" sx={{ color: colors.text }}>Sq</Box>
                    <Box component="span" sx={{ color: colors.primary }}>U</Box>
                    <Box component="span" sx={{ color: colors.text }}>are</Box>
                </Typography>

                <Typography variant="h5" sx={{
                    color: colors.text,
                    fontWeight: 800,
                    mb: 4,
                    textAlign: 'center',
                    opacity: 0.9
                }}>
                    Create Account
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                padding: '12px',
                                borderRadius: '12px',
                                backgroundColor: colors.primary,
                                fontSize: '1rem',
                                fontWeight: 700,
                                textTransform: 'none',
                                mt: 2,
                                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                '&:hover': {
                                    backgroundColor: '#2563EB',
                                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                                },
                                '&:active': {
                                    backgroundColor: '#60A5FA',
                                }
                            }}
                        >
                            Sign Up
                        </Button>
                    </Stack>
                </Box>

                <Typography sx={{ textAlign: 'center', mt: 4, color: colors.muted, fontSize: '0.9rem' }}>
                    Already on SqUare?{' '}
                    <MUILink component={RouterLink} to="/login" sx={{ color: colors.primary, fontWeight: 700, textDecoration: 'none' }}>
                        Log in
                    </MUILink>
                </Typography>
            </Paper>
        </Box>
    );
}

export default Register;
