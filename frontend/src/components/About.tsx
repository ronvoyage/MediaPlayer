import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Grid,
  Link,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Container,
  useTheme,
  alpha,
  Paper,
  Button,
  Tooltip
} from '@mui/material';
import {
  Info as InfoIcon,
  Code as CodeIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Web as WebIcon,
  Favorite as FavoriteIcon,
  ArrowBack,
  Sparkles
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Enhanced glassmorphism components
const GlassCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 30, 30, 0.8)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '20px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px rgba(0, 0, 0, 0.5)'
      : '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const FeatureChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
  border: `1px solid ${theme.palette.primary.main}30`,
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}30 0%, ${theme.palette.secondary.main}30 100%)`,
    boxShadow: `0 4px 15px ${theme.palette.primary.main}30`,
  },
}));

const TechAvatar = styled(Avatar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
  },
}));

export const About: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const appInfo = {
    name: 'MediaPlayer Pro',
    version: '1.0.0',
    buildDate: '2025-01-29',
    description: 'Professional-grade media playback application with advanced features and modern design.',
    author: 'MediaPlayer Team',
    website: 'https://mediaplayer-pro.com',
    repository: 'https://github.com/mediaplayer-pro/app',
    email: 'support@mediaplayer-pro.com'
  };

  const features = [
    'Advanced audio and video playback',
    'Drag and drop file support',
    'Playlist management',
    'Crossfade and audio effects',
    'Hardware acceleration',
    'Multiple format support',
    'Responsive design',
    'Accessibility features',
    'Theme customization',
    'Multi-language support'
  ];

  const supportedFormats = [
    { type: 'Audio', formats: ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A'] },
    { type: 'Video', formats: ['MP4', 'AVI', 'MKV', 'MOV', 'WMV', 'WebM'] }
  ];

  const technologies = [
    { name: 'React', version: '18.x', description: 'Frontend framework' },
    { name: 'TypeScript', version: '5.x', description: 'Type-safe JavaScript' },
    { name: 'Material-UI', version: '5.x', description: 'UI component library' },
    { name: 'Framer Motion', version: '10.x', description: 'Animation library' },
    { name: 'Vite', version: '5.x', description: 'Build tool' },
    { name: 'Node.js', version: '18.x', description: 'Runtime environment' }
  ];

  const contributors = [
    { name: 'Development Team', role: 'Core Development', avatar: '👨‍💻' },
    { name: 'Design Team', role: 'UI/UX Design', avatar: '🎨' },
    { name: 'QA Team', role: 'Testing & Quality', avatar: '🔍' },
    { name: 'Open Source Contributors', role: 'Community Support', avatar: '🤝' }
  ];

  const licenses = [
    {
      name: 'MIT License',
      description: 'Main application license - permissive and business-friendly',
      url: 'https://opensource.org/licenses/MIT'
    },
    {
      name: 'Apache 2.0',
      description: 'Some dependencies use Apache license',
      url: 'https://www.apache.org/licenses/LICENSE-2.0'
    },
    {
      name: 'GPL v3',
      description: 'Some open source components',
      url: 'https://www.gnu.org/licenses/gpl-3.0.en.html'
    }
  ];

  const acknowledgments = [
    'Material-UI team for the excellent component library',
    'React team for the amazing framework',
    'Framer team for smooth animations',
    'Vite team for fast build tools',
    'All open source contributors',
    'Beta testers and early adopters'
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: 4,
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(10, 10, 20, 0.8) 0%, rgba(20, 10, 30, 0.6) 50%, rgba(10, 20, 30, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(240, 248, 255, 0.8) 0%, rgba(255, 245, 250, 0.6) 50%, rgba(245, 250, 255, 0.8) 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: -1,
      }
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Back Button */}
            <motion.div
              style={{ position: 'absolute', left: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title="Go back">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(-1)}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderWidth: 2,
                    background: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateX(-2px)',
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  Back
                </Button>
              </Tooltip>
            </motion.div>
            
            <Box>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Typography variant="h2" component="h1" sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <InfoIcon sx={{ mr: 2, fontSize: 'inherit' }} />
                  </motion.div>
                  About MediaPlayer Pro
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Typography variant="h5" sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 600,
                  textShadow: theme.palette.mode === 'dark'
                    ? '0 2px 10px rgba(255, 255, 255, 0.1)'
                    : '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}>
                  Professional Media Playback Application
                </Typography>
              </motion.div>
            </Box>
          </Box>

          <Grid container spacing={4}>
            {/* App Information */}
            <Grid xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                <GlassCard sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <InfoIcon sx={{ mr: 1 }} />
                      Application Information
                    </Typography>
                    
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="h6" color="primary" gutterBottom>
                          {appInfo.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {appInfo.description}
                        </Typography>
                      </Box>
                      
                      <Divider />
                      
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Version Details
                        </Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                          <Chip label={`v${appInfo.version}`} color="primary" />
                          <Chip label={`Build: ${appInfo.buildDate}`} variant="outlined" />
                        </Stack>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Contact Information
                        </Typography>
                        <Stack spacing={1}>
                          <Link href={`mailto:${appInfo.email}`} display="flex" alignItems="center">
                            <EmailIcon sx={{ mr: 1, fontSize: 'small' }} />
                            {appInfo.email}
                          </Link>
                          <Link href={appInfo.website} target="_blank" display="flex" alignItems="center">
                            <WebIcon sx={{ mr: 1, fontSize: 'small' }} />
                            {appInfo.website}
                          </Link>
                          <Link href={appInfo.repository} target="_blank" display="flex" alignItems="center">
                            <GitHubIcon sx={{ mr: 1, fontSize: 'small' }} />
                            GitHub Repository
                          </Link>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>

            {/* Features */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <GlassCard sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <CodeIcon sx={{ mr: 1 }} />
                      Key Features
                    </Typography>
                    
                    <Grid container spacing={1}>
                      {features.map((feature, index) => (
                        <Grid item xs={6} key={index}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                          >
                            <FeatureChip
                              label={feature} 
                              size="small"
                              sx={{ mb: 1, width: '100%' }}
                            />
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>

            {/* Supported Formats */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <GlassCard>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <CodeIcon sx={{ mr: 1 }} />
                      Supported Formats
                    </Typography>
                    
                    <Stack spacing={2}>
                      {supportedFormats.map((category, index) => (
                        <Box key={index}>
                          <Typography variant="h6" color="primary" gutterBottom>
                            {category.type}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {category.formats.map((format, formatIndex) => (
                              <motion.div
                                key={formatIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + formatIndex * 0.1, duration: 0.3 }}
                              >
                                <FeatureChip
                                  label={format} 
                                  size="small"
                                  color="primary"
                                />
                              </motion.div>
                            ))}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>

            {/* Technologies */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <GlassCard>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <CodeIcon sx={{ mr: 1 }} />
                      Technologies Used
                    </Typography>
                    
                    <List dense>
                      {technologies.map((tech, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                        >
                          <ListItem sx={{ px: 0 }}>
                            <ListItemAvatar>
                              <TechAvatar sx={{ width: 32, height: 32 }}>
                                <CodeIcon fontSize="small" />
                              </TechAvatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {tech.name}
                                  </Typography>
                                  <Chip label={tech.version} size="small" variant="outlined" />
                                </Box>
                              }
                              secondary={tech.description}
                            />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>

            {/* Team & Contributors */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <GlassCard>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PeopleIcon sx={{ mr: 1 }} />
                      Team & Contributors
                    </Typography>
                    
                    <List dense>
                      {contributors.map((contributor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <ListItem sx={{ px: 0, borderRadius: 2 }}>
                            <ListItemAvatar>
                              <Avatar sx={{ 
                                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                                width: 40, 
                                height: 40,
                                boxShadow: `0 4px 12px ${theme.palette.secondary.main}30`
                              }}>
                                {contributor.avatar}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={contributor.name}
                              secondary={contributor.role}
                            />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>

            {/* Licensing */}
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <GlassCard>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <SecurityIcon sx={{ mr: 1 }} />
                      Licensing Information
                    </Typography>
                    
                    <Stack spacing={2}>
                      {licenses.map((license, index) => (
                        <Box key={index}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {license.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {license.description}
                          </Typography>
                          <Link href={license.url} target="_blank" variant="body2">
                            View License Details →
                          </Link>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>

            {/* Acknowledgments */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <GlassCard>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <FavoriteIcon sx={{ mr: 1 }} />
                      Acknowledgments
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      We would like to express our gratitude to the following individuals and organizations:
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {acknowledgments.map((ack, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                          >
                            <FeatureChip
                              label={ack} 
                              sx={{ 
                                width: '100%', 
                                textAlign: 'center',
                                background: `linear-gradient(135deg, ${theme.palette.success.main}20 0%, ${theme.palette.info.main}20 100%)`,
                                border: `1px solid ${theme.palette.success.main}30`
                              }}
                            />
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </GlassCard>
              </motion.div>
            </Grid>
          </Grid>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Box sx={{ 
              textAlign: 'center', 
              mt: 6, 
              p: 4,
              background: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.05)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.1)'}`
            }}>
              <Typography variant="body1" sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                mb: 1
              }}>
                Made with ❤️ by the MediaPlayer Pro Team
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
                © 2025 MediaPlayer Pro. All rights reserved.
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};