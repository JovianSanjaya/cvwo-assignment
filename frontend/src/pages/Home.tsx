import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Box,
    IconButton,
    Stack,
    InputAdornment,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { colors } from '../theme/colors';
import { apiFetch } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from '../utils/timeAgo';
import Avatar from '../components/Avatar';

interface Topic {
    id: number;
    title: string;
    user_id: number;
    username: string;
    time_created: string;
}

function Home() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [title, setTitle] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const { isLoggedIn, user } = useAuth();
    const currentUserID = user?.id;

    // Dialog states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [topicToDelete, setTopicToDelete] = useState<number | null>(null);

    useEffect(() => {
        apiFetch('/topics')
            .then(res => res.json())
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
                username: user?.username || "Guest",
                time_created: "Just Now",
            };
            setTopics([...topics, newTopic]);
            setTitle("");
        }
    }

    async function handleDelete(topicID: number) {
        await apiFetch(`/topics/${topicID}`, {
            method: 'DELETE',
        });

        setTopics(topics.filter(topic => topic.id !== topicID));
        setDeleteDialogOpen(false);
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            pb: 6, 
            bgcolor: '#FFFFFF',
            backgroundImage: `
                linear-gradient(rgba(229, 231, 235, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(229, 231, 235, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
        }}>
            <Navbar />

            <Box
                sx={{
                    pt: 18,
                    pb: 6,
                    mb: 4,
                }}
            >
                <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                        <Typography variant="h2" sx={{ fontWeight: 900, color: colors.text, letterSpacing: '-0.02em', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                            Welcome to{' '}
                            <Box component="span" sx={{ color: colors.text }}>Sq</Box>
                            <Box component="span" sx={{ color: colors.primary }}>U</Box>
                            <Box component="span" sx={{ color: colors.text }}>are</Box>
                        </Typography>
                        <Typography variant="h6" sx={{ color: colors.muted, maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
                            Great to see you back, {user?.username}! Ready to join the conversation?
                        </Typography>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="md">
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>Delete Topic?</DialogTitle>
                    <DialogContent>
                        <Typography color="text.secondary">
                            This will permanently remove this topic and all discussions within it.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: colors.text }}>Cancel</Button>
                        <Button
                            onClick={() => topicToDelete && handleDelete(topicToDelete)}
                            variant="contained"
                            sx={{ borderRadius: '10px', bgcolor: colors.error }}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: colors.text }}>
                    Explore Discussions
                </Typography>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        mb: 4,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '16px',
                            bgcolor: '#fff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: 'none',
                            '&.Mui-focused': {
                                boxShadow: '0 0 0 2px #000',
                            }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                        }
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {isLoggedIn && (
                    <Paper
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            p: 2,
                            mb: 5,
                            borderRadius: '16px',
                            display: 'flex',
                            gap: 2,
                            boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                            border: '1px solid transparent',
                            transition: 'all 0.2s',
                            '&:focus-within': {
                                border: '2px solid #000',
                                boxShadow: 'none',
                            }
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Start a new discussion..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            InputProps={{ disableUnderline: true }}
                            sx={{ px: 1 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!title.trim()}
                            startIcon={<AddIcon />}
                            sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 3,
                                bgcolor: colors.primary
                            }}
                        >
                            Create
                        </Button>
                    </Paper>
                )}

                <Stack spacing={2}>
                    {topics
                        .filter(topic => topic.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(topic => (
                            <Card
                                key={topic.id}
                                component={RouterLink}
                                to={`/topics/${topic.id}/posts`}
                                sx={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                                        transform: 'translateY(-4px)',
                                    }
                                }}
                            >
                                <CardContent sx={{ p: '24px !important' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1, display: 'flex', gap: 2 }}>
                                            <Avatar username={topic.username || "Guest"} size={40} />
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: '1.15rem',
                                                        fontWeight: 700,
                                                        color: colors.text,
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {topic.title}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="caption" sx={{ color: colors.text, fontWeight: 600 }}>
                                                        {topic.username || "Member"}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: colors.muted }}>
                                                        •
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: colors.muted }}>
                                                        {formatTimeAgo(topic.time_created)}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Box>

                                        {currentUserID === topic.user_id && (
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setTopicToDelete(topic.id);
                                                    setDeleteDialogOpen(true);
                                                }}
                                                sx={{ color: colors.muted, '&:hover': { color: colors.error, bgcolor: '#fef2f2' } }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                </Stack>
            </Container>
        </Box>
    );
}

export default Home;
