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
              Your go-to platform for community-driven discussions, knowledge sharing, and meaningful connections.
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
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: colors.text }}>
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
                bgcolor: colors.cardBg,
                border: 'none',
                borderRadius: 2,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ py: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar username={topic.username} size={48} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
                      {topic.title}
                    </Typography>
                    <Typography variant="body2" color={colors.muted}>
                      {topic.username} · {topic.post_count} posts
                    </Typography>
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