import React from 'react';
import { screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MediaPlayer } from '../MediaPlayer';
import { render } from '../../test/test-utils';

// Mock the media player service
vi.mock('../../services/mediaPlayer', () => ({
  mediaPlayerService: {
    getInstance: vi.fn(() => ({
      validateMediaFile: vi.fn(() => ({ isValid: true, errors: [] })),
      createMediaInfo: vi.fn(() => Promise.resolve({
        id: 'test-id',
        name: 'test.mp3',
        type: 'audio/mpeg',
        size: 1024,
        lastModified: Date.now(),
        url: 'blob:test',
        metadata: {},
        duration: 180
      })),
      getMediaStats: vi.fn(() => ({
        totalFiles: 1,
        totalSize: 1024,
        audioCount: 1,
        videoCount: 0,
        averageDuration: 180,
        supportedFormats: 1,
        unsupportedFormats: 0
      })),
      formatFileSize: vi.fn(() => '1 KB'),
      formatDuration: vi.fn(() => '3:00')
    }))
  }
}));

// Mock the logger service
vi.mock('../../services/logger', () => ({
  logger: {
    userAction: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}));

describe('MediaPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MediaPlayer />);
    expect(screen.getByText('MediaPlayer')).toBeInTheDocument();
  });

  it('displays welcome message when no files are loaded', () => {
    render(<MediaPlayer />);
    expect(screen.getByText('Welcome to MediaPlayer')).toBeInTheDocument();
    expect(screen.getByText(/Drag and drop audio or video files/)).toBeInTheDocument();
  });

  it('shows supported format chips', () => {
    render(<MediaPlayer />);
    expect(screen.getByText('MP3')).toBeInTheDocument();
    expect(screen.getByText('WAV')).toBeInTheDocument();
    expect(screen.getByText('MP4')).toBeInTheDocument();
  });

  it('renders drag and drop component', () => {
    render(<MediaPlayer />);
    expect(screen.getByText('Drag & Drop Media Files')).toBeInTheDocument();
  });

  it('displays instructions for empty playlist', () => {
    render(<MediaPlayer />);
    expect(screen.getByText(/Your playlist will appear on the right side/)).toBeInTheDocument();
  });
});
