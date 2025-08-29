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
      main: '#FFA726', // Lighter, clearer orange accent
      light: '#FFB74D',
      dark: '#FB8C00',
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

// Additional theme: Neon – vibrant, high-contrast accents for a media vibe
export const neonLightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#00BCD4', // Cyan
      light: '#62EFFF',
      dark: '#0097A7',
      contrastText: '#001B1F'
    },
    secondary: {
      main: '#E91E63', // Neon magenta
      light: '#FF5C8D',
      dark: '#C2185B',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#FDFDFE',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#15151A',
      secondary: '#5A5A66'
    },
    divider: '#E7E7EE'
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        }
      }
    }
  }
});

export const neonDarkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#00E5FF', // Electric cyan
      light: '#66FFFF',
      dark: '#00B8D4',
      contrastText: '#001013'
    },
    secondary: {
      main: '#FF4081', // Electric pink
      light: '#FF79A8',
      dark: '#F50057',
      contrastText: '#000000'
    },
    background: {
      default: '#07080A', // Near-black
      paper: '#111317' // Slightly lifted
    },
    text: {
      primary: '#F5F7FB',
      secondary: '#B8C0CC'
    },
    divider: '#1F242B'
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0 0 0 rgba(0,0,0,0)'
        }
      }
    }
  }
});

// Cupertino (iPhone-style) theme: rounded, airy, subtle translucency
export const cupertinoLightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#0A84FF', // iOS system blue
      light: '#5EB2FF',
      dark: '#0060DF',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#30D158', // iOS green accent
      light: '#66E88A',
      dark: '#0FB24B',
      contrastText: '#FFFFFF'
    },
    background: {
      default: '#F2F2F7', // iOS grouped background
      paper: '#FFFFFF'
    },
    text: {
      primary: '#000000',
      secondary: '#6C6C70'
    },
    divider: '#D1D1D6'
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"SF Pro Text", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none' as const, fontWeight: 600 }
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: '0 0 0 rgba(0,0,0,0)' } } }
  }
});

export const cupertinoDarkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#0A84FF',
      light: '#5EB2FF',
      dark: '#0060DF',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#30D158',
      light: '#66E88A',
      dark: '#0FB24B',
      contrastText: '#000000'
    },
    background: {
      default: '#000000',
      paper: '#1C1C1E'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#EBEBF5'
    },
    divider: '#2C2C2E'
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"SF Pro Text", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none' as const, fontWeight: 600 }
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 16, backgroundColor: '#1C1C1E' } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiAppBar: { styleOverrides: { root: { boxShadow: '0 0 0 rgba(0,0,0,0)' } } }
  }
});

// Aegean Amber theme (based on provided palette)
// Palette refs: #88ADC6 (steel blue), #582F0B (deep brown), #EF9106 (amber), #D8BAB8 (dusty rose), #0C2C3C (deep navy)
export const aegeanAmberLightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#88ADC6',
      light: '#9dd1eb',
      dark: '#6796b6',
      contrastText: '#0C2C3C'
    },
    secondary: {
      main: '#EF9106',
      light: '#fbc069',
      dark: '#e68937',
      contrastText: '#1f2119'
    },
    background: {
      default: '#FAFBFD',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#0C2C3C',
      secondary: '#3f5a6a'
    },
    divider: '#dde6ee',
    error: { main: '#a15d58' },
    warning: { main: '#ef9106' },
    success: { main: '#44a7d9' },
    info: { main: '#5085a8' }
  },
  shape: { borderRadius: 10 }
});

export const aegeanAmberDarkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#0C2C3C',
      light: '#175777',
      dark: '#0b2b3b',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#EF9106',
      light: '#f9a324',
      dark: '#d07e05',
      contrastText: '#0b2b3b'
    },
    background: {
      default: '#0C2C3C',
      paper: '#0b2b3b'
    },
    text: {
      primary: '#D8BAB8',
      secondary: '#9dd1eb'
    },
    divider: '#234d64',
    error: { main: '#bc8885' },
    warning: { main: '#ef9106' },
    success: { main: '#61b5df' },
    info: { main: '#2998d0' }
  },
  shape: { borderRadius: 10 }
});

// Flora Meadow theme (based on: #b1bebf, #393944, #5f8823, #b49669, #d4d5b4)
export const floraMeadowLightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#5f8823',
      light: '#8dac4f',
      dark: '#466718',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#b49669',
      light: '#d1b78e',
      dark: '#967b4f',
      contrastText: '#393944'
    },
    background: {
      default: '#d4d5b4',
      paper: '#ffffff'
    },
    text: {
      primary: '#393944',
      secondary: '#5e616f'
    },
    divider: '#b1bebf',
    success: { main: '#5f8823' },
    warning: { main: '#b49669' },
    info: { main: '#b1bebf' }
  },
  shape: { borderRadius: 10 }
});

