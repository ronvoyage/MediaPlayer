import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  IconButton,
  Stack,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Tooltip,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  Divider,
  Container,
  Grid,
  Avatar
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipPrevious,
  SkipNext,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  ArrowBack,
  Home,
  LibraryMusic,
  Search,
  AccountCircle,
  Menu as MenuIcon,
  PlayCircle,
  Brightness4,
  Brightness7,
  Settings as SettingsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { logger } from '../services/logger';
import type { MediaInfo } from '../services/mediaPlayer';
import { DragAndDrop } from './DragAndDrop';
import { Playlist } from './Playlist';
import { mediaPlayerService } from '../services/mediaPlayer';
import { AnimatedLogo } from './AnimatedLogo';
import { useGlobalMusicPlayer } from '../hooks/useGlobalMusicPlayer';

export interface MediaPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  currentFile: MediaInfo | null;
  error: string | null;
  isLoading: boolean;
}

const initialState: MediaPlayerState = {
  isPlaying: false,
  isPaused: false,
  isStopped: true,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  isFullscreen: false,
  currentFile: null,
  error: null,
  isLoading: false
};

// Styled media elements to avoid inline styles
const AudioEl = styled('audio')(({ theme }) => ({
  width: '100%'
}));
const VideoEl = styled('video')(({ theme }) => ({
  width: '100%',
  maxHeight: 400,
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.95
  }
}));

interface MediaPlayerProps {
  onToggleTheme?: () => void;
  isDark?: boolean;
  themeName?: string;
  themeOptions?: Array<{ value: string; label: string }>;
  onSelectTheme?: (value: any) => void;
}

// Enhanced glassmorphism card components
const GlassCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(30, 30, 30, 0.8)'
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '16px',
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

const GlassPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.mode === 'dark' 
      ? 'rgba(30, 30, 30, 0.9) 0%' 
      : 'rgba(255, 255, 255, 0.9) 0%'}, 
    ${theme.palette.mode === 'dark' 
      ? 'rgba(20, 20, 20, 0.8) 100%'
      : 'rgba(240, 240, 240, 0.8) 100%'})`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  borderRadius: '20px',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}20 0%, 
    ${theme.palette.primary.main}10 100%)`,
  border: `1px solid ${theme.palette.primary.main}30`,
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    background: `linear-gradient(135deg, 
      ${theme.palette.primary.main}40 0%, 
      ${theme.palette.primary.main}20 100%)`,
    boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ 
  onToggleTheme, 
  isDark, 
  themeName, 
  themeOptions = [], 
  onSelectTheme 
}) => {
  const theme = useTheme();
  const globalPlayer = useGlobalMusicPlayer();
  const [state, setState] = useState<MediaPlayerState>(initialState);
  const [playlist, setPlaylist] = useState<MediaInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mp_profile_picture');
    } catch {
      return null;
    }
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Update state helper
  const updateState = useCallback((updates: Partial<MediaPlayerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Log user actions
  const logAction = useCallback((action: string, details?: any) => {
    logger.userAction(action, 'MediaPlayer', details);
  }, []);

  // Listen for profile picture changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mp_profile_picture') {
        setProfilePicture(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleCustomStorageChange = ((e: CustomEvent) => {
      if (e.detail.key === 'mp_profile_picture') {
        setProfilePicture(e.detail.newValue);
      }
    }) as EventListener;

    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, []);

  // Handle file selection from DragAndDrop
  const handleFilesSelected = useCallback((files: MediaInfo[]) => {
    // Add files to global music player
    globalPlayer.addToPlaylist(files);
    
    // Also keep local state for the playlist component
    setPlaylist(prev => [...prev, ...files]);
    if (currentIndex === -1 && files.length > 0) {
      setCurrentIndex(0);
    }

    logAction('files_selected', { count: files.length, fileTypes: files.map(f => f.type) });
  }, [currentIndex, logAction, globalPlayer]);

  // Load media file
  const loadMedia = useCallback((file: MediaInfo) => {
    // Prevent loading the same file multiple times rapidly
    if (state.currentFile?.url === file.url && !state.isLoading) {
      return;
    }

    // Reset any previous media elements
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    updateState({
      currentFile: file,
      isLoading: true,
      error: null,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isPaused: false,
      isStopped: true
    });

    // Validate the file URL
    if (!file.url) {
      const errorMessage = 'Invalid media file URL';
      updateState({ 
        error: errorMessage, 
        isLoading: false,
        currentFile: null 
      });
      logger.error('Media loading error', new Error(errorMessage), { 
        metadata: { fileName: file.name, fileType: file.type }
      });
      return;
    }

    // Check if blob URL is still accessible (use GET instead of HEAD for blob URLs)
    if (file.url.startsWith('blob:')) {
      fetch(file.url, { method: 'GET' }).catch(() => {
        const errorMessage = 'Media file is no longer accessible - please reload the file';
        updateState({ 
          error: errorMessage, 
          isLoading: false,
          currentFile: null 
        });
        logger.error('Blob URL validation failed', new Error(errorMessage), { 
          metadata: { fileName: file.name, fileType: file.type }
        });
        return;
      });
    }

    logAction('media_loaded', { fileName: file.name, fileType: file.type });
  }, [updateState, logAction, state.currentFile?.url, state.isLoading]);

  // Play media
  const play = useCallback(async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.play();
        updateState({ isPlaying: true, isPaused: false, isStopped: false });
        logAction('playback_started', { fileName: state.currentFile?.name });
      } else if (videoRef.current) {
        await videoRef.current.play();
        updateState({ isPlaying: true, isPaused: false, isStopped: false });
        logAction('playback_started', { fileName: state.currentFile?.name });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateState({ error: `Failed to play: ${errorMessage}` });
      logger.error('Playback error', error instanceof Error ? error : new Error(errorMessage));
    }
  }, [state.currentFile, updateState, logAction]);

  // Pause media
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
    updateState({ isPlaying: false, isPaused: true });
    logAction('playback_paused', { fileName: state.currentFile?.name });
  }, [state.currentFile, updateState, logAction]);

  // Stop media
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    updateState({ 
      isPlaying: false, 
      isPaused: false, 
      isStopped: true, 
      currentTime: 0 
    });
    logAction('playback_stopped', { fileName: state.currentFile?.name });
  }, [state.currentFile, updateState, logAction]);

  // Previous track
  const previous = useCallback(() => {
    if (playlist.length === 0 || currentIndex <= 0) return;
    const newIndex = currentIndex - 1;
    const prevItem = playlist[newIndex];
    if (prevItem) {
      setCurrentIndex(newIndex);
      loadMedia(prevItem);
      logAction('previous_track', { newIndex, fileName: prevItem.name });
    }
  }, [playlist, currentIndex, loadMedia, logAction]);

  // Next track
  const next = useCallback(() => {
    if (playlist.length === 0 || currentIndex >= playlist.length - 1) return;
    const newIndex = currentIndex + 1;
    const nextItem = playlist[newIndex];
    if (nextItem) {
      setCurrentIndex(newIndex);
      loadMedia(nextItem);
      logAction('next_track', { newIndex, fileName: nextItem.name });
    }
  }, [playlist, currentIndex, loadMedia, logAction]);

  // Handle time update
  const handleTimeUpdate = useCallback(() => {
    const element = audioRef.current || videoRef.current;
    if (element) {
      updateState({ currentTime: element.currentTime });
    }
  }, [updateState]);

  // Handle duration change
  const handleDurationChange = useCallback(() => {
    const element = audioRef.current || videoRef.current;
    if (element) {
      updateState({ duration: element.duration });
    }
  }, [updateState]);

  // Handle seek
  const handleSeek = useCallback((event: Event, value: number | number[]) => {
    const time = Array.isArray(value) ? value[0] : value;
    const element = audioRef.current || videoRef.current;
    if (element && typeof time === 'number') {
      element.currentTime = time;
      updateState({ currentTime: time });
      logAction('seek', { time, fileName: state.currentFile?.name });
    }
  }, [state.currentFile, updateState, logAction]);

  // Handle volume change
  const handleVolumeChange = useCallback((event: Event, value: number | number[]) => {
    const volume = Array.isArray(value) ? value[0] : value;
    const element = audioRef.current || videoRef.current;
    if (element && typeof volume === 'number') {
      element.volume = volume;
      updateState({ volume, isMuted: volume === 0 });
      logAction('volume_changed', { volume });
    }
  }, [updateState, logAction]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const element = audioRef.current || videoRef.current;
    if (element) {
      const newMuted = !state.isMuted;
      element.muted = newMuted;
      updateState({ isMuted: newMuted });
      logAction('mute_toggled', { muted: newMuted });
    }
  }, [state.isMuted, updateState, logAction]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    // For videos, fullscreen the video element itself
    // For audio, fullscreen the entire player container
    const isVideo = state.currentFile?.type.startsWith('video/');
    const targetElement = isVideo && videoRef.current ? videoRef.current : containerRef.current;
    
    if (!targetElement) return;

    if (!state.isFullscreen) {
      if (targetElement.requestFullscreen) {
        targetElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    updateState({ isFullscreen: !state.isFullscreen });
    logAction('fullscreen_toggled', { fullscreen: !state.isFullscreen, target: isVideo ? 'video' : 'player' });
  }, [state.isFullscreen, updateState, logAction, state.currentFile?.type]);

  // Format time
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle media ended
  const handleMediaEnded = useCallback(() => {
    updateState({ isPlaying: false, isPaused: false, isStopped: true });
    logAction('playback_ended', { fileName: state.currentFile?.name });
    
    // Auto-play next track if available
    if (currentIndex < playlist.length - 1) {
      setTimeout(() => next(), 1000);
    }
  }, [currentIndex, playlist.length, next, state.currentFile, updateState, logAction]);

  // Handle media loaded
  const handleMediaLoaded = useCallback(() => {
    updateState({ isLoading: false });
    logAction('media_ready', { fileName: state.currentFile?.name });
    
    // Auto-play if this was triggered by playlist selection
    if (state.currentFile && currentIndex >= 0) {
      setTimeout(() => {
        if (audioRef.current || videoRef.current) {
          play();
        }
      }, 200);
    }
  }, [state.currentFile, currentIndex, updateState, logAction, play]);

  // Handle media error
  const handleMediaError = useCallback((error: React.SyntheticEvent<HTMLAudioElement | HTMLVideoElement, Event>) => {
    const target = error.target as HTMLAudioElement | HTMLVideoElement;
    let errorMessage = 'Media playback error';
    
    if (target.error) {
      switch (target.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Media playback was aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading media';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'Media decoding error - file may be corrupted';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Media format not supported by browser';
          break;
        default:
          errorMessage = `Media error: ${target.error.message || 'Unknown error'}`;
      }
    }
    
    updateState({ error: errorMessage, isLoading: false });
    logger.error('Media error', new Error(errorMessage), {
      metadata: { 
        fileName: state.currentFile?.name,
        fileType: state.currentFile?.type,
        errorCode: target.error?.code,
        errorMessage: target.error?.message
      }
    });
  }, [state.currentFile, updateState]);

  // Effects
  useEffect(() => {
    const handleFullscreenChange = () => {
      updateState({ isFullscreen: !!document.fullscreenElement });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [updateState]);

  // Playlist management methods
  const handleMediaSelect = useCallback((index: number) => {
    const selectedItem = playlist[index];
    if (selectedItem) {
      setCurrentIndex(index);
      loadMedia(selectedItem);
      logAction('playlist_item_selected', { fileName: selectedItem.name, index });
    }
  }, [playlist, loadMedia, logAction]);

  const handleMediaRemove = useCallback((index: number) => {
    const removedFile = playlist[index];
    if (!removedFile) return;
    
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    
    // Clean up URL
    URL.revokeObjectURL(removedFile.url);
    
    // Adjust current index if needed
    if (index === currentIndex) {
      if (newPlaylist.length === 0) {
        setCurrentIndex(-1);
        updateState({ currentFile: null, isPlaying: false, isPaused: false, isStopped: true });
      } else if (index >= newPlaylist.length) {
        const lastItem = newPlaylist[newPlaylist.length - 1];
        if (lastItem) {
          setCurrentIndex(newPlaylist.length - 1);
          loadMedia(lastItem);
        }
      } else {
        const currentItem = newPlaylist[index];
        if (currentItem) {
          loadMedia(currentItem);
        }
      }
    } else if (index < currentIndex) {
      setCurrentIndex(currentIndex - 1);
    }
    
    logAction('playlist_item_removed', { fileName: removedFile.name, index });
  }, [playlist, currentIndex, loadMedia, updateState, logAction]);

  const handlePlaylistReorder = useCallback((newOrder: MediaInfo[]) => {
    setPlaylist(newOrder);
    logAction('playlist_reordered', { newOrder: newOrder.map(item => item.name) });
  }, [logAction]);

  const handlePlaylistClear = useCallback(() => {
    // Clean up all URLs
    playlist.forEach(file => {
      URL.revokeObjectURL(file.url);
    });
    
    setPlaylist([]);
    setCurrentIndex(-1);
    updateState({ currentFile: null, isPlaying: false, isPaused: false, isStopped: true });
    logAction('playlist_cleared');
  }, [playlist, updateState, logAction]);

  const handlePlaylistExport = useCallback(() => {
    const playlistData = {
      name: 'MediaPlayer Playlist',
      created: new Date().toISOString(),
      items: playlist.map(item => ({
        name: item.name,
        type: item.type,
        size: item.size,
        metadata: item.metadata
      }))
    };
    
    const blob = new Blob([JSON.stringify(playlistData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playlist.json';
    a.click();
    URL.revokeObjectURL(url);
    
    logAction('playlist_exported', { itemCount: playlist.length });
  }, [playlist, logAction]);

  const handlePlaylistImport = useCallback((files: MediaInfo[]) => {
    setPlaylist(prev => [...prev, ...files]);
    if (currentIndex === -1 && files.length > 0) {
      const firstFile = files[0];
      if (firstFile) {
        setCurrentIndex(playlist.length);
        loadMedia(firstFile);
      }
    }
    logAction('playlist_imported', { count: files.length });
  }, [currentIndex, playlist.length, loadMedia, logAction]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      playlist.forEach(file => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, [playlist]);

  const isAudio = state.currentFile?.type.startsWith('audio/');
  const isVideo = state.currentFile?.type.startsWith('video/');

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        maxWidth: 1200,
        mx: 'auto',
        minHeight: '100vh',
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
      }}
    >
      {/* Header with Menu */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AppBar 
          position="static" 
          sx={{ 
            mb: 4, 
            borderRadius: 2, 
            mt: 2,
            background: `linear-gradient(135deg, 
              ${theme.palette.primary.main}90 0%, 
              ${theme.palette.secondary.main}90 100%)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme.palette.primary.main}30`,
            boxShadow: theme.palette.mode === 'dark'
              ? `0 8px 32px ${theme.palette.primary.main}20`
              : `0 8px 32px ${theme.palette.primary.main}15`,
            color: 'white'
          }}
        >
          <Toolbar sx={{ width: '100%', maxWidth: 1200, mx: 'auto', py: 1 }}>
            <Box sx={{ mr: 3 }}>
              <AnimatedLogo size={40} showText />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {/* Theme toggle in app bar */}
            {onToggleTheme && (
              <IconButton color="inherit" onClick={onToggleTheme} aria-label="toggle theme">
                {isDark ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            )}
            <IconButton color="inherit">
              <Search />
            </IconButton>
            <IconButton color="inherit" onClick={() => navigate('/profile')} sx={{ p: 0.5 }}>
              <Avatar 
                src={profilePicture || undefined}
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.main'
                }}
              >
                <AccountCircle sx={{ fontSize: '1.5rem' }} />
              </Avatar>
            </IconButton>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Navigation Breadcrumbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Breadcrumbs sx={{ mb: 3, px: 3 }}>
          <Link underline="hover" color="inherit" href="/">
            <Home sx={{ mr: 0.5, fontSize: 'inherit' }} />
            MediaPlayer
          </Link>
          <Typography color="text.primary">Main Application</Typography>
        </Breadcrumbs>
      </motion.div>

      <Box sx={{ px: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              textShadow: theme.palette.mode === 'dark'
                ? '0 4px 20px rgba(255, 255, 255, 0.1)'
                : '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
          >
            MediaPlayer
          </Typography>


        {/* File Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <DragAndDrop onFilesSelected={handleFilesSelected} />
        </motion.div>

        {/* Main Content Layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Media Player Column */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '2 1 0%' } }}>
            <AnimatePresence>
              {state.currentFile && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  <GlassCard sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {state.currentFile.metadata?.title || state.currentFile.name}
                  </Typography>
                  
                  {/* Media Element */}
                  <Box sx={{ position: 'relative', mb: 2 }}>
                                         {isAudio && (
                       <AudioEl
                         key={`audio-${state.currentFile?.name}`}
                         ref={audioRef}
                         src={state.currentFile.url}
                         onTimeUpdate={handleTimeUpdate}
                         onDurationChange={handleDurationChange}
                         onEnded={handleMediaEnded}
                         onLoadedData={handleMediaLoaded}
                         onError={handleMediaError}
                         preload="metadata"
                       />
                     )}
                     
                     {isVideo && (
                       <VideoEl
                         key={`video-${state.currentFile?.name}`}
                         ref={videoRef}
                         src={state.currentFile.url}
                         onTimeUpdate={handleTimeUpdate}
                         onDurationChange={handleDurationChange}
                         onEnded={handleMediaEnded}
                         onLoadedData={handleMediaLoaded}
                         onError={handleMediaError}
                         onDoubleClick={toggleFullscreen}
                         controls={false}
                         preload="metadata"
                         title="Double-click to toggle fullscreen"
                       />
                     )}

                    {state.isLoading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    )}
                  </Box>

                  {/* Error Display */}
                  {state.error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {state.error}
                    </Alert>
                  )}

                  {/* Progress Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Slider
                      value={state.currentTime}
                      max={state.duration || 100}
                      onChange={handleSeek}
                      disabled={state.isLoading}
                      sx={{ 
                        mb: 1,
                        '& .MuiSlider-thumb': {
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.2)',
                            boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
                          }
                        },
                        '& .MuiSlider-track': {
                          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          border: 'none',
                          height: 6,
                          borderRadius: 3,
                        },
                        '& .MuiSlider-rail': {
                          background: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                          height: 6,
                          borderRadius: 3,
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">
                        {formatTime(state.currentTime)}
                      </Typography>
                      <Typography variant="body2">
                        {formatTime(state.duration)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Controls */}
                  <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                    <ControlButton
                      onClick={previous}
                      disabled={currentIndex <= 0}
                      size="large"
                    >
                      <SkipPrevious />
                    </ControlButton>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ControlButton
                        onClick={state.isPlaying ? pause : play}
                        disabled={state.isLoading || !!state.error}
                        size="large"
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          color: 'white',
                          width: 64,
                          height: 64,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                            transform: 'scale(1.05)',
                            boxShadow: `0 8px 30px ${theme.palette.primary.main}60`,
                          }
                        }}
                      >
                        {state.isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                      </ControlButton>
                    </motion.div>
                    
                    <ControlButton
                      onClick={stop}
                      disabled={state.isStopped}
                      size="large"
                    >
                      <Stop />
                    </ControlButton>
                    
                    <ControlButton
                      onClick={next}
                      disabled={currentIndex >= playlist.length - 1}
                      size="large"
                    >
                      <SkipNext />
                    </ControlButton>
                  </Stack>

                  {/* Secondary Controls */}
                  <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      minWidth: 200,
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '12px',
                      p: 1,
                      border: `1px solid ${theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)'}`
                    }}>
                      <VolumeUp sx={{ mr: 1 }} />
                      <Slider
                        value={state.isMuted ? 0 : state.volume}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={handleVolumeChange}
                        sx={{ 
                          flex: 1,
                          '& .MuiSlider-thumb': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
                          },
                          '& .MuiSlider-track': {
                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          }
                        }}
                      />
                      <ControlButton onClick={toggleMute} size="small">
                        {state.isMuted ? <VolumeOff /> : <VolumeUp />}
                      </ControlButton>
                    </Box>

                    <Tooltip title={state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                      <ControlButton onClick={toggleFullscreen}>
                        {state.isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                      </ControlButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Playlist Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 0%' }, minWidth: { lg: '300px' } }}>
              <Playlist
              mediaList={playlist}
              currentIndex={currentIndex}
              onMediaSelect={handleMediaSelect}
              onMediaRemove={handleMediaRemove}
              onPlaylistReorder={handlePlaylistReorder}
              onPlaylistClear={handlePlaylistClear}
              onPlaylistExport={handlePlaylistExport}
              onPlaylistImport={handlePlaylistImport}
              />
            </Box>
          </motion.div>
        </Box>

        {/* Instructions */}
        <AnimatePresence>
          {playlist.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <GlassPaper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to MediaPlayer
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Drag and drop audio or video files above to start playing. Supported formats include:
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              {['MP3', 'WAV', 'MP4', 'AVI', 'MKV'].map((format, index) => (
                <motion.div
                  key={format}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                >
                  <Chip 
                    label={format} 
                    color="primary" 
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      color: 'white',
                      fontWeight: 600,
                      boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 16px ${theme.palette.primary.main}40`,
                      }
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Your playlist will appear on the right side once you add files
            </Typography>
              </GlassPaper>
            </motion.div>
          )}
        </AnimatePresence>
         </motion.div>
       </Box>

       {/* Dropdown Menu */}
       <Menu
         anchorEl={menuAnchorEl}
         open={Boolean(menuAnchorEl)}
         onClose={handleMenuClose}
         sx={{
           '& .MuiPaper-root': {
             background: `linear-gradient(135deg, 
               ${theme.palette.mode === 'dark' 
                 ? 'rgba(30, 30, 30, 0.95)' 
                 : 'rgba(255, 255, 255, 0.95)'} 0%,
               ${theme.palette.primary.main}10 100%)`,
             backdropFilter: 'blur(20px)',
             border: `1px solid ${theme.palette.primary.main}20`,
             boxShadow: theme.palette.mode === 'dark'
               ? `0 8px 32px ${theme.palette.primary.main}20`
               : `0 8px 32px ${theme.palette.primary.main}15`,
             borderRadius: 2,
           }
         }}
       >
         <MenuItem onClick={() => { navigate('/showcase'); handleMenuClose(); }}>
           <PlayCircle sx={{ mr: 2 }} />
           View Showcase
         </MenuItem>
         <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
           <SettingsIcon sx={{ mr: 2 }} />
           Settings
         </MenuItem>
         <MenuItem onClick={() => { navigate('/about'); handleMenuClose(); }}>
           <InfoIcon sx={{ mr: 2 }} />
           About
         </MenuItem>
       </Menu>
     </Box>
   );
 };
