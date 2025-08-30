import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Container,
  Paper,
  Chip,
  Stack,
  useTheme,
  alpha,
  Button,
  Tooltip
} from '@mui/material';
import {
  Settings as SettingsIcon,
  VolumeUp,
  VolumeDown,
  VolumeMute,
  Palette,
  PlayArrow,
  DarkMode,
  LightMode,
  AutoAwesome as AutoMode,
  Hd as HD,
  Videocam as HighQuality,
  Save,
  RestoreFromTrash,
  ArrowBack,
  ColorLens,
  Speaker,
  VideoSettings,
  Brightness6,
  Movie as Animation
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
  isDark?: boolean;
  onToggleTheme?: () => void;
  themeName?: string;
  themeOptions?: Array<{ value: string; label: string }>;
  onSelectTheme?: (themeName: string) => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  autoplay?: boolean;
  onAutoplayChange?: (autoplay: boolean) => void;
  quality?: string;
  onQualityChange?: (quality: string) => void;
}

interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  icon,
  children,
  delay = 0
}) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
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
            height: '3px',
            background: `linear-gradient(90deg, 
              ${theme.palette.primary.main}, 
              ${theme.palette.secondary.main})`,
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: `linear-gradient(135deg, 
                  ${theme.palette.primary.main}, 
                  ${theme.palette.secondary.main})`,
                color: 'white',
                mr: 3,
                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              {icon}
            </Box>
          </motion.div>
          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(45deg, 
                  ${theme.palette.primary.main}, 
                  ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Box>
        {children}
      </Paper>
    </motion.div>
  );
};

