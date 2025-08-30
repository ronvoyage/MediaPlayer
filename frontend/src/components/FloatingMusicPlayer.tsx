import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slider,
  Avatar,
  Paper,
  Collapse,
  Stack,
  useTheme,
  alpha,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  VolumeUp,
  VolumeOff,
  ExpandLess,
  ExpandMore,
  Close,
  MusicNote,
  Shuffle,
  Repeat,
  RepeatOne
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

export interface FloatingPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isExpanded: boolean;
  currentTrack: {
    title: string;
    artist: string;
    album?: string;
    artwork?: string;
    url: string;
  } | null;
  playlist: Array<{
    title: string;
    artist: string;
    album?: string;
    artwork?: string;
    url: string;
  }>;
  currentIndex: number;
  isVisible: boolean;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
}

interface FloatingMusicPlayerProps {
  state: FloatingPlayerState;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleExpanded: () => void;
  onClose: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

const FloatingContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1300,
  background: theme.palette.mode === 'dark'
    ? 'rgba(20, 20, 20, 0.95)'
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderTop: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 -8px 32px rgba(0, 0, 0, 0.4)'
    : '0 -8px 32px rgba(0, 0, 0, 0.1)',
}));

const CompactPlayer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  gap: theme.spacing(1),
  height: 64,
}));

const ExpandedPlayer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: `linear-gradient(135deg, 
    ${alpha(theme.palette.primary.main, 0.05)} 0%, 
    ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  border: `1px solid ${theme.palette.primary.main}20`,
  borderRadius: '50%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}25 0%, ${theme.palette.secondary.main}25 100%)`,
    boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
  },
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  width: 48,
  height: 48,
  '&:hover': {
    transform: 'scale(1.1)',
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
    boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
  },
}));

const ProgressSlider = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    '&:hover': {
      boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
    },
  },
  '& .MuiSlider-track': {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    border: 'none',
    height: 4,
  },
  '& .MuiSlider-rail': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)',
    height: 4,
  },
}));

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({
  state,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleExpanded,
  onClose,
  onToggleShuffle,
  onToggleRepeat
}) => {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (event: Event, value: number | number[]) => {
    const time = Array.isArray(value) ? value[0] : value;
    onSeek(time);
  };

  const handleVolumeChange = (event: Event, value: number | number[]) => {
    const volume = Array.isArray(value) ? value[0] : value;
    onVolumeChange(volume / 100);
  };

  const getRepeatIcon = () => {
    switch (state.repeat) {
      case 'one':
        return <RepeatOne />;
      case 'all':
        return <Repeat color="primary" />;
      default:
        return <Repeat />;
    }
  };

  if (!state.isVisible || !state.currentTrack) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <FloatingContainer elevation={8}>
          {/* Progress Bar (always visible) */}
          <LinearProgress
            variant="determinate"
            value={state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0}
            sx={{
              height: 2,
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              },
              '& .MuiLinearProgress-root': {
                background: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.1)',
              },
            }}
          />

          {/* Compact Player */}
          <CompactPlayer>
            {/* Track Info */}
            <Avatar
              src={state.currentTrack.artwork}
              sx={{ 
                width: 48, 
                height: 48,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
              }}
            >
              <MusicNote />
            </Avatar>
            
            <Box sx={{ flex: 1, minWidth: 0, ml: 1 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                {state.currentTrack.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {state.currentTrack.artist}
              </Typography>
            </Box>

            {/* Compact Controls */}
            <Stack direction="row" spacing={1} alignItems="center">
              <ControlButton size="small" onClick={onPrevious}>
                <SkipPrevious fontSize="small" />
              </ControlButton>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlayButton 
                  onClick={state.isPlaying ? onPause : onPlay}
                  size="small"
                >
                  {state.isPlaying ? <Pause /> : <PlayArrow />}
                </PlayButton>
              </motion.div>
              
              <ControlButton size="small" onClick={onNext}>
                <SkipNext fontSize="small" />
              </ControlButton>

              {/* Volume Control */}
              <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
                <ControlButton size="small" onClick={onToggleMute}>
                  {state.isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                </ControlButton>
                <Slider
                  size="small"
                  value={state.isMuted ? 0 : state.volume * 100}
                  onChange={handleVolumeChange}
                  sx={{ mx: 1, maxWidth: 80 }}
                />
              </Box>

              {/* Expand/Close Controls */}
              <Tooltip title={state.isExpanded ? "Minimize" : "Expand"}>
                <ControlButton onClick={onToggleExpanded}>
                  {state.isExpanded ? <ExpandMore /> : <ExpandLess />}
                </ControlButton>
              </Tooltip>
              
              <Tooltip title="Close player">
                <ControlButton onClick={onClose}>
                  <Close fontSize="small" />
                </ControlButton>
              </Tooltip>
            </Stack>
          </CompactPlayer>

          {/* Expanded Player */}
          <Collapse in={state.isExpanded}>
            <ExpandedPlayer>
              {/* Large Album Art and Track Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={state.currentTrack.artwork}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mr: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                  }}
                >
                  <MusicNote fontSize="large" />
                </Avatar>
                
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {state.currentTrack.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                    {state.currentTrack.artist}
                  </Typography>
                  {state.currentTrack.album && (
                    <Typography variant="body2" color="text.secondary">
                      {state.currentTrack.album}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Progress Slider */}
              <Box sx={{ mb: 2 }}>
                <ProgressSlider
                  value={state.currentTime}
                  max={state.duration || 100}
                  onChange={handleSeek}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">
                    {formatTime(state.currentTime)}
                  </Typography>
                  <Typography variant="caption">
                    {formatTime(state.duration)}
                  </Typography>
                </Box>
              </Box>

              {/* Extended Controls */}
              <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <Tooltip title={state.shuffle ? "Disable shuffle" : "Enable shuffle"}>
                  <ControlButton onClick={onToggleShuffle}>
                    <Shuffle color={state.shuffle ? "primary" : "inherit"} />
                  </ControlButton>
                </Tooltip>

                <ControlButton onClick={onPrevious}>
                  <SkipPrevious />
                </ControlButton>
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlayButton 
                    onClick={state.isPlaying ? onPause : onPlay}
                    sx={{ width: 64, height: 64 }}
                  >
                    {state.isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
                  </PlayButton>
                </motion.div>
                
                <ControlButton onClick={onNext}>
                  <SkipNext />
                </ControlButton>

                <Tooltip title={`Repeat: ${state.repeat}`}>
                  <ControlButton onClick={onToggleRepeat}>
                    {getRepeatIcon()}
                  </ControlButton>
                </Tooltip>
              </Stack>
            </ExpandedPlayer>
          </Collapse>
        </FloatingContainer>
      </motion.div>
    </AnimatePresence>
  );
};