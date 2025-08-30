import { logger } from './logger';

export interface MediaMetadata {
  title?: string;
  artist?: string;
  album?: string;
  year?: number;
  genre?: string;
  duration?: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
  codec?: string;
}

export interface MediaInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  url: string;
  metadata?: MediaMetadata;
  duration?: number;
  error?: string;
}

export class MediaPlayerService {
  private static instance: MediaPlayerService;
  private supportedFormats: Set<string>;

  private constructor() {
    this.supportedFormats = new Set([
      // Audio formats
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/flac',
      'audio/webm',
      // Video formats
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
      'video/mkv',
      'video/mov',
      'video/wmv'
    ]);
  }

  public static getInstance(): MediaPlayerService {
    if (!MediaPlayerService.instance) {
      MediaPlayerService.instance = new MediaPlayerService();
    }
    return MediaPlayerService.instance;
  }

  /**
   * Check if a file type is supported
   */
  public isFormatSupported(mimeType: string): boolean {
    return this.supportedFormats.has(mimeType);
  }



  /**
   * Get supported formats
   */
  public getSupportedFormats(): string[] {
    return Array.from(this.supportedFormats);
  }

  /**
   * Create a MediaInfo object from a File
   */
  public async createMediaInfo(file: File): Promise<MediaInfo> {
    const id = `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const url = URL.createObjectURL(file);

    const mediaInfo: MediaInfo = {
      id,
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      url
    };

    try {
      // Extract metadata and duration
      const metadata = await this.extractMetadata(file);
      mediaInfo.metadata = metadata;
      mediaInfo.duration = metadata.duration;

      logger.info('Media info created', { 
        metadata: { 
          fileName: file.name, 
          fileType: file.type, 
          fileSize: file.size,
          duration: metadata.duration 
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      mediaInfo.error = `Failed to extract metadata: ${errorMessage}`;
      logger.warn('Failed to extract metadata', { 
        metadata: { fileName: file.name },
        error: {
          name: 'MetadataExtractionError',
          message: errorMessage,
          stack: error instanceof Error ? error.stack || '' : ''
        }
      });
    }

    return mediaInfo;
  }

  /**
   * Extract metadata from a media file
   */
  private async extractMetadata(file: File): Promise<MediaMetadata> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const element = file.type.startsWith('audio/') 
        ? new Audio() 
        : document.createElement('video');

      const timeout = setTimeout(() => {
        reject(new Error('Metadata extraction timeout'));
      }, 10000);

      element.onloadedmetadata = () => {
        clearTimeout(timeout);
        
        const metadata: MediaMetadata = {
          duration: element.duration || undefined
        };

        // For audio files, try to extract additional metadata
        if (file.type.startsWith('audio/')) {
          this.extractAudioMetadata(file, metadata);
        }

        // For video files, try to extract additional metadata
        if (file.type.startsWith('video/')) {
          this.extractVideoMetadata(file, metadata);
        }

        URL.revokeObjectURL(url);
        resolve(metadata);
      };

      element.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load media for metadata extraction'));
      };

      element.src = url;
    });
  }

  /**
   * Extract audio-specific metadata
   */
  private extractAudioMetadata(file: File, metadata: MediaMetadata): void {
    // Basic audio metadata extraction
    // In a real implementation, you might use libraries like music-metadata
    // For now, we'll extract what we can from the filename
    
    const fileName = file.name.toLowerCase();
    
    // Try to extract artist and title from filename (e.g., "Artist - Title.mp3")
    if (fileName.includes(' - ')) {
      const parts = file.name.split(' - ');
      if (parts.length >= 2) {
        metadata.artist = parts[0].trim();
        metadata.title = parts[1].replace(/\.[^/.]+$/, '').trim(); // Remove extension
      }
    }

    // Try to extract year from filename (e.g., "Song (2023).mp3")
    const yearMatch = file.name.match(/\((\d{4})\)/);
    if (yearMatch) {
      metadata.year = parseInt(yearMatch[1], 10);
    }

    // Set codec based on file type
    if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
      metadata.codec = 'MP3';
    } else if (file.type === 'audio/wav') {
      metadata.codec = 'WAV';
    } else if (file.type === 'audio/ogg') {
      metadata.codec = 'OGG';
    } else if (file.type === 'audio/aac') {
      metadata.codec = 'AAC';
    } else if (file.type === 'audio/flac') {
      metadata.codec = 'FLAC';
    }
  }

  /**
   * Extract video-specific metadata
   */
  private extractVideoMetadata(file: File, metadata: MediaMetadata): void {
    // Basic video metadata extraction
    // In a real implementation, you might use libraries like ffprobe or similar
    
    // Set codec based on file type
    if (file.type === 'video/mp4') {
      metadata.codec = 'MP4';
    } else if (file.type === 'video/webm') {
      metadata.codec = 'WebM';
    } else if (file.type === 'video/ogg') {
      metadata.codec = 'OGG';
    } else if (file.type === 'video/avi') {
      metadata.codec = 'AVI';
    } else if (file.type === 'video/mkv') {
      metadata.codec = 'MKV';
    } else if (file.type === 'video/mov') {
      metadata.codec = 'MOV';
    } else if (file.type === 'video/wmv') {
      metadata.codec = 'WMV';
    }
  }

  /**
   * Validate a media file
   */
  public validateMediaFile(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      errors.push(`File size too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed: 500MB`);
    }

    // Check if file size is 0
    if (file.size === 0) {
      errors.push('File is empty (0 bytes)');
    }

    // Check MIME type
    if (!file.type || file.type === 'application/octet-stream') {
      // Try to detect type from extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension) {
        const detectedType = this.detectMimeTypeFromExtension(extension);
        if (detectedType) {
          // Update the file type
          Object.defineProperty(file, 'type', {
            value: detectedType,
            writable: true
          });
        } else {
          errors.push('Unsupported file format');
        }
      } else {
        errors.push('Unable to determine file type');
      }
    } else if (!this.isFormatSupported(file.type)) {
      errors.push(`Unsupported file type: ${file.type}`);
    }

    // Check file name
    if (!file.name || file.name.trim() === '') {
      errors.push('Invalid file name');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Detect MIME type from file extension
   */
  private detectMimeTypeFromExtension(extension: string): string | null {
    const mimeTypes: Record<string, string> = {
      // Audio
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'aac': 'audio/aac',
      'flac': 'audio/flac',
      'm4a': 'audio/mp4',
      'wma': 'audio/x-ms-wma',
      // Video
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'avi': 'video/x-msvideo',
      'mkv': 'video/x-matroska',
      'mov': 'video/quicktime',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv',
      '3gp': 'video/3gpp'
    };

    return mimeTypes[extension] || null;
  }

  /**
   * Format file size for display
   */
  public formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format duration for display
   */
  public formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    // This method can be used to clean up any resources
    // For now, it's a placeholder for future cleanup operations
    logger.info('MediaPlayerService cleanup completed');
  }

  /**
   * Get media statistics
   */
  public getMediaStats(mediaList: MediaInfo[]): {
    totalFiles: number;
    totalSize: number;
    audioCount: number;
    videoCount: number;
    averageDuration: number;
    supportedFormats: number;
    unsupportedFormats: number;
  } {
    const stats = {
      totalFiles: mediaList.length,
      totalSize: 0,
      audioCount: 0,
      videoCount: 0,
      averageDuration: 0,
      supportedFormats: 0,
      unsupportedFormats: 0
    };

    let totalDuration = 0;
    let durationCount = 0;

    mediaList.forEach(media => {
      stats.totalSize += media.size;
      
      if (media.type.startsWith('audio/')) {
        stats.audioCount++;
      } else if (media.type.startsWith('video/')) {
        stats.videoCount++;
      }

      if (this.isFormatSupported(media.type)) {
        stats.supportedFormats++;
      } else {
        stats.unsupportedFormats++;
      }

      if (media.duration && !isNaN(media.duration)) {
        totalDuration += media.duration;
        durationCount++;
      }
    });

    if (durationCount > 0) {
      stats.averageDuration = totalDuration / durationCount;
    }

    return stats;
  }

  /**
   * Test if a media file can be loaded
   */
  public async testMediaLoading(url: string, type: string): Promise<{ success: boolean; error?: string; duration?: number }> {
    return new Promise((resolve) => {
      const element = type.startsWith('audio/') 
        ? new Audio() 
        : document.createElement('video');

      const timeout = setTimeout(() => {
        element.remove();
        resolve({ success: false, error: 'Loading timeout' });
      }, 15000);

      element.onloadedmetadata = () => {
        clearTimeout(timeout);
        const duration = element.duration || 0;
        element.remove();
        resolve({ success: true, duration });
      };

      element.onerror = () => {
        clearTimeout(timeout);
        element.remove();
        resolve({ success: false, error: 'Failed to load media' });
      };

      element.src = url;
    });
  }
}

export const mediaPlayerService = MediaPlayerService.getInstance();