export const floraMeadowDarkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#5f8823',
      light: '#8dac4f',
      dark: '#3d5d12',
      contrastText: '#0b0b0c'
    },
    secondary: {
      main: '#b49669',
      light: '#d1b78e',
      dark: '#8a6d49',
      contrastText: '#0b0b0c'
    },
    background: {
      default: '#393944',
      paper: '#2b2b35'
    },
    text: {
      primary: '#d4d5b4',
      secondary: '#b1bebf'
    },
    divider: '#4b4b58',
    success: { main: '#5f8823' },
    warning: { main: '#b49669' },
    info: { main: '#b1bebf' }
  },
  shape: { borderRadius: 10 }
});

// Bronze Orchard theme (based on: #f3b35a, #786834, #47351a, #f08917, #482c05)
export const bronzeOrchardLightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#f08917',
      light: '#f3b35a',
      dark: '#c26c0f',
      contrastText: '#1b1207'
    },
    secondary: {
      main: '#786834',
      light: '#bba869',
      dark: '#4d4021',
      contrastText: '#ffffff'
    },
    background: {
      default: '#FFF9F0',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#47351a',
      secondary: '#5e4930'
    },
    divider: '#e6d8c5'
  },
  shape: { borderRadius: 10 }
});

export const bronzeOrchardDarkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#f08917',
      light: '#f3b35a',
      dark: '#ae5f0e',
      contrastText: '#120c05'
    },
    secondary: {
      main: '#786834',
      light: '#9a8750',
      dark: '#47351a',
      contrastText: '#000000'
    },
    background: {
      default: '#482c05',
      paper: '#3a2203'
    },
    text: {
      primary: '#f3b35a',
      secondary: '#e6c794'
    },
    divider: '#5c3a10'
  },
  shape: { borderRadius: 10 }
});

// Ember Spice theme (based on: #47201e, #914100, #c01527, #d93a1c, #ee7c00)
export const emberSpiceLightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#c01527', // rich red
      light: '#f3959f',
      dark: '#8f0f1d',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ee7c00', // vivid orange
      light: '#ffb866',
      dark: '#cf6800',
      contrastText: '#2b0f0e'
    },
    background: {
      default: '#FFF6F2',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#47201e', // deep brown-red
      secondary: '#914100'
    },
    divider: '#f7d7cf'
  },
  shape: { borderRadius: 10 }
});

export const emberSpiceDarkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#ee7c00',
      light: '#ffb866',
      dark: '#c76400',
      contrastText: '#120706'
    },
    secondary: {
      main: '#c01527',
      light: '#e16471',
      dark: '#8f0f1d',
      contrastText: '#120706'
    },
    background: {
      default: '#47201e',
      paper: '#2c1312'
    },
    text: {
      primary: '#ffe8e4',
      secondary: '#f6bfb7'
    },
    divider: '#612c2a'
  },
  shape: { borderRadius: 10 }
});

// Harbor Pastel theme (based on: #687c95, #a9b4b9, #cfa47f, #f6f3e1, #7cacbc)
export const harborPastelLightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#687c95',
      light: '#a9b4b9',
      dark: '#445365',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#cfa47f',
      light: '#e3c1a8',
      dark: '#a97f5d',
      contrastText: '#2b2f33'
    },
    background: {
      default: '#f6f3e1',
      paper: '#ffffff'
    },
    text: {
      primary: '#2f3a40',
      secondary: '#687c95'
    },
    info: { main: '#7cacbc' }
  },
  shape: { borderRadius: 10 }
});

export const harborPastelDarkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#7cacbc',
      light: '#9dcbd0',
      dark: '#5f8f93',
      contrastText: '#0d1113'
    },
    secondary: {
      main: '#cfa47f',
      light: '#ddb997',
      dark: '#a97f5d',
      contrastText: '#0d1113'
    },
    background: {
      default: '#2b3136',
      paper: '#22272b'
    },
    text: {
      primary: '#f6f3e1',
      secondary: '#a9b4b9'
    },
    divider: '#3b444b'
  },
  shape: { borderRadius: 10 }
});

