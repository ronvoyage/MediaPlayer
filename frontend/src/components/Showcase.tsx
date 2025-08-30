import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  PlayArrow, 
  Settings, 
  Analytics, 
  Code, 
  Palette,
  MusicNote,
  VideoLibrary,
  CloudUpload,
  DragIndicator,
  PlaylistPlay,
  Fullscreen,
  VolumeUp
} from '@mui/icons-material';

export const Showcase: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Media Playback',
      description: 'Advanced audio and video playback with custom controls',
      icon: <PlayArrow color="primary" />,
      details: ['Custom player controls', 'Volume and seek controls', 'Playback rate adjustment', 'Fullscreen support']
    },
    {
      title: 'Drag & Drop',
      description: 'Intuitive file upload with drag and drop interface',
      icon: <DragIndicator color="primary" />,
      details: ['Multiple file support', 'File validation', 'Progress indicators', 'Error handling']
    },
    {
      title: 'Playlist Management',
      description: 'Comprehensive playlist features for media organization',
      icon: <PlaylistPlay color="primary" />,
      details: ['Reorder items', 'Add/remove tracks', 'Export/import playlists', 'Current track highlighting']
    },
    {
      title: 'File Support',
      description: 'Wide range of audio and video format support',
      icon: <VideoLibrary color="primary" />,
      details: ['MP3, WAV, FLAC', 'MP4, AVI, MKV', 'Metadata extraction', 'File size validation']
    },
    {
      title: 'Responsive Design',
      description: 'Modern, responsive UI that works on all devices',
      icon: <Palette color="primary" />,
      details: ['Material-UI components', 'Mobile-friendly layout', 'Dark/light themes', 'Smooth animations']
    },
    {
      title: 'Analytics & Logging',
      description: 'Comprehensive logging and user action tracking',
      icon: <Analytics color="primary" />,
      details: ['User action logging', 'Error tracking', 'Performance metrics', 'Session management']
    }
  ];

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        p: 3,
        minHeight: '100vh'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          MediaPlayer Showcase
        </Typography>

        <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 6 }}>
          Experience the power of modern media playback technology
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      transition: 'all 0.3s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {feature.icon}
                      <Typography variant="h6" component="h3" sx={{ ml: 1 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {feature.description}
                    </Typography>

                    <Stack spacing={1}>
                      {feature.details.map((detail, detailIndex) => (
                        <Typography key={detailIndex} variant="body2" color="text.secondary">
                          • {detail}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => navigate('/')}
                      startIcon={<PlayArrow />}
                    >
                      Try It Now
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Paper sx={{ p: 4, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="h5" gutterBottom>
              Ready to Experience MediaPlayer?
            </Typography>
            <Typography variant="body1" paragraph>
              Jump into the full application and start enjoying your media files with our advanced player.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/')}
              sx={{ 
                backgroundColor: 'white', 
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              Launch MediaPlayer
            </Button>
          </Paper>
        </Box>
      </motion.div>
    </Box>
  );
};
