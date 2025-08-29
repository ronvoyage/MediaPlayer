import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Stack,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  PlayArrow,
  Delete,
  Edit,
  MoreVert,
  ClearAll,
  FileDownload,
  FileUpload,
  Shuffle,
  Repeat,
  RepeatOne,
  QueueMusic,
  MusicNote,
  VideoFile,
  DragIndicator,
  PlaylistPlay,
  PlaylistAdd
} from '@mui/icons-material';
import { motion, Reorder } from 'framer-motion';
import type { MediaInfo, MediaMetadata } from '../services/mediaPlayer';
import { mediaPlayerService } from '../services/mediaPlayer';
import { logger } from '../services/logger';

interface PlaylistProps {
  mediaList: MediaInfo[];
  currentIndex: number;
  onMediaSelect: (index: number) => void;
  onMediaRemove: (index: number) => void;
  onPlaylistReorder: (newOrder: MediaInfo[]) => void;
  onPlaylistClear: () => void;
  onPlaylistExport: () => void;
  onPlaylistImport: (files: MediaInfo[]) => void;
}

export const Playlist: React.FC<PlaylistProps> = ({
  mediaList,
  currentIndex,
  onMediaSelect,
  onMediaRemove,
  onPlaylistReorder,
  onPlaylistClear,
  onPlaylistExport,
  onPlaylistImport
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editMetadata, setEditMetadata] = useState<MediaMetadata>({});
  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'all' | 'one'>('none');

  // Log user actions
  const logAction = useCallback((action: string, details?: any) => {
    logger.userAction(action, 'Playlist', details);
  }, []);

  // Handle menu open
  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemIndex(index);
  }, []);

  // Handle menu close
  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedItemIndex(-1);
  }, []);

  // Handle edit metadata
  const handleEditMetadata = useCallback(() => {
    if (selectedItemIndex >= 0 && selectedItemIndex < mediaList.length) {
      const item = mediaList[selectedItemIndex];
      setEditMetadata(item.metadata || {});
      setEditDialogOpen(true);
    }
    handleMenuClose();
  }, [mediaList, selectedItemIndex, handleMenuClose]);

  // Handle save metadata
  const handleSaveMetadata = useCallback(() => {
    if (selectedItemIndex >= 0 && selectedItemIndex < mediaList.length) {
      const item = mediaList[selectedItemIndex];
      const updatedItem = { ...item, metadata: editMetadata };
      const updatedList = [...mediaList];
      updatedList[selectedItemIndex] = updatedItem;
      onPlaylistReorder(updatedList);
      logAction('metadata_updated', { fileName: item.name, metadata: editMetadata });
    }
    setEditDialogOpen(false);
  }, [mediaList, selectedItemIndex, editMetadata, onPlaylistReorder, logAction]);

  // Handle shuffle toggle
  const handleShuffleToggle = useCallback(() => {
    setShuffleMode(!shuffleMode);
    logAction('shuffle_toggled', { enabled: !shuffleMode });
  }, [shuffleMode, logAction]);

  // Handle repeat mode change
  const handleRepeatModeChange = useCallback((mode: 'none' | 'all' | 'one') => {
    setRepeatMode(mode);
    logAction('repeat_mode_changed', { mode });
  }, [logAction]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const audioCount = mediaList.filter(item => item.type.startsWith('audio/')).length;
    const videoCount = mediaList.filter(item => item.type.startsWith('video/')).length;
    const totalSize = mediaList.reduce((sum, item) => sum + item.size, 0);
    const totalDuration = mediaList.reduce((sum, item) => sum + (item.duration || 0), 0);
    const averageDuration = mediaList.length > 0 ? totalDuration / mediaList.length : 0;

    return { audioCount, videoCount, totalSize, totalDuration, averageDuration };
  }, [mediaList]);

  // Format duration
  const formatDuration = useCallback((seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '0:00';
    return mediaPlayerService.formatDuration(seconds);
  }, []);

  // Get media icon
  const getMediaIcon = useCallback((type: string) => {
    if (type.startsWith('audio/')) {
      return <MusicNote color="primary" />;
    } else if (type.startsWith('video/')) {
      return <VideoFile color="secondary" />;
    }
    return <MusicNote />;
  }, []);

  // Get media type label
  const getMediaTypeLabel = useCallback((type: string): string => {
    if (type.startsWith('audio/')) {
      return type.split('/')[1].toUpperCase();
    } else if (type.startsWith('video/')) {
      return type.split('/')[1].toUpperCase();
    }
    return 'Unknown';
  }, []);

  // Handle reorder
  const handleReorder = useCallback((newOrder: MediaInfo[]) => {
    onPlaylistReorder(newOrder);
    logAction('playlist_reordered', { newOrder: newOrder.map(item => item.name) });
  }, [onPlaylistReorder, logAction]);

  // Handle play button click - immediately play the selected media
  const handlePlayClick = useCallback((index: number) => {
    onMediaSelect(index);
    logAction('playlist_item_play', { fileName: mediaList[index].name, index });
  }, [onMediaSelect, mediaList, logAction]);

  if (mediaList.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <QueueMusic sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Playlist is Empty
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add media files to get started
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Drag and drop audio or video files above
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Playlist Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.default', flexShrink: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Playlist
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {mediaList.length} items
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Shuffle">
              <IconButton
                onClick={handleShuffleToggle}
                color={shuffleMode ? 'primary' : 'default'}
                size="small"
              >
                <Shuffle />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Repeat">
              <IconButton
                onClick={() => {
                  const modes: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
                  const currentIndex = modes.indexOf(repeatMode);
                  const nextMode = modes[(currentIndex + 1) % modes.length];
                  handleRepeatModeChange(nextMode);
                }}
                color={repeatMode !== 'none' ? 'primary' : 'default'}
                size="small"
              >
                {repeatMode === 'one' ? <RepeatOne /> : <Repeat />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Statistics */}
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={`${stats.audioCount} Audio`} 
            color="primary" 
            variant="outlined" 
            size="small"
          />
          <Chip 
            label={`${stats.videoCount} Video`} 
            color="secondary" 
            variant="outlined" 
            size="small"
          />
          <Chip 
            label={`Total: ${mediaPlayerService.formatFileSize(stats.totalSize)}`} 
            variant="outlined" 
            size="small"
          />
        </Stack>

        {/* Actions */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ClearAll />}
            onClick={() => {
              onPlaylistClear();
              logAction('playlist_cleared');
            }}
          >
            Clear All
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownload />}
            onClick={() => {
              onPlaylistExport();
              logAction('playlist_exported');
            }}
          >
            Export
          </Button>
        </Stack>
      </Box>

      {/* Playlist Items */}
      <Box sx={{ flex: 1, overflow: 'auto', width: '100%', minWidth: 0 }}>
        <Reorder.Group
          axis="y"
          values={mediaList}
          onReorder={handleReorder}
          style={{ width: '100%', minWidth: 0 }}
        >
          {mediaList.map((item, index) => (
            <Reorder.Item
              key={`${item.name}-${index}`}
              value={item}
              whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', minWidth: 0 }}
            >
              <ListItem
                sx={{
                  border: index === currentIndex ? '2px solid' : '1px solid',
                  borderColor: index === currentIndex ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  mb: 1,
                  mx: 1,
                  width: 'calc(100% - 16px)',
                  maxWidth: 'calc(100% - 16px)',
                  minWidth: 0,
                  backgroundColor: index === currentIndex ? 'primary.light' : 'background.paper',
                  '&:hover': {
                    backgroundColor: index === currentIndex ? 'primary.light' : 'action.hover'
                  }
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ bgcolor: index === currentIndex ? 'primary.main' : 'grey.300' }}>
                    {getMediaIcon(item.type)}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  sx={{ minWidth: 0, flex: 1 }}
                  primary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: index === currentIndex ? 'bold' : 'normal',
                        color: index === currentIndex ? 'primary.contrastText' : 'text.primary',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.metadata?.title || item.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ minWidth: 0, maxWidth: '100%' }}>
                      {item.metadata?.artist && (
                        <Typography 
                          variant="caption" 
                          component="div" 
                          color="text.secondary" 
                          sx={{ 
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {item.metadata.artist}
                        </Typography>
                      )}
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center" 
                        sx={{ 
                          mt: 0.5, 
                          flexWrap: 'wrap',
                          minWidth: 0
                        }}
                      >
                        <Chip
                          label={getMediaTypeLabel(item.type)}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {mediaPlayerService.formatFileSize(item.size)}
                        </Typography>
                        {item.duration && (
                          <Typography variant="caption" color="text.secondary">
                            {formatDuration(item.duration)}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  }
                />

                <ListItemSecondaryAction sx={{ flexShrink: 0 }}>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Play">
                      <IconButton
                        onClick={() => handlePlayClick(index)}
                        color={index === currentIndex ? 'primary' : 'default'}
                        size="small"
                        sx={{ 
                          backgroundColor: index === currentIndex ? 'primary.main' : 'transparent',
                          color: index === currentIndex ? 'white' : 'inherit',
                          '&:hover': {
                            backgroundColor: index === currentIndex ? 'primary.dark' : 'action.hover'
                          }
                        }}
                      >
                        <PlayArrow />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="More options">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, index)}
                        size="small"
                      >
                        <MoreVert />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </Box>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditMetadata}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Metadata
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedItemIndex >= 0) {
            onMediaRemove(selectedItemIndex);
            logAction('playlist_item_removed', { 
              fileName: mediaList[selectedItemIndex].name, 
              index: selectedItemIndex 
            });
          }
          handleMenuClose();
        }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Remove
        </MenuItem>
      </Menu>

      {/* Edit Metadata Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Metadata</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={editMetadata.title || ''}
              onChange={(e) => setEditMetadata(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Artist"
              value={editMetadata.artist || ''}
              onChange={(e) => setEditMetadata(prev => ({ ...prev, artist: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Album"
              value={editMetadata.album || ''}
              onChange={(e) => setEditMetadata(prev => ({ ...prev, album: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Year"
              value={editMetadata.year || ''}
              onChange={(e) => setEditMetadata(prev => ({ 
                ...prev, 
                year: e.target.value ? parseInt(e.target.value) : undefined 
              }))}
              type="number"
              fullWidth
            />
            <TextField
              label="Genre"
              value={editMetadata.genre || ''}
              onChange={(e) => setEditMetadata(prev => ({ ...prev, genre: e.target.value }))}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMetadata} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
