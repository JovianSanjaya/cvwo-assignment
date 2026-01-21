import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import {
  Typography,
  TextField,
  Card,
  CardActionArea,
  Avatar,
  Box,
  InputBase,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TagIcon from '@mui/icons-material/Tag';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

// --- Styled Components ---

const MainContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
  backgroundColor: '#08090A', // Better Stack Deep Dark
  color: '#FFFFFF',
  overflow: 'hidden',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
});

const Sidebar = styled(Box)({
  width: 260,
  backgroundColor: '#0B0C0E',
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid #1F2023',
});

const ContentArea = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  backgroundColor: 'transparent', 
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 8, // Sharp corners
  backgroundColor: '#131416',
  border: '1px solid #2D2E32',
  '&:hover': {
    border: '1px solid #4B4C52',
  },
  marginRight: theme.spacing(2),
  width: '100%',
  transition: 'all 0.2s ease',
  [theme.breakpoints.up('sm')]: {
    width: '420px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#6B7280',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#fff',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '0.95rem',
    fontWeight: 400,
    '&::placeholder': {
      color: '#6B7280',
      opacity: 1,
    },
  },
}));

const TopicCard = styled(Card)({
  backgroundColor: '#131416',
  color: '#fff',
  borderRadius: 8, // Sharp, professional
  border: '1px solid #1F2023',
  marginBottom: '16px',
  overflow: 'visible',
  boxShadow: 'none',
  transition: 'border-color 0.2s ease',
  '&:hover': {
    borderColor: '#4B4C52', 
  },
});

const CreateInput = styled(TextField)({
  backgroundColor: '#131416',
  borderRadius: 8,
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    color: '#fff',
    '& fieldset': {
      borderColor: '#2D2E32',
    },
    '&:hover fieldset': {
      borderColor: '#4B4C52',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#5e43f3', // Better Stack Purple
      borderWidth: '1px',
    },
  },
});

const VoteColumn = styled(Box)({
  width: '48px',
  backgroundColor: 'transparent', 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '12px 0',
  borderTopLeftRadius: 8,
  borderBottomLeftRadius: 8,
  borderRight: '1px solid #1F2023', 
});

const CardContentArea = styled(Box)({
  flexGrow: 1,
  padding: '16px 24px', 
});

const ActionButton = styled(Button)({
  color: 'rgba(255, 255, 255, 0.5)',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  padding: '8px 16px',
  borderRadius: 20,
  minWidth: 'auto',
  gap: '8px',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
});

interface Topic {
  id: number;
  title: string;
  time_created: string;
}






