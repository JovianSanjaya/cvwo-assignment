import { motion } from 'framer-motion';
import { Box, Container, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { colors } from '../theme/colors';
import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import Avatar from '../components/Avatar';

interface Topic {
  id: number;
  title: string;
  username: string;
  post_count: number;
  time_created: string;
}

const Landing = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const response = await apiFetch('/topics');
      if (response.ok) {
        const data = await response.json();
        setTopics(data || []);
      }
    };
    fetchTopics();
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#FFFFFF',
      backgroundImage: `
        linear-gradient(rgba(229, 231, 235, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(229, 231, 235, 0.3) 1px, transparent 1px)
      `,
      backgroundSize: '50px 50px',
    }}>
      {/* Hero Section - Centered Vertically */}
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center' 
      }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" sx={{
              fontWeight: 900,
              mb: 2,
              letterSpacing: -2,
              fontSize: { xs: '3rem', md: '5rem' },
            }}>
              <Box component="span" sx={{ color: colors.text }}>Sq</Box>
              <Box component="span" sx={{ color: colors.primary }}>U</Box>
              <Box component="span" sx={{ color: colors.text }}>are</Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                mb: 4,
                color: colors.muted,
                maxWidth: 700,
                mx: 'auto',
              }}
            >
              Your go-to platform for connecting with the like-minded communities.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  bgcolor: colors.primary,
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: colors.secondary,
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                GET STARTED
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: colors.primary,
                  color: colors.primary,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: colors.primary,
                    bgcolor: 'rgba(30, 58, 95, 0.05)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                SIGN IN
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: colors.text }}>
          Explore Discussions
        </Typography>
        
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card
              onClick={() => navigate(`/topics/${topic.id}/posts`)}
              sx={{
                mb: 2,
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ p: '24px !important' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar username={topic.username} size={40} />
                  <Box sx={{ flex: 1 }}>
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
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: colors.text, fontWeight: 600 }}>
                        {topic.username}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.muted }}>
                        •
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.muted }}>
                        posts
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Container>
    </Box>
  );
};

export default Landing;