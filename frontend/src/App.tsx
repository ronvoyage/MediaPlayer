import { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { getTheme, themeOptions, type ThemeName } from './theme/themes';
import { ThemeShowcase } from './components/ThemeShowcase';
import { MediaPlayer } from './components/MediaPlayer';
import { useLogger } from './hooks/useLogger';
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
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    try {
      const stored = localStorage.getItem('mp_theme_name');
      return (stored as ThemeName) || 'classic';
    } catch {
      return 'classic';
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
                  <ThemeShowcase
                    onToggleTheme={toggleDarkMode}
                    isDark={darkMode}
                    themeName={themeName}
                    themeOptions={themeOptions}
                    onSelectTheme={setThemeByName}
                  />
                )}
              />
              <Route path="/mediaplayer" element={<MediaPlayer />} />
              <Route path="/approval" element={<ApprovalPage />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
