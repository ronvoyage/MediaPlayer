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
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipPrevious,
  SkipNext,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { logger } from '../services/logger';
import type { MediaInfo } from '../services/mediaPlayer';
import { DragAndDrop } from './DragAndDrop';
import { Playlist } from './Playlist';
import { mediaPlayerService } from '../services/mediaPlayer';

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
  maxHeight: 400
}));

export const MediaPlayer: React.FC = () => {
  const [state, setState] = useState<MediaPlayerState>(initialState);
  const [playlist, setPlaylist] = useState<MediaInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update state helper
  const updateState = useCallback((updates: Partial<MediaPlayerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Log user actions
  const logAction = useCallback((action: string, details?: any) => {
    logger.userAction(action, 'MediaPlayer', details);
  }, []);

  // Handle file selection from DragAndDrop
  const handleFilesSelected = useCallback((files: MediaInfo[]) => {
    setPlaylist(prev => [...prev, ...files]);
    if (currentIndex === -1 && files.length > 0) {
      const firstFile = files[0];
      if (firstFile) {
        setCurrentIndex(0);
        loadMedia(firstFile);
      }
    }

    logAction('files_selected', { count: files.length, fileTypes: files.map(f => f.type) });
  }, [currentIndex, logAction]);

  // Load media file
  const loadMedia = useCallback((file: MediaInfo) => {
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

    logAction('media_loaded', { fileName: file.name, fileType: file.type });
  }, [updateState, logAction]);

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
    if (!containerRef.current) return;

    if (!state.isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    updateState({ isFullscreen: !state.isFullscreen });
    logAction('fullscreen_toggled', { fullscreen: !state.isFullscreen });
  }, [state.isFullscreen, updateState, logAction]);

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
    const errorMessage = 'Media playback error';
    updateState({ error: errorMessage, isLoading: false });
    logger.error('Media error', new Error(errorMessage));
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

  return (
    <Box
      ref={containerRef}
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
          MediaPlayer
        </Typography>

        {/* File Input */}
        <DragAndDrop onFilesSelected={handleFilesSelected} />

        {/* Main Content Layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Media Player Column */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '2 1 0%' } }}>
            {state.currentFile && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {state.currentFile.metadata?.title || state.currentFile.name}
                  </Typography>
                  
                  {/* Media Element */}
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    {isAudio && (
                      <AudioEl
                        ref={audioRef}
                        src={state.currentFile.url}
                        onTimeUpdate={handleTimeUpdate}
                        onDurationChange={handleDurationChange}
                        onEnded={handleMediaEnded}
                        onLoadedData={handleMediaLoaded}
                        onError={handleMediaError}
                      />
                    )}
                    
                    {isVideo && (
                      <VideoEl
                        ref={videoRef}
                        src={state.currentFile.url}
                        onTimeUpdate={handleTimeUpdate}
                        onDurationChange={handleDurationChange}
                        onEnded={handleMediaEnded}
                        onLoadedData={handleMediaLoaded}
                        onError={handleMediaError}
                        controls={false}
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
                      sx={{ mb: 1 }}
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
                    <IconButton
                      onClick={previous}
                      disabled={currentIndex <= 0}
                      size="large"
                    >
                      <SkipPrevious />
                    </IconButton>
                    
                    <IconButton
                      onClick={state.isPlaying ? pause : play}
                      disabled={state.isLoading || !!state.error}
                      size="large"
                      color="primary"
                    >
                      {state.isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    
                    <IconButton
                      onClick={stop}
                      disabled={state.isStopped}
                      size="large"
                    >
                      <Stop />
                    </IconButton>
                    
                    <IconButton
                      onClick={next}
                      disabled={currentIndex >= playlist.length - 1}
                      size="large"
                    >
                      <SkipNext />
                    </IconButton>
                  </Stack>

                  {/* Secondary Controls */}
                  <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
                      <VolumeUp sx={{ mr: 1 }} />
                      <Slider
                        value={state.isMuted ? 0 : state.volume}
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={handleVolumeChange}
                        sx={{ flex: 1 }}
                      />
                      <IconButton onClick={toggleMute} size="small">
                        {state.isMuted ? <VolumeOff /> : <VolumeUp />}
                      </IconButton>
                    </Box>

                    <IconButton onClick={toggleFullscreen}>
                      {state.isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Playlist Column */}
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
        </Box>

        {/* Instructions */}
        {playlist.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to MediaPlayer
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Drag and drop audio or video files above to start playing. Supported formats include:
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Chip label="MP3" color="primary" />
              <Chip label="WAV" color="primary" />
              <Chip label="MP4" color="primary" />
              <Chip label="AVI" color="primary" />
              <Chip label="MKV" color="primary" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Your playlist will appear on the right side once you add files
            </Typography>
          </Paper>
        )}
      </motion.div>
    </Box>
  );
};