// Forest Slate theme (based on: #21252f, #334f1b, #68689b, #b6cb98, #ebf6f7)
export const forestSlateLightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#334f1b',
      light: '#55852d',
      dark: '#223512',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#68689b',
      light: '#8d8db3',
      dark: '#47476b',
      contrastText: '#ffffff'
    },
    background: {
      default: '#ebf6f7',
      paper: '#ffffff'
    },
    text: {
      primary: '#21252f',
      secondary: '#334f1b'
    },
    success: { main: '#b6cb98' }
  },
  shape: { borderRadius: 10 }
});

export const forestSlateDarkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#68689b',
      light: '#8d8db3',
      dark: '#47476b',
      contrastText: '#0b0b0c'
    },
    secondary: {
      main: '#334f1b',
      light: '#4a6d28',
      dark: '#223512',
      contrastText: '#0b0b0c'
    },
    background: {
      default: '#21252f',
      paper: '#16191f'
    },
    text: {
      primary: '#ebf6f7',
      secondary: '#b6cb98'
    },
    divider: '#2a2f3a'
  },
  shape: { borderRadius: 10 }
});

// Sunset Coast theme (based on: #d63f1a, #e8d073, #91c0ef, #477cd4, #84ac50)
export const sunsetCoastLightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: {
      main: '#477cd4',
      light: '#91c0ef',
      dark: '#2f5fb0',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#e8d073',
      light: '#f0dfa4',
      dark: '#cbb553',
      contrastText: '#2a2a2a'
    },
    background: {
      default: '#F8FAFF',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1f2430',
      secondary: '#334a6e'
    },
    success: { main: '#84ac50' },
    info: { main: '#91c0ef' },
    error: { main: '#d63f1a' }
  },
  shape: { borderRadius: 10 }
});

export const sunsetCoastDarkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: {
      main: '#91c0ef',
      light: '#b6d6f5',
      dark: '#477cd4',
      contrastText: '#0c0f13'
    },
    secondary: {
      main: '#e8d073',
      light: '#f0dfa4',
      dark: '#cbb553',
      contrastText: '#0c0f13'
    },
    background: {
      default: '#0f1724',
      paper: '#121a28'
    },
    text: {
      primary: '#e7eef9',
      secondary: '#b3c9ea'
    },
    success: { main: '#84ac50' },
    info: { main: '#91c0ef' },
    error: { main: '#d63f1a' }
  },
  shape: { borderRadius: 10 }
});

export type ThemeName = 'classic' | 'neon' | 'cupertino' | 'aegeanAmber' | 'floraMeadow' | 'bronzeOrchard' | 'emberSpice' | 'harborPastel' | 'forestSlate' | 'sunsetCoast';

export const themeOptions: Array<{ value: ThemeName; label: string }> = [
  { value: 'classic', label: 'Classic' },
  { value: 'neon', label: 'Neon' },
  { value: 'cupertino', label: 'Cupertino (iPhone)' },
  { value: 'aegeanAmber', label: 'Aegean Amber' },
  { value: 'floraMeadow', label: 'Flora Meadow' },
  { value: 'bronzeOrchard', label: 'Bronze Orchard' },
  { value: 'emberSpice', label: 'Ember Spice' },
  { value: 'harborPastel', label: 'Harbor Pastel' },
  { value: 'forestSlate', label: 'Forest Slate' },
  { value: 'sunsetCoast', label: 'Sunset Coast' }
];

export function getTheme(themeName: ThemeName, mode: 'light' | 'dark') {
  if (themeName === 'neon') {
    return mode === 'dark' ? neonDarkTheme : neonLightTheme;
  }
  if (themeName === 'cupertino') {
    return mode === 'dark' ? cupertinoDarkTheme : cupertinoLightTheme;
  }
  if (themeName === 'aegeanAmber') {
    return mode === 'dark' ? aegeanAmberDarkTheme : aegeanAmberLightTheme;
  }
  if (themeName === 'floraMeadow') {
    return mode === 'dark' ? floraMeadowDarkTheme : floraMeadowLightTheme;
  }
  if (themeName === 'bronzeOrchard') {
    return mode === 'dark' ? bronzeOrchardDarkTheme : bronzeOrchardLightTheme;
  }
  if (themeName === 'emberSpice') {
    return mode === 'dark' ? emberSpiceDarkTheme : emberSpiceLightTheme;
  }
  if (themeName === 'harborPastel') {
    return mode === 'dark' ? harborPastelDarkTheme : harborPastelLightTheme;
  }
  if (themeName === 'forestSlate') {
    return mode === 'dark' ? forestSlateDarkTheme : forestSlateLightTheme;
  }
  if (themeName === 'sunsetCoast') {
    return mode === 'dark' ? sunsetCoastDarkTheme : sunsetCoastLightTheme;
  }
  // default classic
  return mode === 'dark' ? darkTheme : lightTheme;
}
