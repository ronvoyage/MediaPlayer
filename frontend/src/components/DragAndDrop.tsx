import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { CloudUpload, MusicNote, VideoFile, InsertDriveFile } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { MediaInfo } from '../services/mediaPlayer';
import { mediaPlayerService } from '../services/mediaPlayer';
import { logger } from '../services/logger';

interface DragAndDropProps {
  onFilesSelected: (files: MediaInfo[]) => void;
  disabled?: boolean;
}

export const DragAndDrop: React.FC<DragAndDropProps> = ({ 
  onFilesSelected, 
  disabled = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Log user actions
  const logAction = useCallback((action: string, details?: any) => {
    logger.userAction(action, 'DragAndDrop', details);
  }, []);

  // Handle drag enter
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
      logAction('drag_enter', { itemCount: e.dataTransfer.items.length });
    }
  }, [logAction]);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragOver(false);
      logAction('drag_leave');
    }
  }, [dragCounter, logAction]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle drop
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragOver(false);
    setDragCounter(0);
    setErrors([]);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    logAction('files_dropped', { count: files.length });

    // Validate and process files
    setIsProcessing(true);
    const validFiles: MediaInfo[] = [];
    const newErrors: string[] = [];

    for (const file of files) {
      try {
        // Validate file
        const validation = mediaPlayerService.validateMediaFile(file);
        if (!validation.isValid) {
          newErrors.push(`${file.name}: ${validation.errors.join(', ')}`);
          continue;
        }

        // Create media info
        const mediaInfo = await mediaPlayerService.createMediaInfo(file);
        if (mediaInfo.error) {
          newErrors.push(`${file.name}: ${mediaInfo.error}`);
        } else {
          validFiles.push(mediaInfo);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        newErrors.push(`${file.name}: ${errorMessage}`);
        logger.error('File processing error', new Error(errorMessage), { metadata: { fileName: file.name } });
      }
    }

    setErrors(newErrors);
    setIsProcessing(false);

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
      logAction('files_processed', { 
        validCount: validFiles.length, 
        errorCount: newErrors.length 
      });
    }
  }, [onFilesSelected, logAction]);

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (disabled) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'audio/*,video/*';
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;

      const files = Array.from(target.files);
      logAction('files_selected_via_click', { count: files.length });

      // Process files the same way as drop
      setIsProcessing(true);
      const validFiles: MediaInfo[] = [];
      const newErrors: string[] = [];

      for (const file of files) {
        try {
          const validation = mediaPlayerService.validateMediaFile(file);
          if (!validation.isValid) {
            newErrors.push(`${file.name}: ${validation.errors.join(', ')}`);
            continue;
          }

          const mediaInfo = await mediaPlayerService.createMediaInfo(file);
          if (mediaInfo.error) {
            newErrors.push(`${file.name}: ${mediaInfo.error}`);
          } else {
            validFiles.push(mediaInfo);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          newErrors.push(`${file.name}: ${errorMessage}`);
        }
      }

      setErrors(newErrors);
      setIsProcessing(false);

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    };
    input.click();
  }, [disabled, onFilesSelected, logAction]);

  // Get supported formats for display
  const supportedFormats = mediaPlayerService.getSupportedFormats();
  const audioFormats = supportedFormats.filter(f => f.startsWith('audio/'));
  const videoFormats = supportedFormats.filter(f => f.startsWith('video/'));

  return (
    <Paper
      ref={dropZoneRef}
      sx={{
        p: 4,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative',
        border: '2px dashed',
        borderColor: isDragOver ? 'primary.main' : 'divider',
        backgroundColor: isDragOver ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: disabled ? 'divider' : 'primary.main',
          backgroundColor: disabled ? 'background.paper' : 'action.hover'
        }
      }}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          >
            <CircularProgress size={60} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{
          opacity: isProcessing ? 0.3 : 1,
          scale: isProcessing ? 0.95 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <CloudUpload 
          sx={{ 
            fontSize: 64, 
            color: isDragOver ? 'primary.main' : 'text.secondary',
            mb: 2 
          }} 
        />
        
        <Typography variant="h5" gutterBottom>
          {isDragOver ? 'Drop files here' : 'Drag & Drop Media Files'}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          or click to browse files
        </Typography>

        {/* Supported Formats */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Supported Formats
          </Typography>
          
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
            <Chip 
              icon={<MusicNote />} 
              label={`Audio (${audioFormats.length})`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<VideoFile />} 
              label={`Video (${videoFormats.length})`} 
              color="secondary" 
              variant="outlined"
            />
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            {supportedFormats.slice(0, 8).map((format) => (
              <Chip
                key={format}
                label={format.split('/')[1].toUpperCase()}
                size="small"
                variant="outlined"
              />
            ))}
            {supportedFormats.length > 8 && (
              <Chip
                label={`+${supportedFormats.length - 8} more`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>

        {/* Instructions */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Tip:</strong> You can drag multiple files at once. 
            Maximum file size: 2GB per file.
          </Typography>
        </Box>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Box sx={{ mt: 3 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Some files could not be processed:
                </Typography>
              </Alert>
              <Stack spacing={1}>
                {errors.map((error, index) => (
                  <Alert key={index} severity="error" sx={{ fontSize: '0.875rem' }}>
                    {error}
                  </Alert>
                ))}
              </Stack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Paper>
  );
};
