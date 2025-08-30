import { useState, useEffect, useCallback } from 'react';
import { globalMusicPlayer, type GlobalPlayerState } from '../services/globalMusicPlayer';
import type { MediaInfo } from '../services/mediaPlayer';

export const useGlobalMusicPlayer = () => {
  const [state, setState] = useState<GlobalPlayerState>(globalMusicPlayer.getState());

  useEffect(() => {
    const unsubscribe = globalMusicPlayer.subscribe(setState);
    return unsubscribe;
  }, []);

  const actions = {
    // Playback controls
    play: useCallback(() => globalMusicPlayer.play(), []),
    pause: useCallback(() => globalMusicPlayer.pause(), []),
    stop: useCallback(() => globalMusicPlayer.stop(), []),
    next: useCallback(() => globalMusicPlayer.next(), []),
    previous: useCallback(() => globalMusicPlayer.previous(), []),

    // Playlist management
    loadPlaylist: useCallback((files: MediaInfo[]) => globalMusicPlayer.loadPlaylist(files), []),
    addToPlaylist: useCallback((files: MediaInfo[]) => globalMusicPlayer.addToPlaylist(files), []),
    playTrackAtIndex: useCallback((index: number) => globalMusicPlayer.playTrackAtIndex(index), []),
    clearPlaylist: useCallback(() => globalMusicPlayer.clearPlaylist(), []),

    // Seek and volume
    seek: useCallback((time: number) => globalMusicPlayer.seek(time), []),
    setVolume: useCallback((volume: number) => globalMusicPlayer.setVolume(volume), []),
    toggleMute: useCallback(() => globalMusicPlayer.toggleMute(), []),

    // Player settings
    toggleShuffle: useCallback(() => globalMusicPlayer.toggleShuffle(), []),
    toggleRepeat: useCallback(() => globalMusicPlayer.toggleRepeat(), []),
    toggleExpanded: useCallback(() => globalMusicPlayer.toggleExpanded(), []),

    // Visibility
    show: useCallback(() => globalMusicPlayer.show(), []),
    hide: useCallback(() => globalMusicPlayer.hide(), []),

    // Utility
    hasNextTrack: useCallback(() => globalMusicPlayer.hasNextTrack(), []),
    hasPreviousTrack: useCallback(() => globalMusicPlayer.hasPreviousTrack(), []),
  };

  return { state, ...actions };
};