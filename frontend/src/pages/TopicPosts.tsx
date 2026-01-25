import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Box,
    Stack,
    Paper,
    Breadcrumbs,
    Link as MUILink,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { colors } from '../theme/colors';
import { apiFetch } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from '../utils/timeAgo';
import Avatar from '../components/Avatar';
import VoteSection from '../components/VoteSection';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


interface Post {
    id: number;
    title: string;
    content: string;
    user_id: number;
    username: string;
    time_created: string;
    vote_count: number;
    user_vote: number;
}

function TopicPosts() {
    const { id } = useParams();
    const [posts, setPosts] = useState<Post[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const { isLoggedIn, user } = useAuth(); const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [sortBy, setSortBy] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");

    
    useEffect(() => {
        fetchPosts()
    }, [id, sortBy, searchQuery])

    function fetchPosts(){
        let url =  `/topics/${id}/posts?`;

        if(sortBy !== "newest"){
            url += `sort=${sortBy}&`;
        }

        if(searchQuery){
            url += `search=${searchQuery}&`;
        }

        apiFetch(url)
            .then(res => res.json())
            .then(data => setPosts(data || []))
            .catch(error => console.error("Error fetching posts", error))
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        const response = await apiFetch(`/topics/${id}/posts`, {
            method: 'POST',
            body: JSON.stringify({ title, content }),
        });

        if (response.ok) {
            setTitle("");
            setContent("");
            fetchPosts();
        }
    }

    async function handleDelete(postId: number) {
        await apiFetch(`/posts/${postId}`, {
            method: 'DELETE',
        });

        setDeleteDialogOpen(false);
        fetchPosts(); 
    }

    async function handleEdit(postId: number) {
        if (!editTitle.trim()) return;

        const response = await apiFetch(`/posts/${postId}`, {
            method: 'PUT',
            body: JSON.stringify({ title: editTitle, content: editContent }),
        });

        if (response.ok) {
            setEditDialogOpen(false);
            setEditingId(null);
            fetchPosts();
        }
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

            <Container maxWidth="md" sx={{ pt: 12 }} >

                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>Delete Discussion?</DialogTitle>
                    <DialogContent>
                        <Typography color="text.secondary">
                            This action cannot be undone. All comments within this post will also be permanently removed.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: '10px', color: colors.text }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (postToDelete) handleDelete(postToDelete);
                                setDeleteDialogOpen(false);
                            }}
                            variant="contained"
                            sx={{ borderRadius: '10px', bgcolor: colors.error }}
                        >
                            Delete Permanently
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: '20px' } }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>Edit Post</DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                label="Headline"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Content"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setEditDialogOpen(false)} color="inherit">Cancel</Button>
                        <Button
                            onClick={() => handleEdit(editingId!)}
                            variant="contained"
                            sx={{ bgcolor: colors.success, borderRadius: '10px' }}
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>


                <Breadcrumbs sx={{ mb: 3 }}>
                    <MUILink
                        component={RouterLink}
                        to="/home"
                        underline="hover"
                        color="inherit"
                        sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '0.9rem' }}
                    >
                        <ArrowBackIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Back to Topics
                    </MUILink>
                </Breadcrumbs>

                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: colors.text }}>
                    Topic Discussions
                </Typography>

                {isLoggedIn && (
                    <Paper
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            p: 3,
                            mb: 5,
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            border: '1px solid transparent',
                            transition: 'all 0.2s',
                            '&:focus-within': {
                                border: '2px solid #000',
                                boxShadow: 'none',
                            }
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Create a New Post</Typography>
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                placeholder=" What's on your mind?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { 
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#000',
                                            borderWidth: '2px'
                                        }
                                    } 
                                }}
                            />
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Add more details..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { 
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#000',
                                            borderWidth: '2px'
                                        }
                                    } 
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!title.trim()}
                                    startIcon={<AddIcon />}
                                    sx={{
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        px: 4,
                                        bgcolor: colors.primary,
                                        '&:hover': { bgcolor: '#2563EB' }
                                    }}
                                >
                                    Publish Post
                                </Button>
                            </Box>
                        </Stack>
                    </Paper>
                )}

                <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ 
                            flex: 1,
                            minWidth: '250px',
                            '& .MuiOutlinedInput-root': { 
                                borderRadius: '12px',
                                bgcolor: '#fff',
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#000',
                                    borderWidth: '2px'
                                }
                            } 
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: colors.muted }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={sortBy}
                            label="Sort By"
                            onChange={(e) => setSortBy(e.target.value)}
                            sx={{ borderRadius: '12px', bgcolor: '#fff' }}
                        >
                            <MenuItem value="newest">Newest First</MenuItem>
                            <MenuItem value="top">Most Upvoted</MenuItem>
                            <MenuItem value="comments">Most Comments</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Stack spacing={2.5}>
                    {posts.map(post => {
                        const isOwner = user?.id === post.user_id;
                        const isEditing = editingId === post.id;

                        return (
                            <Card
                                key={post.id}
                                component={RouterLink}
                                to={`/topics/${id}/posts/${post.id}/comments`}
                                sx={{
                                    borderRadius: '20px',
                                    border: 'none',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        boxShadow: !isEditing ? '0 8px 20px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
                                        transform: !isEditing ? 'translateY(-4px)' : 'none',
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 3, display: 'flex', gap: 3 }}>
                                    <Box sx={{ pt: 1 }}>
                                        <VoteSection
                                            type="post"
                                            id={post.id}
                                            initialVoteCount={post.vote_count}
                                            initialUserVote={post.user_vote}
                                        />
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                                <Avatar username={post.username || "User"} size={36} />
                                                <Box>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.text }}>
                                                        {post.username || "Member"}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: colors.muted }}>
                                                        {formatTimeAgo(post.time_created)}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            {isOwner && (
                                                <Stack direction="row" spacing={0.5}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setEditingId(post.id);
                                                            setEditTitle(post.title);
                                                            setEditContent(post.content);
                                                            setEditDialogOpen(true);
                                                        }}
                                                        sx={{ color: colors.muted, '&:hover': { color: colors.primary, bgcolor: '#eff6ff' } }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setPostToDelete(post.id);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                        sx={{ color: colors.muted, '&:hover': { color: colors.error, bgcolor: '#fef2f2' } }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            )}
                                        </Box>

                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 800,
                                                color: colors.text,
                                                mb: 1,
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {post.title}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: colors.muted,
                                                fontSize: '0.95rem',
                                                lineHeight: 1.6,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {post.content}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Stack>
            </Container>
        </Box>
    );
}

export default TopicPosts;
