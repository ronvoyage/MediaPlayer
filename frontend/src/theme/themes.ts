import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

// Light theme: innovative, respectful, and serious
export const lightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#1565C0', // Professional blue
      light: '#42A5F5',
      dark: '#0D47A1',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#FF6F00', // Innovative orange accent
      light: '#FF8F00',
      dark: '#E65100',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#FAFAFA', // Clean, minimal background
      paper: '#FFFFFF'
    },
    text: {
      primary: '#212121', // High contrast for readability
      secondary: '#757575'
    },
    divider: '#E0E0E0',
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20'
    },
    warning: {
      main: '#F57C00',
      light: '#FF9800',
      dark: '#E65100'
    },
    error: {
      main: '#D32F2F',
      light: '#F44336',
      dark: '#B71C1C'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      fontWeight: 500,
      textTransform: 'none' as const,
      letterSpacing: '0.02em'
    }
  },
  shape: {
    borderRadius: 8
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)'
          }
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1565C0'
              }
            }
          }
        }
      }
    }
  }
});

// Dark theme: modern, elegant
export const darkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#64B5F6', // Softer blue for dark mode
      light: '#90CAF9',
      dark: '#42A5F5',
      contrastText: '#000000'
    },
    secondary: {
      main: '#FFB74D', // Warm orange for accent
      light: '#FFCC02',
      dark: '#FF9800',
      contrastText: '#000000'
    },
    background: {
      default: '#0A0A0A', // Deep dark background
      paper: '#1E1E1E' // Elevated surface color
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3'
    },
    divider: '#333333',
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#4CAF50'
    },
    warning: {
      main: '#FFB74D',
      light: '#FFCC02',
      dark: '#FF9800'
    },
    error: {
      main: '#F44336',
      light: '#EF5350',
      dark: '#E53935'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      fontWeight: 500,
      textTransform: 'none' as const,
      letterSpacing: '0.02em'
    }
  },
  shape: {
    borderRadius: 8
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: '0.875rem',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#1E1E1E',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#2A2A2A',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#333333',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#64B5F6'
              }
            },
            '&.Mui-focused': {
              backgroundColor: '#333333'
            }
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});
