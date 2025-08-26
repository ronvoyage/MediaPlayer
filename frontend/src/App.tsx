import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { lightTheme, darkTheme } from './theme/themes';
import { ThemeShowcase } from './components/ThemeShowcase';
import { useLogger } from './hooks/useLogger';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { logUserAction } = useLogger('App');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    logUserAction('theme_toggle', { mode: !darkMode ? 'dark' : 'light' });
  };

  const theme = createTheme(darkMode ? darkTheme : lightTheme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        {/* Theme Toggle Button */}
        <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
          <IconButton
            onClick={toggleDarkMode}
            color="inherit"
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[4],
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        {/* Main Content */}
        <ThemeShowcase />
      </Box>
    </ThemeProvider>
  );
}

export default App;
