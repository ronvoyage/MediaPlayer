import { createTheme, alpha } from '@mui/material/styles';
import type { PaletteMode, Theme } from '@mui/material';

/** Soft shadow presets */
const softShadows = (mode: PaletteMode) => {
  const base = mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.14)';
  const lg = mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.18)';
  return [
    'none',
    `0 1px 2px ${base}`,
    `0 2px 6px ${base}`,
    `0 4px 12px ${base}`,
    `0 8px 24px ${lg}`,
    `0 12px 36px ${lg}`,
  ];
};

/** Reusable component overrides, with proper Theme typing */
const commonComponents = (mode: PaletteMode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      '*, *::before, *::after': { boxSizing: 'border-box' },
      html: { height: '100%' },
      body: { height: '100%', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: '10px 16px',
        fontSize: '0.9rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        transition: 'transform .18s ease, box-shadow .18s ease',
        '&:hover': { transform: 'translateY(-1px)' },
      },
      contained: {
        boxShadow: softShadows(mode)[2],
        '&:hover': { boxShadow: softShadows(mode)[3] },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 12,
        transition: 'background-color .18s ease, transform .18s ease',
        '&:hover': { backgroundColor: alpha(theme.palette.text.primary, 0.06) },
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: () => ({
        borderRadius: 16,
        transition: 'transform .22s ease, box-shadow .22s ease',
        ...(mode === 'dark' ? { backgroundColor: '#1E1E1E' } : null),
        '&:hover': { transform: 'translateY(-2px)' },
      }),
    },
  },
  MuiPaper: {
    styleOverrides: { root: { borderRadius: 16, backgroundImage: 'none' } },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        background: `linear-gradient(90deg,
          ${alpha(theme.palette.background.paper, 0.6)},
          ${alpha(theme.palette.background.paper, 0.9)})`,
        backdropFilter: 'blur(6px)',
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: ({ theme }: { theme: Theme }) => ({
        height: 3,
        borderRadius: 3,
        backgroundColor: theme.palette.primary.main,
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        textTransform: 'none' as const,
        fontWeight: 600,
        borderRadius: 999,
        minHeight: 42,
        paddingInline: 16,
        '&.Mui-selected': { backgroundColor: alpha(theme.palette.primary.main, 0.12) },
      }),
    },
  },
  MuiToggleButtonGroup: { styleOverrides: { root: { borderRadius: 999 } } },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 999,
        textTransform: 'none' as const,
        '&.Mui-selected': {
          backgroundColor: alpha(theme.palette.primary.main, 0.14),
          borderColor: alpha(theme.palette.primary.main, 0.24),
          '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) },
        },
      }),
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 999 },
      outlined: ({ theme }: { theme: Theme }) => ({
        borderColor: alpha(theme.palette.text.primary, 0.18),
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: { root: { height: 8, borderRadius: 999 }, bar: { borderRadius: 999 } },
  },
  MuiSlider: {
    styleOverrides: {
      root: { height: 4 },
      track: { border: 'none' },
      thumb: ({ theme }: { theme: Theme }) => ({
        width: 18,
        height: 18,
        boxShadow: softShadows(mode)[2],
        '&:hover': { boxShadow: softShadows(mode)[3] },
        '&:before': { display: 'none' },
        border: `2px solid ${theme.palette.background.paper}`,
      }),
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          transition: 'border-color .18s ease, background-color .18s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.primary.main },
        },
      }),
    },
  },
});

/* Light theme */
export const lightTheme = createTheme({
  palette: {
    mode: 'light' as PaletteMode,
    primary: { main: '#1565C0', light: '#42A5F5', dark: '#0D47A1', contrastText: '#FFFFFF' },
    secondary: { main: '#FF6F00', light: '#FF8F00', dark: '#E65100', contrastText: '#FFFFFF' },
    background: { default: '#FAFAFA', paper: '#FFFFFF' },
    text: { primary: '#212121', secondary: '#757575' },
    divider: '#E0E0E0',
    success: { main: '#2E7D32', light: '#4CAF50', dark: '#1B5E20' },
    warning: { main: '#F57C00', light: '#FF9800', dark: '#E65100' },
    error: { main: '#D32F2F', light: '#F44336', dark: '#B71C1C' },
  },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.35 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none' as const, letterSpacing: '0.02em' },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  // optional: provide more gentle shadow scale
  shadows: (['none', ...softShadows('light'), ...Array(19).fill(softShadows('light')[4])] as unknown) as any,
  components: {
    ...commonComponents('light'),
  },
});

/* Dark theme */
export const darkTheme = createTheme({
  palette: {
    mode: 'dark' as PaletteMode,
    primary: { main: '#64B5F6', light: '#90CAF9', dark: '#42A5F5', contrastText: '#000000' },
    secondary: { main: '#FFB74D', light: '#FFD180', dark: '#FF9800', contrastText: '#000000' },
    background: { default: '#0A0A0A', paper: '#1E1E1E' },
    text: { primary: '#FFFFFF', secondary: '#B3B3B3' },
    divider: '#333333',
    success: { main: '#66BB6A', light: '#81C784', dark: '#4CAF50' },
    warning: { main: '#FFB74D', light: '#FFD180', dark: '#FF9800' },
    error: { main: '#F44336', light: '#EF5350', dark: '#E53935' },
  },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.35 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none' as const, letterSpacing: '0.02em' },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  shadows: (['none', ...softShadows('dark'), ...Array(19).fill(softShadows('dark')[4])] as unknown) as any,
  components: {
    ...commonComponents('dark'),
    // dark specific TextField surface
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#2A2A2A',
            transition: 'background-color .18s ease, border-color .18s ease',
            '&:hover': {
              backgroundColor: '#333333',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#64B5F6' },
            },
            '&.Mui-focused': { backgroundColor: '#333333' },
          },
        },
      },
    },
  },
});
