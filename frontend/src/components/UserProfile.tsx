import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Badge,
  Container,
  Alert,
  useTheme,
  Paper,
  alpha,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  ButtonGroup
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  History as HistoryIcon,
  Favorite as FavoriteIcon,
  Settings as SettingsIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Web as WebIcon,
  CalendarToday as CalendarIcon,
  MusicNote as MusicIcon,
  PlaylistPlay as PlaylistIcon,
  PhotoCamera as PhotoCameraIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Sparkles,
  RotateRight as RotateRightIcon,
  RotateLeft as RotateLeftIcon,
  Crop as CropIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, delay }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <Paper
        elevation={0}
        sx={{
          textAlign: 'center',
          p: 3,
          background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
          color: 'white',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, transparent 30%, ${alpha('#fff', 0.1)} 50%, transparent 70%)`,
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s ease-in-out',
          },
          '&:hover::before': {
            transform: 'translateX(100%)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          {icon}
        </Box>
        <Typography variant="h3" fontWeight="bold" sx={{ mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
      </Paper>
    </motion.div>
  );
};

export const UserProfile: React.FC = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mp_profile_picture');
    } catch {
      return null;
    }
  });
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [imageTransform, setImageTransform] = useState({
    rotation: 0,
    scale: 1,
    x: 0,
    y: 0
  });
  
  const [userData, setUserData] = useState(() => {
    try {
      const stored = localStorage.getItem('mp_user_data');
      return stored ? JSON.parse(stored) : {
        name: 'John Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        bio: 'Music enthusiast and media lover. Always exploring new sounds and visual experiences.',
        location: 'New York, NY',
        website: 'https://johndoe.com',
        joinDate: '2024-01-15',
        lastLogin: '2025-01-29T10:30:00Z'
      };
    } catch {
      return {
        name: 'John Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        bio: 'Music enthusiast and media lover. Always exploring new sounds and visual experiences.',
        location: 'New York, NY',
        website: 'https://johndoe.com',
        joinDate: '2024-01-15',
        lastLogin: '2025-01-29T10:30:00Z'
      };
    }
  });

  const [preferences, setPreferences] = useState(() => {
    try {
      const stored = localStorage.getItem('mp_user_preferences');
      return stored ? JSON.parse(stored) : {
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        autoPlay: true,
        crossfade: true,
        highQuality: true,
      };
    } catch {
      return {
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        autoPlay: true,
        crossfade: true,
        highQuality: true,
      };
    }
  });

  const [stats] = useState({
    totalPlaylists: 15,
    totalTracks: 1247,
    listeningTime: '156h',
    favoriteGenres: ['Rock', 'Electronic', 'Jazz', 'Classical', 'Hip-Hop'],
    topArtists: ['Pink Floyd', 'Daft Punk', 'Miles Davis'],
    streakDays: 42
  });

  const [recentActivity] = useState([
    { action: 'Created playlist', details: 'Chill Vibes', time: '2 hours ago', icon: <PlaylistIcon />, color: theme.palette.primary.main },
    { action: 'Liked track', details: 'Bohemian Rhapsody', time: '5 hours ago', icon: <FavoriteIcon />, color: theme.palette.error.main },
    { action: 'Shared playlist', details: 'Workout Mix', time: '1 day ago', icon: <PlaylistIcon />, color: theme.palette.secondary.main },
    { action: 'Added to favorites', details: 'Hotel California', time: '2 days ago', icon: <MusicIcon />, color: theme.palette.success.main }
  ]);

  // Store original data for cancel functionality
  const [originalUserData, setOriginalUserData] = useState(userData);
  const [originalPreferences, setOriginalPreferences] = useState(preferences);
  const [originalProfilePicture, setOriginalProfilePicture] = useState(profilePicture);

  const handleSave = () => {
    // Save user data to localStorage
    try {
      localStorage.setItem('mp_user_data', JSON.stringify(userData));
      localStorage.setItem('mp_user_preferences', JSON.stringify(preferences));
      console.log('User data saved to localStorage');
    } catch (error) {
      console.error('Failed to save user data:', error);
    }

    // Update original data to current state
    setOriginalUserData(userData);
    setOriginalPreferences(preferences);
    setOriginalProfilePicture(profilePicture);
    
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    console.log('Saving user data:', userData);
  };

  const handleCancel = () => {
    // Revert to original data
    setUserData(originalUserData);
    setPreferences(originalPreferences);
    setProfilePicture(originalProfilePicture);
    
    // Restore original profile picture in localStorage if it was changed
    if (originalProfilePicture !== profilePicture) {
      try {
        if (originalProfilePicture) {
          localStorage.setItem('mp_profile_picture', originalProfilePicture);
        } else {
          localStorage.removeItem('mp_profile_picture');
        }
        // Dispatch custom event for same-tab updates
        const customEvent = new CustomEvent('localStorageChange');
        Object.defineProperty(customEvent, 'detail', {
          value: { key: 'mp_profile_picture', newValue: originalProfilePicture },
          enumerable: false
        });
        window.dispatchEvent(customEvent);
      } catch (error) {
        console.error('Failed to restore profile picture:', error);
      }
    }
    
    setIsEditing(false);
  };

  // Image handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image under 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setTempImage(imageUrl);
        setImageTransform({ rotation: 0, scale: 1, x: 0, y: 0 });
        setShowImageEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotateLeft = () => {
    setImageTransform(prev => ({ ...prev, rotation: prev.rotation - 90 }));
  };

  const handleRotateRight = () => {
    setImageTransform(prev => ({ ...prev, rotation: prev.rotation + 90 }));
  };

  const handleScaleChange = (_event: Event, newValue: number | number[]) => {
    const scale = Array.isArray(newValue) ? newValue[0] : newValue;
    setImageTransform(prev => ({ ...prev, scale: scale / 100 }));
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    setImageTransform(prev => ({ ...prev, [axis]: value }));
  };

  const handleSaveImage = async () => {
    if (!tempImage) return;

    try {
      // Create a canvas to apply transformations
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        // Set canvas size
        const size = 300; // Fixed size for profile picture
        canvas.width = size;
        canvas.height = size;

        // Apply transformations
        ctx.fillStyle = theme.palette.background.paper;
        ctx.fillRect(0, 0, size, size);
        
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.rotate((imageTransform.rotation * Math.PI) / 180);
        ctx.scale(imageTransform.scale, imageTransform.scale);
        ctx.translate(imageTransform.x, imageTransform.y);

        // Draw image centered
        const drawSize = Math.min(img.width, img.height);
        const sx = (img.width - drawSize) / 2;
        const sy = (img.height - drawSize) / 2;
        
        ctx.drawImage(
          img, 
          sx, sy, drawSize, drawSize,
          -size / 2, -size / 2, size, size
        );
        
        ctx.restore();

        // Convert to blob and save
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageUrl = e.target?.result as string;
              setProfilePicture(imageUrl);
              try {
                localStorage.setItem('mp_profile_picture', imageUrl);
                // Dispatch custom event for same-tab updates
                const customEvent = new CustomEvent('localStorageChange');
                Object.defineProperty(customEvent, 'detail', {
                  value: { key: 'mp_profile_picture', newValue: imageUrl },
                  enumerable: false
                });
                window.dispatchEvent(customEvent);
              } catch (error) {
                console.error('Failed to save profile picture:', error);
              }
              setShowImageEditor(false);
              setTempImage(null);
            };
            reader.readAsDataURL(blob);
          }
        }, 'image/jpeg', 0.9);
      };
      
      img.src = tempImage;
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }
  };

  const handleCancelImageEdit = () => {
    setShowImageEditor(false);
    setTempImage(null);
    setImageTransform({ rotation: 0, scale: 1, x: 0, y: 0 });
  };

  const handleDeleteImage = () => {
    setProfilePicture(null);
    try {
      localStorage.removeItem('mp_profile_picture');
      // Dispatch custom event for same-tab updates
      const customEvent = new CustomEvent('localStorageChange');
      Object.defineProperty(customEvent, 'detail', {
        value: { key: 'mp_profile_picture', newValue: null },
        enumerable: false
      });
      window.dispatchEvent(customEvent);
    } catch (error) {
      console.error('Failed to remove profile picture:', error);
    }
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: 4,
      background: `linear-gradient(135deg, 
        ${alpha(theme.palette.primary.main, 0.02)} 0%, 
        ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography variant="h2" component="h1" sx={{ 
                fontWeight: 800,
                mb: 2,
                background: `linear-gradient(135deg, 
                  ${theme.palette.primary.main}, 
                  ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <PersonIcon sx={{ mr: 2, fontSize: 'inherit', color: theme.palette.primary.main }} />
                </motion.div>
                User Profile
              </Typography>
            </motion.div>
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary, opacity: 0.8 }}>
              Manage your account and personalize your experience
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Top Row: Profile + Details */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {/* Profile Information */}
              <Box sx={{ flex: '1 1 350px', minWidth: '300px' }}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Card 
                    elevation={0}
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.primary.main, 0.05)} 0%, 
                        ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, 
                          ${theme.palette.primary.main}, 
                          ${theme.palette.secondary.main})`,
                      },
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.2)}`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 4 }}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Stack direction="row" spacing={0.5}>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  id="profile-picture-upload"
                                  onChange={handleImageUpload}
                                />
                                <label htmlFor="profile-picture-upload">
                                  <Tooltip title="Upload photo">
                                    <IconButton
                                      component="span"
                                      size="small"
                                      sx={{ 
                                        bgcolor: 'primary.main', 
                                        color: 'white',
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        '&:hover': { 
                                          bgcolor: 'primary.dark',
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </label>
                                {profilePicture && (
                                  <Tooltip title="Remove photo">
                                    <IconButton
                                      size="small"
                                      onClick={handleDeleteImage}
                                      sx={{ 
                                        bgcolor: 'error.main', 
                                        color: 'white',
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.4)}`,
                                        ml: 0.5,
                                        '&:hover': { 
                                          bgcolor: 'error.dark',
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Stack>
                            }
                          >
                            <Avatar
                              src={profilePicture || undefined}
                              sx={{ 
                                width: 120, 
                                height: 120, 
                                mx: 'auto',
                                background: !profilePicture ? `linear-gradient(135deg, 
                                  ${theme.palette.primary.main}, 
                                  ${theme.palette.secondary.main})` : 'transparent',
                                fontSize: '3rem',
                                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                              }}
                            >
                              {!profilePicture && <PersonIcon sx={{ fontSize: '3rem' }} />}
                            </Avatar>
                          </Badge>
                        </Box>
                      </motion.div>

                      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{
                        background: `linear-gradient(45deg, 
                          ${theme.palette.text.primary}, 
                          ${theme.palette.primary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        {userData.name}
                      </Typography>
                      
                      <Typography variant="body1" color="text.secondary" paragraph sx={{ opacity: 0.8 }}>
                        @{userData.username}
                      </Typography>

                      <Typography variant="body2" paragraph sx={{ mb: 3, lineHeight: 1.6 }}>
                        {userData.bio}
                      </Typography>

                      <Stack spacing={2} sx={{ mb: 4 }}>
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Chip 
                            icon={<LocationIcon />} 
                            label={userData.location} 
                            variant="filled" 
                            color="primary"
                            sx={{
                              '& .MuiChip-icon': { color: 'white' }
                            }}
                          />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Chip 
                            icon={<CalendarIcon />} 
                            label={`Member since ${formatDate(userData.joinDate)}`} 
                            variant="outlined" 
                            color="secondary"
                          />
                        </motion.div>
                      </Stack>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant={isEditing ? "outlined" : "contained"}
                          startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                          onClick={() => setIsEditing(!isEditing)}
                          fullWidth
                          size="large"
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            background: !isEditing ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})` : undefined,
                            '&:hover': {
                              boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                              transform: 'translateY(-2px)',
                            }
                          }}
                        >
                          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>

              {/* Profile Details */}
              <Box sx={{ flex: '2 1 400px' }}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card 
                    elevation={0}
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.secondary.main, 0.05)} 0%, 
                        ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, 
                          ${theme.palette.secondary.main}, 
                          ${theme.palette.primary.main})`,
                      },
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 30px ${alpha(theme.palette.secondary.main, 0.2)}`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        fontWeight: 700,
                        background: `linear-gradient(45deg, 
                          ${theme.palette.secondary.main}, 
                          ${theme.palette.primary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        <EditIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                        Profile Information
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          <Box sx={{ flex: '1 1 250px' }}>
                            <TextField
                              fullWidth
                              label="Full Name"
                              value={userData.name}
                              onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                              disabled={!isEditing}
                              variant="outlined"
                              InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover': {
                                    boxShadow: isEditing ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}` : undefined,
                                  }
                                }
                              }}
                            />
                          </Box>
                          <Box sx={{ flex: '1 1 250px' }}>
                            <TextField
                              fullWidth
                              label="Username"
                              value={userData.username}
                              onChange={(e) => setUserData(prev => ({ ...prev, username: e.target.value }))}
                              disabled={!isEditing}
                              variant="outlined"
                              InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover': {
                                    boxShadow: isEditing ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}` : undefined,
                                  }
                                }
                              }}
                            />
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          <Box sx={{ flex: '1 1 250px' }}>
                            <TextField
                              fullWidth
                              label="Email"
                              value={userData.email}
                              onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                              disabled={!isEditing}
                              variant="outlined"
                              type="email"
                              InputProps={{
                                startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover': {
                                    boxShadow: isEditing ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}` : undefined,
                                  }
                                }
                              }}
                            />
                          </Box>
                          <Box sx={{ flex: '1 1 250px' }}>
                            <TextField
                              fullWidth
                              label="Location"
                              value={userData.location}
                              onChange={(e) => setUserData(prev => ({ ...prev, location: e.target.value }))}
                              disabled={!isEditing}
                              variant="outlined"
                              InputProps={{
                                startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  '&:hover': {
                                    boxShadow: isEditing ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}` : undefined,
                                  }
                                }
                              }}
                            />
                          </Box>
                        </Box>

                        <TextField
                          fullWidth
                          label="Bio"
                          value={userData.bio}
                          onChange={(e) => setUserData(prev => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          variant="outlined"
                          multiline
                          rows={3}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover': {
                                boxShadow: isEditing ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}` : undefined,
                              }
                            }
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Website"
                          value={userData.website}
                          onChange={(e) => setUserData(prev => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                          variant="outlined"
                          InputProps={{
                            startAdornment: <WebIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              '&:hover': {
                                boxShadow: isEditing ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.15)}` : undefined,
                              }
                            }
                          }}
                        />
                      </Box>

                      <AnimatePresence>
                        {isEditing && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                  variant="contained"
                                  startIcon={<SaveIcon />}
                                  onClick={handleSave}
                                  size="large"
                                  sx={{
                                    px: 4,
                                    borderRadius: 2,
                                    background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                                    '&:hover': {
                                      boxShadow: `0 6px 20px ${alpha(theme.palette.success.main, 0.3)}`,
                                      transform: 'translateY(-2px)',
                                    }
                                  }}
                                >
                                  Save Changes
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<CancelIcon />}
                                  onClick={handleCancel}
                                  size="large"
                                  sx={{
                                    px: 4,
                                    borderRadius: 2,
                                    borderWidth: 2,
                                    '&:hover': {
                                      borderWidth: 2,
                                      transform: 'translateY(-2px)',
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              </motion.div>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            </Box>

            {/* Statistics Row */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card 
                elevation={0}
                sx={{
                  background: `linear-gradient(135deg, 
                    ${alpha(theme.palette.info.main, 0.05)} 0%, 
                    ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, 
                      ${theme.palette.info.main}, 
                      ${theme.palette.success.main})`,
                  },
                  position: 'relative',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 4,
                    fontWeight: 700,
                    background: `linear-gradient(45deg, 
                      ${theme.palette.info.main}, 
                      ${theme.palette.success.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    <TrendingUpIcon sx={{ mr: 1, color: theme.palette.info.main }} />
                    Your Statistics & Achievements
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                    <Box sx={{ flex: '1 1 150px' }}>
                      <StatCard
                        title="Playlists"
                        value={stats.totalPlaylists}
                        icon={<PlaylistIcon sx={{ fontSize: '2rem' }} />}
                        color={theme.palette.primary.main}
                        delay={0.4}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 150px' }}>
                      <StatCard
                        title="Tracks"
                        value={stats.totalTracks}
                        icon={<MusicIcon sx={{ fontSize: '2rem' }} />}
                        color={theme.palette.secondary.main}
                        delay={0.5}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 150px' }}>
                      <StatCard
                        title="Listening Time"
                        value={stats.listeningTime}
                        icon={<TimelineIcon sx={{ fontSize: '2rem' }} />}
                        color={theme.palette.success.main}
                        delay={0.6}
                      />
                    </Box>
                    <Box sx={{ flex: '1 1 150px' }}>
                      <StatCard
                        title="Day Streak"
                        value={stats.streakDays}
                        icon={<StarIcon sx={{ fontSize: '2rem' }} />}
                        color={theme.palette.warning.main}
                        delay={0.7}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3, opacity: 0.3 }} />

                  <Typography variant="h6" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
                    Favorite Genres
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {stats.favoriteGenres.map((genre, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Chip 
                          label={genre} 
                          size="medium" 
                          color="primary"
                          variant="filled"
                          sx={{
                            fontWeight: 600,
                            '&:hover': {
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bottom Row: Preferences + Recent Activity */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {/* Preferences */}
              <Box sx={{ flex: '1 1 400px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card 
                    elevation={0}
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.warning.main, 0.05)} 0%, 
                        ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, 
                          ${theme.palette.warning.main}, 
                          ${theme.palette.error.main})`,
                      },
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 30px ${alpha(theme.palette.warning.main, 0.2)}`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        fontWeight: 700,
                        background: `linear-gradient(45deg, 
                          ${theme.palette.warning.main}, 
                          ${theme.palette.error.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        <SettingsIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                        Preferences & Settings
                      </Typography>

                      <Stack spacing={3}>
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', icon: <EmailIcon />, checked: preferences.emailNotifications },
                          { key: 'pushNotifications', label: 'Push Notifications', icon: <NotificationsIcon />, checked: preferences.pushNotifications },
                          { key: 'marketingEmails', label: 'Marketing Emails', icon: <EmailIcon />, checked: preferences.marketingEmails },
                          { key: 'autoPlay', label: 'Auto-play Next Track', icon: <MusicIcon />, checked: preferences.autoPlay },
                          { key: 'crossfade', label: 'Enable Crossfade', icon: <MusicIcon />, checked: preferences.crossfade },
                          { key: 'highQuality', label: 'High Quality Streaming', icon: <MusicIcon />, checked: preferences.highQuality },
                        ].map((pref, index) => (
                          <motion.div
                            key={pref.key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.background.paper, 0.6),
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.background.paper, 0.8),
                                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                }
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={pref.checked}
                                    onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
                                    color="primary"
                                  />
                                }
                                label={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ 
                                      color: theme.palette.primary.main, 
                                      mr: 1,
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}>
                                      {pref.icon}
                                    </Box>
                                    <Typography variant="body1" fontWeight={500}>
                                      {pref.label}
                                    </Typography>
                                  </Box>
                                }
                              />
                            </Paper>
                          </motion.div>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>

              {/* Recent Activity */}
              <Box sx={{ flex: '1 1 400px' }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card 
                    elevation={0}
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, 
                        ${alpha(theme.palette.success.main, 0.05)} 0%, 
                        ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, 
                          ${theme.palette.success.main}, 
                          ${theme.palette.info.main})`,
                      },
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 30px ${alpha(theme.palette.success.main, 0.2)}`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" gutterBottom sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3,
                        fontWeight: 700,
                        background: `linear-gradient(45deg, 
                          ${theme.palette.success.main}, 
                          ${theme.palette.info.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}>
                        <HistoryIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                        Recent Activity
                      </Typography>

                      <List sx={{ p: 0 }}>
                        {recentActivity.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 1.8 + index * 0.1 }}
                          >
                            <ListItem 
                              sx={{ 
                                px: 0, 
                                py: 2,
                                borderRadius: 2,
                                mb: 1,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                                  transform: 'translateX(8px)',
                                  transition: 'all 0.3s ease'
                                }
                              }}
                            >
                              <ListItemAvatar>
                                <motion.div whileHover={{ scale: 1.1, rotate: 5 }}>
                                  <Avatar sx={{ 
                                    bgcolor: activity.color,
                                    width: 48,
                                    height: 48,
                                    boxShadow: `0 4px 12px ${alpha(activity.color, 0.3)}`,
                                  }}>
                                    {activity.icon}
                                  </Avatar>
                                </motion.div>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5 }}>
                                    {activity.action}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.secondary">
                                    {activity.details} • {activity.time}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          </motion.div>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            </Box>
          </Box>

          {/* Save/Cancel Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Tooltip title="Save all profile changes">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.success.dark}, ${alpha(theme.palette.success.dark, 0.8)})`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.25)}`,
                    }
                  }}
                >
                  Save Profile
                </Button>
              </Tooltip>
              
              <Tooltip title="Cancel all changes">
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Cancel Changes
                </Button>
              </Tooltip>
            </Box>
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                style={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  zIndex: 1000,
                }}
              >
                <Alert 
                  severity="success" 
                  variant="filled"
                  sx={{
                    borderRadius: 2,
                    boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.3)}`,
                    fontWeight: 600,
                  }}
                >
                  Profile updated successfully! 🎉
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image Editor Dialog */}
          <Dialog 
            open={showImageEditor} 
            onClose={handleCancelImageEdit}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                background: `linear-gradient(135deg, 
                  ${alpha(theme.palette.background.paper, 0.95)} 0%, 
                  ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }
            }}
          >
            <DialogTitle sx={{ 
              textAlign: 'center', 
              pb: 1,
              background: `linear-gradient(45deg, 
                ${theme.palette.primary.main}, 
                ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontSize: '1.5rem'
            }}>
              <CropIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              Edit Profile Picture
            </DialogTitle>
            
            <DialogContent sx={{ pt: 2 }}>
              {tempImage && (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  {/* Image Preview */}
                  <Box 
                    sx={{ 
                      width: 300, 
                      height: 300, 
                      mx: 'auto', 
                      mb: 3,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `3px solid ${theme.palette.primary.main}`,
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
                      position: 'relative',
                      background: theme.palette.background.paper
                    }}
                  >
                    <Box
                      component="img"
                      src={tempImage}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `
                          rotate(${imageTransform.rotation}deg) 
                          scale(${imageTransform.scale}) 
                          translate(${imageTransform.x}px, ${imageTransform.y}px)
                        `,
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </Box>

                  {/* Controls */}
                  <Stack spacing={3}>
                    {/* Rotation Controls */}
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RotateRightIcon sx={{ mr: 1 }} />
                        Rotation
                      </Typography>
                      <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
                        <Button 
                          onClick={handleRotateLeft}
                          startIcon={<RotateLeftIcon />}
                          sx={{ px: 3 }}
                        >
                          Rotate Left
                        </Button>
                        <Button 
                          onClick={handleRotateRight}
                          startIcon={<RotateRightIcon />}
                          sx={{ px: 3 }}
                        >
                          Rotate Right
                        </Button>
                      </ButtonGroup>
                      <Typography variant="body2" color="text.secondary">
                        Current: {imageTransform.rotation}°
                      </Typography>
                    </Box>

                    {/* Scale Control */}
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ZoomInIcon sx={{ mr: 1 }} />
                        Scale: {Math.round(imageTransform.scale * 100)}%
                      </Typography>
                      <Box sx={{ px: 2 }}>
                        <Slider
                          value={imageTransform.scale * 100}
                          onChange={handleScaleChange}
                          min={50}
                          max={200}
                          step={5}
                          marks={[
                            { value: 50, label: '50%' },
                            { value: 100, label: '100%' },
                            { value: 150, label: '150%' },
                            { value: 200, label: '200%' }
                          ]}
                          valueLabelDisplay="auto"
                          sx={{
                            '& .MuiSlider-thumb': {
                              width: 20,
                              height: 20,
                            },
                            '& .MuiSlider-track': {
                              height: 6,
                            },
                            '& .MuiSlider-rail': {
                              height: 6,
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Position Controls */}
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                        Position
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" gutterBottom>Horizontal</Typography>
                          <Slider
                            value={imageTransform.x}
                            onChange={(_, value) => handlePositionChange('x', Array.isArray(value) ? value[0] : value)}
                            min={-100}
                            max={100}
                            step={5}
                            valueLabelDisplay="auto"
                            size="small"
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" gutterBottom>Vertical</Typography>
                          <Slider
                            value={imageTransform.y}
                            onChange={(_, value) => handlePositionChange('y', Array.isArray(value) ? value[0] : value)}
                            min={-100}
                            max={100}
                            step={5}
                            valueLabelDisplay="auto"
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              )}
            </DialogContent>
            
            <DialogActions sx={{ px: 3, pb: 3, pt: 1, justifyContent: 'center', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outlined"
                  onClick={handleCancelImageEdit}
                  startIcon={<CancelIcon />}
                  size="large"
                  sx={{
                    px: 4,
                    borderRadius: 2,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  Cancel
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="contained"
                  onClick={handleSaveImage}
                  startIcon={<SaveIcon />}
                  size="large"
                  sx={{
                    px: 4,
                    borderRadius: 2,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Save Photo
                </Button>
              </motion.div>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UserProfile;