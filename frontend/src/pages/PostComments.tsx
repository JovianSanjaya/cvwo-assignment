import { useEffect, useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Box,
    Stack,
    Breadcrumbs,
    Link as MUILink,
    Chip,
    Divider,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
    
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../theme/colors';
import { apiFetch } from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { formatTimeAgo } from '../utils/timeAgo';
import Avatar from '../components/Avatar';
import VoteSection from '../components/VoteSection';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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

interface Comment {
    id: number;
    content: string;
    user_id: number;
    username: string;
    time_created: string;
    vote_count: number;
    user_vote: number;
}

function PostComments() {
    const { topicId, postId } = useParams();
    const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [post, setPost] = useState<Post | null>(null);
    const [content, setContent] = useState("");

    // States for editing post
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editPostTitle, setEditPostTitle] = useState("");
    const [editPostContent, setEditPostContent] = useState("");

    // States for editing comments
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editCommentContent, setEditCommentContent] = useState("");

    // Dialog states
    const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false);
    const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

    const [sortBy, setSortBy] = useState("newest");

    const { isLoggedIn, user } = useAuth();

    useEffect(() => {
        apiFetch(`/posts/${postId}`)
            .then(res => res.json())
            .then(data => setPost(data))
            .catch(error => console.error("Error fetching post", error));
    }, [postId]);

    useEffect(() => {
        apiFetch(`/topics/${topicId}/posts/${postId}/comments?sort=${sortBy}`)
            .then(res => res.json())
            .then(data => setComments(data || []))
            .catch(error => console.error("Error fetching comments", error));
    }, [topicId, postId, sortBy]);

    async function handlePostDelete() {
        const response = await apiFetch(`/posts/${postId}`, { method: 'DELETE' });
        if (response.ok) {
            navigate(`/topics/${topicId}/posts`);
        }
    }

    async function handlePostEdit() {
        if (!editPostTitle.trim()) return;
        const response = await apiFetch(`/posts/${postId}`, {
            method: 'PUT',
            body: JSON.stringify({ title: editPostTitle, content: editPostContent }),
        });
        if (response.ok) {
            setPost(prev => prev ? { ...prev, title: editPostTitle, content: editPostContent } : null);
            setIsEditingPost(false);
        }
    }

    async function handleCommentSubmit() {
        if (!content.trim() || !user) return;

        const response = await apiFetch(`/topics/${topicId}/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ content }),
        });

        if (response.ok) {
            const commentsRes = await apiFetch(`/topics/${topicId}/posts/${postId}/comments`);
            const commentsData = await commentsRes.json();
            setComments(commentsData || []);
            setContent("");
        }
    }

    async function handleCommentDelete(commentId: number) {
        const response = await apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
        if (response.ok) {
            setComments(comments.filter(c => c.id !== commentId));
            setDeleteCommentDialogOpen(false);
        }
    }

    async function handleCommentEdit(commentId: number) {
        if (!editCommentContent.trim()) return;
        const response = await apiFetch(`/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify({ content: editCommentContent }),
        });
        if (response.ok) {
            setComments(comments.map(c =>
                c.id === commentId ? { ...c, content: editCommentContent } : c
            ));
            setEditingCommentId(null);
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

            <Container maxWidth="md" sx={{ pt: 12 }}>
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MUILink
                        component={RouterLink}
                        to={`/topics/${topicId}/posts`}
                        underline="hover"
                        color="inherit"
                        sx={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '0.9rem' }}
                    >
                        <ArrowBackIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                        Back to Posts
                    </MUILink>
                </Breadcrumbs>

                {post ? (
                    <Card
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: '24px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            border: 'none',
                        }}
                    >
                        <CardContent sx={{ p: '0 !important' }}>
                            {isEditingPost ? (
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        value={editPostTitle}
                                        onChange={(e) => setEditPostTitle(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={6}
                                        label="Content"
                                        value={editPostContent}
                                        onChange={(e) => setEditPostContent(e.target.value)}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                    />
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Button variant="outlined" onClick={() => setIsEditingPost(false)} sx={{ borderRadius: '10px' }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={handlePostEdit}
                                            sx={{ borderRadius: '10px', bgcolor: colors.success }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Stack>
                                </Stack>
                            ) : (
                                <Box sx={{ display: 'flex', gap: 3 }}>
                                    <Box sx={{ pt: 1 }}>
                                        <VoteSection
                                            type="post"
                                            id={post.id}
                                            initialVoteCount={post.vote_count}
                                            initialUserVote={post.user_vote}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                            <Stack direction="row" spacing={2}>
                                                <Avatar username={post.username} size={44} />
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: colors.text }}>
                                                        {post.username}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: colors.muted }}>
                                                        {formatTimeAgo(post.time_created)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                            {user?.id === post.user_id && (
                                                <Stack direction="row" spacing={0.5}>
                                                    <IconButton size="small" onClick={() => {
                                                        setIsEditingPost(true);
                                                        setEditPostTitle(post.title);
                                                        setEditPostContent(post.content);
                                                    }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => setDeletePostDialogOpen(true)} sx={{ color: colors.error }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            )}
                                        </Box>

                                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: colors.text, lineHeight: 1.2 }}>
                                            {post.title}
                                        </Typography>

                                        <Typography sx={{ color: colors.text, fontSize: '1.1rem', lineHeight: 1.7, mb: 3 }}>
                                            {post.content}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            <Divider sx={{ mb: 3 }} />

                            {isLoggedIn && (
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <Avatar username={user?.username || ""} size={32} />
                                    <Box sx={{ flex: 1 }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            placeholder="What are your thoughts?"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '16px',
                                                    bgcolor: '#f8fafc',
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#000',
                                                        borderWidth: '2px'
                                                    }
                                                }
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                            <Button
                                                variant="contained"
                                                disabled={!content.trim()}
                                                onClick={handleCommentSubmit}
                                                startIcon={<SendIcon />}
                                                sx={{
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    bgcolor: colors.primary
                                                }}
                                            >
                                                Comment
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ p: 8, textAlign: 'center', borderRadius: '24px', mb: 4 }}>
                        <Typography variant="h6" sx={{ color: colors.muted, fontWeight: 500 }}>
                            Loading post...
                        </Typography>
                    </Box>
                )}

                <Box sx={{mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center'}}>

                    <Typography variant="h6" sx={{ fontWeight: 800, px: 1 }}>
                        Comments ({comments.length})
                    </Typography>

                    <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort By"
                                onChange={(e) => setSortBy(e.target.value)}
                                sx={{ borderRadius: '12px', bgcolor: '#fff' }}
                            >
                                <MenuItem value="newest">Newest First</MenuItem>
                                <MenuItem value="oldest">Oldest First</MenuItem>
                                <MenuItem value="top">Top Comments</MenuItem>
                            </Select>
                        </FormControl>

                </Box>

                <Stack spacing={2}>
                    {comments.map(comment => {
                        const isCommentOwner = user?.id === comment.user_id;
                        const isEditingComment = editingCommentId === comment.id;

                        return (
                            <Card
                                key={comment.id}
                                sx={{
                                    borderRadius: '20px',
                                    border: 'none',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        boxShadow: !isEditingComment ? '0 8px 20px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
                                        transform: !isEditingComment ? 'translateY(-4px)' : 'none',
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 2, display: 'flex', gap: 2 }}>
                                    <Box sx={{ pt: 0.5 }}>
                                        <VoteSection
                                            type="comment"
                                            id={comment.id}
                                            initialVoteCount={comment.vote_count}
                                            initialUserVote={comment.user_vote}
                                        />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar username={comment.username} size={28} />
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                                    {comment.username}
                                                </Typography>
                                                {comment.username === post?.username && (
                                                    <Chip label="OP" size="small" sx={{
                                                        height: 18,
                                                        fontSize: '0.65rem',
                                                        fontWeight: 900,
                                                        bgcolor: '#eff6ff',
                                                        color: colors.primary,
                                                        border: `1px solid #dbeafe`
                                                    }} />
                                                )}
                                                <Typography variant="caption" sx={{ color: colors.muted }}>
                                                    • {formatTimeAgo(comment.time_created)}
                                                </Typography>
                                            </Stack>
                                            {isCommentOwner && !isEditingComment && (
                                                <Stack direction="row" spacing={0.5}>
                                                    <IconButton size="small" onClick={() => {
                                                        setEditingCommentId(comment.id);
                                                        setEditCommentContent(comment.content);
                                                    }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => {
                                                        setCommentToDelete(comment.id);
                                                        setDeleteCommentDialogOpen(true);
                                                    }} sx={{ color: colors.error }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            )}
                                        </Box>

                                        {isEditingComment ? (
                                            <Stack spacing={1}>
                                                <TextField
                                                    fullWidth
                                                    multiline
                                                    value={editCommentContent}
                                                    onChange={(e) => setEditCommentContent(e.target.value)}
                                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                                />
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <IconButton onClick={() => setEditingCommentId(null)} color="default">
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleCommentEdit(comment.id)} color="success">
                                                        <SaveIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            </Stack>
                                        ) : (
                                            <Typography sx={{ fontSize: '0.95rem', color: colors.text, lineHeight: 1.6, pl: 0.5 }}>
                                                {comment.content}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        );
                    })}
                    {comments.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
                            <Typography>No comments yet. Be the first to join the conversation!</Typography>
                        </Box>
                    )}
                </Stack>
                <Dialog open={deletePostDialogOpen} onClose={() => setDeletePostDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px' } }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>Delete Post?</DialogTitle>
                    <DialogContent><Typography color="textSecondary">This action cannot be undone.</Typography></DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDeletePostDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePostDelete} variant="contained" sx={{ bgcolor: colors.error }}>Delete</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={deleteCommentDialogOpen} onClose={() => setDeleteCommentDialogOpen(false)} PaperProps={{ sx: { borderRadius: '16px' } }}>
                    <DialogTitle sx={{ fontWeight: 800 }}>Delete Comment?</DialogTitle>
                    <DialogContent><Typography color="textSecondary">Are you sure you want to remove this comment?</Typography></DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setDeleteCommentDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => commentToDelete && handleCommentDelete(commentToDelete)} variant="contained" sx={{ bgcolor: colors.error }}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default PostComments;
