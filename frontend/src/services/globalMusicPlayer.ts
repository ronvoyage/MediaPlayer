import { logger } from './logger';
import type { MediaInfo } from './mediaPlayer';

export interface GlobalTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  url: string;
  duration?: number;
  metadata?: any;
}

export interface GlobalPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isExpanded: boolean;
  currentTrack: GlobalTrack | null;
  playlist: GlobalTrack[];
  currentIndex: number;
  isVisible: boolean;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
  isLoading: boolean;
  error: string | null;
}

type StateChangeListener = (state: GlobalPlayerState) => void;

class GlobalMusicPlayerService {
  private audioElement: HTMLAudioElement | null = null;
  private state: GlobalPlayerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isExpanded: false,
    currentTrack: null,
    playlist: [],
    currentIndex: -1,
    isVisible: false,
    shuffle: false,
    repeat: 'none',
    isLoading: false,
    error: null,
  };
  
  private listeners: StateChangeListener[] = [];
  private shuffledIndices: number[] = [];

  constructor() {
    this.initializeAudio();
    this.loadPersistedState();
  }

  private initializeAudio() {
    this.audioElement = new Audio();
    this.audioElement.preload = 'metadata';
    
    // Event listeners
    this.audioElement.addEventListener('loadstart', () => {
      this.updateState({ isLoading: true, error: null });
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      this.updateState({ 
        duration: this.audioElement!.duration,
        isLoading: false 
      });
    });

    this.audioElement.addEventListener('timeupdate', () => {
      if (!this.audioElement) return;
      this.updateState({ currentTime: this.audioElement.currentTime });
    });

    this.audioElement.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audioElement.addEventListener('error', (e) => {
      const error = 'Failed to load audio track';
      logger.error('Global music player error', new Error(error));
      this.updateState({ error, isLoading: false, isPlaying: false });
    });

    this.audioElement.addEventListener('play', () => {
      this.updateState({ isPlaying: true });
    });

    this.audioElement.addEventListener('pause', () => {
      this.updateState({ isPlaying: false });
    });

    this.audioElement.addEventListener('volumechange', () => {
      if (!this.audioElement) return;
      this.updateState({ 
        volume: this.audioElement.volume,
        isMuted: this.audioElement.muted 
      });
    });
  }

  private updateState(updates: Partial<GlobalPlayerState>) {
    this.state = { ...this.state, ...updates };
    this.persistState();
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  private persistState() {
    try {
      const persistData = {
        volume: this.state.volume,
        isMuted: this.state.isMuted,
        shuffle: this.state.shuffle,
        repeat: this.state.repeat,
        isExpanded: this.state.isExpanded,
        currentIndex: this.state.currentIndex,
        currentTime: this.state.currentTime,
        playlist: this.state.playlist,
      };
      localStorage.setItem('gmp_state', JSON.stringify(persistData));
    } catch (error) {
      logger.error('Failed to persist global player state', error);
    }
  }

  private loadPersistedState() {
    try {
      const stored = localStorage.getItem('gmp_state');
      if (stored) {
        const persistData = JSON.parse(stored);
        this.state = { ...this.state, ...persistData };
        
        // Restore audio settings
        if (this.audioElement) {
          this.audioElement.volume = this.state.volume;
          this.audioElement.muted = this.state.isMuted;
        }

        // If we have a playlist and current track, restore it
        if (this.state.playlist.length > 0 && this.state.currentIndex >= 0) {
          const currentTrack = this.state.playlist[this.state.currentIndex];
          if (currentTrack) {
            this.state.currentTrack = currentTrack;
            this.state.isVisible = true;
            this.loadTrack(currentTrack);
          }
        }
      }
    } catch (error) {
      logger.error('Failed to load persisted global player state', error);
    }
  }

  private loadTrack(track: GlobalTrack) {
    if (!this.audioElement) return;

    this.updateState({ 
      currentTrack: track, 
      isLoading: true, 
      error: null,
      isVisible: true 
    });

    this.audioElement.src = track.url;
    this.audioElement.load();

    // Try to restore time position if it's the same track
    if (this.state.currentTime > 0) {
      this.audioElement.addEventListener('loadeddata', () => {
        if (this.audioElement && this.state.currentTime < this.audioElement.duration) {
          this.audioElement.currentTime = this.state.currentTime;
        }
      }, { once: true });
    }
  }

  private handleTrackEnded() {
    switch (this.state.repeat) {
      case 'one':
        this.play();
        break;
      case 'all':
        if (this.hasNextTrack()) {
          this.next();
        } else {
          // Go back to first track
          this.playTrackAtIndex(0);
        }
        break;
      default:
        if (this.hasNextTrack()) {
          this.next();
        } else {
          this.updateState({ isPlaying: false });
        }
        break;
    }
  }

  private generateShuffledIndices() {
    const indices = Array.from({ length: this.state.playlist.length }, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    this.shuffledIndices = indices;
  }

  private getNextIndex(): number {
    if (this.state.shuffle) {
      if (this.shuffledIndices.length === 0) {
        this.generateShuffledIndices();
      }
      const currentShuffledPos = this.shuffledIndices.indexOf(this.state.currentIndex);
      const nextShuffledPos = (currentShuffledPos + 1) % this.shuffledIndices.length;
      return this.shuffledIndices[nextShuffledPos];
    }
    return (this.state.currentIndex + 1) % this.state.playlist.length;
  }

  private getPreviousIndex(): number {
    if (this.state.shuffle) {
      if (this.shuffledIndices.length === 0) {
        this.generateShuffledIndices();
      }
      const currentShuffledPos = this.shuffledIndices.indexOf(this.state.currentIndex);
      const prevShuffledPos = currentShuffledPos === 0 
        ? this.shuffledIndices.length - 1 
        : currentShuffledPos - 1;
      return this.shuffledIndices[prevShuffledPos];
    }
    return this.state.currentIndex === 0 
      ? this.state.playlist.length - 1 
      : this.state.currentIndex - 1;
  }

  // Public methods
  subscribe(listener: StateChangeListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): GlobalPlayerState {
    return { ...this.state };
  }

  loadPlaylist(files: MediaInfo[]) {
    const tracks: GlobalTrack[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      title: file.metadata?.title || file.name,
      artist: file.metadata?.artist || 'Unknown Artist',
      album: file.metadata?.album,
      artwork: file.metadata?.artwork,
      url: file.url,
      duration: file.metadata?.duration,
      metadata: file.metadata,
    }));

    this.updateState({ 
      playlist: tracks,
      currentIndex: tracks.length > 0 ? 0 : -1,
      isVisible: tracks.length > 0
    });

    if (tracks.length > 0) {
      this.loadTrack(tracks[0]);
    }

    // Reset shuffle indices
    this.shuffledIndices = [];
  }

  addToPlaylist(files: MediaInfo[]) {
    const newTracks: GlobalTrack[] = files.map((file, index) => ({
      id: `${Date.now()}-${this.state.playlist.length + index}`,
      title: file.metadata?.title || file.name,
      artist: file.metadata?.artist || 'Unknown Artist',
      album: file.metadata?.album,
      artwork: file.metadata?.artwork,
      url: file.url,
      duration: file.metadata?.duration,
      metadata: file.metadata,
    }));

    const updatedPlaylist = [...this.state.playlist, ...newTracks];
    const shouldStartPlaying = this.state.playlist.length === 0;

    this.updateState({ 
      playlist: updatedPlaylist,
      currentIndex: shouldStartPlaying ? 0 : this.state.currentIndex,
      isVisible: true
    });

    if (shouldStartPlaying && newTracks.length > 0) {
      this.loadTrack(newTracks[0]);
    }

    // Reset shuffle indices
    this.shuffledIndices = [];
  }

  play() {
    if (this.audioElement && this.state.currentTrack) {
      this.audioElement.play().catch(error => {
        logger.error('Failed to play audio', error);
        this.updateState({ error: 'Failed to play audio' });
      });
    }
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.updateState({ isPlaying: false, currentTime: 0 });
  }

  next() {
    if (this.hasNextTrack()) {
      const nextIndex = this.getNextIndex();
      this.playTrackAtIndex(nextIndex);
    }
  }

  previous() {
    if (this.hasPreviousTrack()) {
      const prevIndex = this.getPreviousIndex();
      this.playTrackAtIndex(prevIndex);
    }
  }

  playTrackAtIndex(index: number) {
    if (index >= 0 && index < this.state.playlist.length) {
      const track = this.state.playlist[index];
      this.updateState({ currentIndex: index });
      this.loadTrack(track);
      // Auto-play the new track
      setTimeout(() => this.play(), 100);
    }
  }

  seek(time: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
      this.updateState({ currentTime: time });
    }
  }

  setVolume(volume: number) {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  toggleMute() {
    if (this.audioElement) {
      this.audioElement.muted = !this.audioElement.muted;
    }
  }

  toggleShuffle() {
    const newShuffle = !this.state.shuffle;
    this.updateState({ shuffle: newShuffle });
    
    if (newShuffle) {
      this.generateShuffledIndices();
    } else {
      this.shuffledIndices = [];
    }
  }

  toggleRepeat() {
    const modes: Array<'none' | 'all' | 'one'> = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(this.state.repeat);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    this.updateState({ repeat: nextMode });
  }

  toggleExpanded() {
    this.updateState({ isExpanded: !this.state.isExpanded });
  }

  hide() {
    this.updateState({ isVisible: false });
    this.pause();
  }

  show() {
    if (this.state.playlist.length > 0) {
      this.updateState({ isVisible: true });
    }
  }

  hasNextTrack(): boolean {
    return this.state.playlist.length > 1;
  }

  hasPreviousTrack(): boolean {
    return this.state.playlist.length > 1;
  }

  clearPlaylist() {
    this.stop();
    this.updateState({ 
      playlist: [], 
      currentTrack: null, 
      currentIndex: -1, 
      isVisible: false 
    });
    this.shuffledIndices = [];
  }
}

// Create singleton instance
export const globalMusicPlayer = new GlobalMusicPlayerService();