function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch('http://localhost:8080/topics')
      .then(response => response.json())
      .then(data => setTopics(data || []))
      .catch(error => console.error("Error fetching topics", error));
  }, []);

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    const response = await fetch('http://localhost:8080/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert('Failed to create topic: ' + errorText);
      return;
    }

    const data = await response.json(); 
    const newTopic: Topic = {
      id: data.id,
      title: title,
      time_created: "Just Now",
    };
    setTopics([...topics, newTopic]);
    setTitle(""); 
  }







  return (
    <MainContainer>
      {/* Sidebar Navigation */}
      <Sidebar>
        {/* Logo Area */}
        <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', mb: 0 }}>
           <Avatar sx={{ bgcolor: '#fff', width: 44, height: 44, mb: 2, color: '#000', fontWeight: 'bold' }} variant="circular">S</Avatar>
           <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: -0.5, color: '#fff' }}>Square</Typography>
        </Box>
        
        <List component="nav" sx={{ px: 3 }}>
            <ListItem disablePadding sx={{ mb: 1.5 }}>
                <ListItemButton 
                  sx={{ 
                    borderRadius: 2, 
                    py: 1, 
                    px: 2,
                    border: '1px solid transparent',
                    '&:hover': { background: '#1F2023', color: '#fff' }, 
                    '&.Mui-selected': { 
                      background: '#1F2023',  
                      color: '#fff',
                      border: '1px solid #2D2E32',
                      boxShadow: 'none'
                    } 
                  }} 
                  selected
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        <HomeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Home" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 600 }} />
                </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1.5 }}>
                <ListItemButton 
                  sx={{ 
                    py: 1, 
                    px: 2,
                    color: '#A1A1AA',
                    '&:hover': { bgcolor: '#1F2023', color: '#fff' } 
                  }}
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        <ExploreIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Discover" primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} />
                </ListItemButton>
            </ListItem>
        </List>
      </Sidebar>

      {/* Main Content Area */}
      <ContentArea>
        {/* Top Header */}
        <Box sx={{ height: 80, minHeight: 80, display: 'flex', alignItems: 'center', px: 5, zIndex: 10 }}>
            
            <Search>
                <SearchIconWrapper>
                  <SearchIcon fontSize="small" />
                </SearchIconWrapper>
                <StyledInputBase 
                  placeholder="Search Topics & Conversations" 
                  inputProps={{ 'aria-label': 'search' }} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Search>
            
            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
               <IconButton sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}><AddIcon /></IconButton>
               <IconButton sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}><TagIcon /></IconButton>
               <Avatar sx={{ width: 40, height: 40, background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', ml: 1, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>J</Avatar>
            </Box>
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ p: 5, flexGrow: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
            
            {/* Center Column */}
            <Box sx={{ width: '100%', maxWidth: 780 }}>
                
                {/* Create Topic Input */}
                <Box sx={{ 
                    mb: 4, 
                    p: 2, 
                    bgcolor: '#131416', 
                    borderRadius: 3, 
                    border: '1px solid #1F2023', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    boxShadow: 'none'
                  }}>
                    <Avatar sx={{ background: 'linear-gradient(45deg, #1cb5e0 0%, #000851 100%)', width: 44, height: 44 }}>J</Avatar>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <CreateInput 
                            fullWidth 
                            placeholder="Start a new discussion..." 
                            size="small"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </form>
                    <IconButton sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}><ShareIcon /></IconButton>
                </Box>

                {/* Topics Feed */}
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 4, letterSpacing: -0.5 }}>
                    Trending Now
                </Typography>
                
                <Grid container>
                    {topics.map(topic => (
                    <Grid size={{ xs: 12 }} key={topic.id} sx={{ mb: 1 }}>
                        <TopicCard sx={{ display: 'flex', flexDirection: 'row' }}>
                            {/* Vote Column */}
                            <VoteColumn>
                                <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)', p: 0.5, '&:hover': { color: '#FF453A', bgcolor: 'rgba(255, 69, 58, 0.1)' } }}><ArrowUpwardIcon fontSize="small" /></IconButton>
                                <Typography variant="caption" sx={{ fontWeight: 700, my: 1, color: '#fff', fontSize: '0.8rem' }}>0</Typography>
                                <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.5)', p: 0.5, '&:hover': { color: '#0A84FF', bgcolor: 'rgba(10, 132, 255, 0.1)' } }}><ArrowDownwardIcon fontSize="small" /></IconButton>
                            </VoteColumn>

                            {/* Content */}
                            <Box sx={{ flexGrow: 1 }}>
                                <CardActionArea component={Link} to={`/topics/${topic.id}/posts`} sx={{ display: 'block' }}>
                                    <CardContentArea>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(255,255,255,0.1)', mr: 1.5, color: '#fff' }}>
                                              <TagIcon sx={{ fontSize: 16 }} />
                                            </Avatar>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.9)', mr: 1 }}>
                                                t/{topic.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                                • {topic.time_created}
                                            </Typography>
                                        </Box>
                                        
                                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.3, mb: 1, fontSize: '1.4rem', letterSpacing: -0.5 }}>
                                            <HighlightedText text={topic.title} highlight={searchQuery} />
                                        </Typography>

                                    </CardContentArea>
                                </CardActionArea>

                                {/* Footer Actions */}
                                <Box sx={{ display: 'flex', gap: 1, px: 3, pb: 2.5, pt: 0 }}>
                                    <ActionButton startIcon={<ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />}>
                                        24 Comments
                                    </ActionButton>
                                    <ActionButton startIcon={<ShareIcon sx={{ fontSize: 18 }} />}>
                                        Share
                                    </ActionButton>
                                    <ActionButton startIcon={<BookmarkBorderIcon sx={{ fontSize: 18 }} />}>
                                        Save
                                    </ActionButton>
                                </Box>
                            </Box>
                        </TopicCard>
                    </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
      </ContentArea>
    </MainContainer>
  )
}


// Helper component for highlighting text
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} style={{ 
            color: '#fff', 
            backgroundColor: '#5e43f3', // Better Stack Purple Highlight
            padding: '2px 6px', 
            borderRadius: '4px',
            fontWeight: 700,
            boxShadow: '0 0 10px rgba(94, 67, 243, 0.4)'
          }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default Home;