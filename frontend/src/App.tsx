import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { getTheme, themeOptions, type ThemeName } from './theme/themes';
import { ThemeShowcase } from './components/ThemeShowcase';
import { MediaPlayer } from './components/MediaPlayer';
import { Showcase } from './components/Showcase';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { UserProfile } from './components/UserProfile';
import { FloatingMusicPlayer } from './components/FloatingMusicPlayer';
import { useLogger } from './hooks/useLogger';
import { useGlobalMusicPlayer } from './hooks/useGlobalMusicPlayer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApprovalPage } from './components/approval/ApprovalPage';

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('mp_theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });
  const { logUserAction } = useLogger('App');
  
  // Global music player
  const globalPlayer = useGlobalMusicPlayer();
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    try {
      const stored = localStorage.getItem('mp_theme_name');
      return (stored as ThemeName) || 'classic';
    } catch {
      return 'classic';
    }
  });

  // Settings state
  const [volume, setVolume] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('mp_volume');
      return stored ? parseInt(stored, 10) : 50;
    } catch {
      return 50;
    }
  });

  const [autoplay, setAutoplay] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('mp_autoplay');
      return stored ? stored === 'true' : false;
    } catch {
      return false;
    }
  });

  const [quality, setQuality] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('mp_quality');
      return stored || 'auto';
    } catch {
      return 'auto';
    }
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    logUserAction('theme_toggle', { mode: !darkMode ? 'dark' : 'light' });
  };

  useEffect(() => {
    try {
      localStorage.setItem('mp_theme', darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  const theme = getTheme(themeName, darkMode ? 'dark' : 'light');

  const setThemeByName = (name: ThemeName) => {
    setThemeName(name);
    try { localStorage.setItem('mp_theme_name', name); } catch {}
    logUserAction('theme_changed', { theme: name, mode: darkMode ? 'dark' : 'light' });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ position: 'relative', minHeight: '100vh', display: 'flex' }}>
          {/* Main Content */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Routes>
              <Route
                path="/"
                element={(
                  <MediaPlayer
                    onToggleTheme={toggleDarkMode}
                    isDark={darkMode}
                    themeName={themeName}
                    themeOptions={themeOptions}
                    onSelectTheme={setThemeByName}
                  />
                )}
              />
              <Route path="/showcase" element={(
                <ThemeShowcase
                  onToggleTheme={toggleDarkMode}
                  isDark={darkMode}
                  themeName={themeName}
                  themeOptions={themeOptions}
                  onSelectTheme={setThemeByName}
                />
              )} />
              <Route path="/settings" element={(
                <Settings
                  onToggleTheme={toggleDarkMode}
                  isDark={darkMode}
                  themeName={themeName}
                  themeOptions={themeOptions}
                  onSelectTheme={setThemeByName}
                  volume={volume}
                  onVolumeChange={setVolume}
                  autoplay={autoplay}
                  onAutoplayChange={setAutoplay}
                  quality={quality}
                  onQualityChange={setQuality}
                />
              )} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/mediaplayer" element={<MediaPlayer />} />
              <Route path="/approval" element={<ApprovalPage />} />
            </Routes>
          </Box>
        </Box>

        {/* Global Floating Music Player */}
        <FloatingMusicPlayer
          state={{
            isPlaying: globalPlayer.state.isPlaying,
            currentTime: globalPlayer.state.currentTime,
            duration: globalPlayer.state.duration,
            volume: globalPlayer.state.volume,
            isMuted: globalPlayer.state.isMuted,
            isExpanded: globalPlayer.state.isExpanded,
            currentTrack: globalPlayer.state.currentTrack,
            playlist: globalPlayer.state.playlist,
            currentIndex: globalPlayer.state.currentIndex,
            isVisible: globalPlayer.state.isVisible,
            shuffle: globalPlayer.state.shuffle,
            repeat: globalPlayer.state.repeat,
          }}
          onPlay={globalPlayer.play}
          onPause={globalPlayer.pause}
          onNext={globalPlayer.next}
          onPrevious={globalPlayer.previous}
          onSeek={globalPlayer.seek}
          onVolumeChange={globalPlayer.setVolume}
          onToggleMute={globalPlayer.toggleMute}
          onToggleExpanded={globalPlayer.toggleExpanded}
          onClose={globalPlayer.hide}
          onToggleShuffle={globalPlayer.toggleShuffle}
          onToggleRepeat={globalPlayer.toggleRepeat}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
