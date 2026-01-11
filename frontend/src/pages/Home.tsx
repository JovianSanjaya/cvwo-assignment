import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Box,
  AppBar,
  Toolbar,
  InputBase,
  Grid,
  Paper
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20, 
  backgroundColor: alpha('#f6f7f8', 1),
  '&:hover': {
    backgroundColor: alpha('#e3edfc', 1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid #e0e0e0',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#878a8c'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

interface Topic {
  id: number;
  title: string;
  time_created: string;
}

function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [title, setTitle] = useState("");

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
    <Box sx={{ backgroundColor: '#dae0e6', minHeight: '100vh' }}>
      
      {/* Header and navbar */}
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar sx={{ minHeight: '48px !important' }}>
          {/* Logo */}
          <Avatar sx={{ bgcolor: '#FF4500', mr: 1, width: 32, height: 32 }}>S</Avatar>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 'bold' }}>
            square
          </Typography>

          {/* Search bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Find anything" inputProps={{ 'aria-label': 'search' }} />
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          
        </Toolbar>
      </AppBar>

      {/* Card grid */}
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          
          <Grid size={{ xs: 12, md: 8 }}>
            
            {/* Create new topic */}
            <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 1, border: '1px solid #e0e0e0' }} elevation={0}>
              <Avatar sx={{ bgcolor: '#bdbdbd' }}>U</Avatar>
              <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField 
                  fullWidth 
                  placeholder="Create Topic" 
                  size="small"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ 
                    bgcolor: '#f6f7f8', 
                    '& .MuiOutlinedInput-root': { borderRadius: 1, '& fieldset': { borderColor: 'transparent' } },
                    '&:hover .MuiOutlinedInput-root fieldset': { borderColor: '#0079D3' }
                  }}
                />
              </form>
              <Button sx={{ minWidth: 'auto', p: 1 }}><ArticleIcon color="action" /></Button>
            </Paper>

            {/* List of topics */}
            {topics.map(topic => (
              <Card key={topic.id} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1 }} elevation={0}>
                <CardActionArea component={Link} to={`/topics/${topic.id}/posts`}>
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                       <Avatar sx={{ width: 20, height: 20, bgcolor: '#FF4500', fontSize: 10 }}>r/</Avatar>
                       <Typography variant="body2" fontWeight="bold" sx={{ color: '#1c1c1c' }}>
                          r/{topic.title}
                       </Typography>
                       <Typography variant="caption" color="text.secondary">
                          • Posted {topic.time_created}
                       </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight="500" sx={{ mb: 1 }}>
                      {topic.title} 
                    </Typography>
                  </CardContent>
                  
                  {/* Footer / Actions */}
                  <Box sx={{ bgcolor: '#f8f9fa', px: 2, py: 1, display: 'flex', gap: 1 }}>
                     <Button size="small" sx={{ color: '#878a8c', fontWeight: 'bold', textTransform: 'none' }}>
                        Comments
                     </Button>

                  </Box>
                </CardActionArea>
              </Card>
            ))}
          </Grid>

          
        </Grid>
      </Container>
    </Box>
  )
}

export default Home;