export const Settings: React.FC<SettingsProps> = ({
  isDark = false,
  onToggleTheme,
  themeName = 'classic',
  themeOptions = [],
  onSelectTheme,
  volume = 50,
  onVolumeChange,
  autoplay = false,
  onAutoplayChange,
  quality = 'auto',
  onQualityChange
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [showSaved, setShowSaved] = useState(false);
  
  // Local state to track changes
  const [localVolume, setLocalVolume] = useState(() => {
    try {
      const stored = localStorage.getItem('mp_volume');
      return stored ? parseInt(stored, 10) : volume;
    } catch {
      return volume;
    }
  });
  
  const [localAutoplay, setLocalAutoplay] = useState(() => {
    try {
      const stored = localStorage.getItem('mp_autoplay');
      return stored ? stored === 'true' : autoplay;
    } catch {
      return autoplay;
    }
  });
  
  const [localQuality, setLocalQuality] = useState(() => {
    try {
      const stored = localStorage.getItem('mp_quality');
      return stored || quality;
    } catch {
      return quality;
    }
  });

  // Initialize settings from localStorage on component mount
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  useEffect(() => {
    setLocalAutoplay(autoplay);
  }, [autoplay]);

  useEffect(() => {
    setLocalQuality(quality);
  }, [quality]);

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setLocalVolume(volumeValue);
  };

  const handleQualityChange = (event: SelectChangeEvent) => {
    setLocalQuality(event.target.value);
  };

  const handleThemeChange = (event: SelectChangeEvent) => {
    onSelectTheme?.(event.target.value);
  };

  const handleAutoplayChange = (checked: boolean) => {
    setLocalAutoplay(checked);
  };

  const getVolumeIcon = () => {
    if (localVolume === 0) return <VolumeMute />;
    if (localVolume < 30) return <VolumeDown />;
    return <VolumeUp />;
  };

  const getQualityChip = (qualityValue: string) => {
    const qualityConfig = {
      'auto': { color: 'primary' as const, icon: <AutoMode fontSize="small" /> },
      '1080p': { color: 'success' as const, icon: <HD fontSize="small" /> },
      '720p': { color: 'warning' as const, icon: <HighQuality fontSize="small" /> },
      '480p': { color: 'info' as const, icon: <VideoSettings fontSize="small" /> },
      '360p': { color: 'secondary' as const, icon: <VideoSettings fontSize="small" /> },
    };
    return qualityConfig[qualityValue as keyof typeof qualityConfig] || qualityConfig.auto;
  };

  const handleSave = () => {
    // Save to localStorage
    try {
      localStorage.setItem('mp_volume', localVolume.toString());
      localStorage.setItem('mp_autoplay', localAutoplay.toString());
      localStorage.setItem('mp_quality', localQuality);
      console.log('Settings saved to localStorage');
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }

    // Update parent component state
    onVolumeChange?.(localVolume);
    onAutoplayChange?.(localAutoplay);
    onQualityChange?.(localQuality);

    setShowSaved(true);
    console.log('Navigating back to previous page in 1 second...');
    setTimeout(() => {
      setShowSaved(false);
      console.log('Navigating back now...');
      // Navigate back to previous page
      navigate(-1);
    }, 1000);
  };

  const handleReset = () => {
    // Reset to defaults
    const defaultVolume = 50;
    const defaultAutoplay = false;
    const defaultQuality = 'auto';

    setLocalVolume(defaultVolume);
    setLocalAutoplay(defaultAutoplay);
    setLocalQuality(defaultQuality);

    // Clear localStorage
    try {
      localStorage.removeItem('mp_volume');
      localStorage.removeItem('mp_autoplay');
      localStorage.removeItem('mp_quality');
    } catch (error) {
      console.error('Failed to clear settings from localStorage:', error);
    }

    // Update parent component state
    onVolumeChange?.(defaultVolume);
    onAutoplayChange?.(defaultAutoplay);
    onQualityChange?.(defaultQuality);
  };

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 6,
              position: 'relative'
            }}
          >
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
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateX(-2px)',
                    }
                  }}
                >
                  Back
                </Button>
              </Tooltip>
            </motion.div>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <SettingsIcon 
                sx={{ 
                  fontSize: 48,
                  mr: 3,
                  color: theme.palette.primary.main,
                  filter: `drop-shadow(0 4px 8px ${alpha(theme.palette.primary.main, 0.3)})`
                }} 
              />
            </motion.div>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                textAlign: 'center',
                background: `linear-gradient(135deg, 
                  ${theme.palette.primary.main}, 
                  ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Settings
            </Typography>
          </Box>

          {/* Appearance Section */}
          <SettingsSection
            title="Appearance"
            description="Customize the visual experience of your media player"
            icon={<Palette fontSize="large" />}
            delay={0.1}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Brightness6 sx={{ mr: 1 }} />
                    Theme Mode
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Chip
                        icon={isDark ? <DarkMode /> : <LightMode />}
                        label={isDark ? 'Dark Mode' : 'Light Mode'}
                        variant={isDark ? 'filled' : 'outlined'}
                        color="primary"
                        sx={{ px: 2, py: 1 }}
                      />
                    </motion.div>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isDark}
                          onChange={() => onToggleTheme?.()}
                          color="primary"
                          size="medium"
                        />
                      }
                      label=""
                    />
                  </Stack>
                </Box>
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.secondary.main, 0.05) }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ColorLens sx={{ mr: 1 }} />
                    Theme Style
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={themeName}
                      label="Theme"
                      onChange={handleThemeChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      {themeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Animation fontSize="small" />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </SettingsSection>

          {/* Audio Section */}
          <SettingsSection
            title="Audio Settings"
            description="Fine-tune your audio experience for optimal sound quality"
            icon={<Speaker fontSize="large" />}
            delay={0.2}
          >
            <Box sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                {getVolumeIcon()}
                <Box sx={{ ml: 1 }}>Default Volume</Box>
                <Chip 
                  label={`${localVolume}%`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 'auto' }}
                />
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={localVolume}
                  onChange={handleVolumeChange}
                  aria-labelledby="volume-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks={[
                    { value: 0, label: 'Mute' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: 'Max' }
                  ]}
                  min={0}
                  max={100}
                  sx={{
                    '& .MuiSlider-thumb': {
                      width: 24,
                      height: 24,
                      '&:hover': {
                        boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                      },
                    },
                    '& .MuiSlider-track': {
                      height: 6,
                      borderRadius: 3,
                    },
                    '& .MuiSlider-rail': {
                      height: 6,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            </Box>
          </SettingsSection>

          {/* Playback Section */}
          <SettingsSection
            title="Playback Controls"
            description="Configure how your media behaves during playback"
            icon={<PlayArrow fontSize="large" />}
            delay={0.3}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <PlayArrow sx={{ mr: 1 }} />
                    Autoplay
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Automatically start playing media when loaded
                  </Typography>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={localAutoplay}
                          onChange={(e) => handleAutoplayChange(e.target.checked)}
                          color="success"
                          size="medium"
                        />
                      }
                      label={
                        <Chip
                          label={localAutoplay ? 'Enabled' : 'Disabled'}
                          color={localAutoplay ? 'success' : 'default'}
                          size="small"
                        />
                      }
                    />
                  </motion.div>
                </Box>
              </Box>
              
              <Box sx={{ flex: '1 1 45%', minWidth: '300px' }}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  bgcolor: alpha(theme.palette.info.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <VideoSettings sx={{ mr: 1 }} />
                    Video Quality
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Default video quality preference
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={localQuality}
                      onChange={handleQualityChange}
                      displayEmpty
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    >
                      <MenuItem value="auto">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AutoMode fontSize="small" />
                          Auto Quality
                        </Box>
                      </MenuItem>
                      <MenuItem value="1080p">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HD fontSize="small" />
                          1080p HD
                        </Box>
                      </MenuItem>
                      <MenuItem value="720p">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HighQuality fontSize="small" />
                          720p HD
                        </Box>
                      </MenuItem>
                      <MenuItem value="480p">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VideoSettings fontSize="small" />
                          480p SD
                        </Box>
                      </MenuItem>
                      <MenuItem value="360p">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VideoSettings fontSize="small" />
                          360p
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      {...getQualityChip(localQuality)}
                      label={`Current: ${localQuality.toUpperCase()}`}
                      variant="filled"
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </SettingsSection>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Tooltip title="Save all settings">
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Save />}
                  onClick={handleSave}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
                    }
                  }}
                >
                  Save Settings
                </Button>
              </Tooltip>
              
              <Tooltip title="Reset to defaults">
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<RestoreFromTrash />}
                  onClick={handleReset}
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
                  Reset
                </Button>
              </Tooltip>
            </Box>
          </motion.div>

          {/* Save Confirmation */}
          <AnimatePresence>
            {showSaved && (
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
                <Paper
                  elevation={8}
                  sx={{
                    p: 2,
                    background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                    color: 'white',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Save />
                  <Typography variant="body1" fontWeight={600}>
                    Settings saved successfully!
                  </Typography>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Settings;