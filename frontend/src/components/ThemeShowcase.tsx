import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  TextField,
  Switch,
  Slider,
  Chip,
  Avatar,
  LinearProgress,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Menu,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Divider,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  Settings,
  Favorite,
  Share,
  ExpandMore,
  Home,
  LibraryMusic,
  Search,
  AccountCircle,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  BugReport,
  PlayCircle,
  Settings as SettingsIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AnimatedLogo } from './AnimatedLogo';
import { useLogger } from '../hooks/useLogger';
import { LoggingDashboard } from './LoggingDashboard';

interface ThemeShowcaseProps {
  onToggleTheme?: () => void;
  isDark?: boolean;
  themeName?: string;
  themeOptions?: Array<{ value: string; label: string }>;
  onSelectTheme?: (value: any) => void;
}

export function ThemeShowcase({ onToggleTheme, isDark, themeName, themeOptions = [], onSelectTheme }: ThemeShowcaseProps) {
  const theme = useTheme();
  const { logUserAction } = useLogger('ThemeShowcase');
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [toggleValue, setToggleValue] = useState<string>('view1');
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(false);
  const [isLoggingDashboardOpen, setIsLoggingDashboardOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(() => {
    try {
      return localStorage.getItem('mp_profile_picture');
    } catch {
      return null;
    }
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    logUserAction('tab_changed', { tabIndex: newValue });
  };

  // Listen for profile picture changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mp_profile_picture') {
        setProfilePicture(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleCustomStorageChange = ((e: CustomEvent) => {
      if (e.detail.key === 'mp_profile_picture') {
        setProfilePicture(e.detail.newValue);
      }
    }) as EventListener;

    window.addEventListener('localStorageChange', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, []);

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
    logUserAction('menu_opened', { source: 'theme_showcase' });
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    logUserAction('menu_closed', { source: 'theme_showcase' });
  };

  const actions = [
    { icon: <PlayArrow />, name: 'Play' },
    { icon: <Pause />, name: 'Pause' },
    { icon: <VolumeUp />, name: 'Volume' },
    { icon: <Settings />, name: 'Settings' },
  ];

  return (
    <Box sx={{ p: 3, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AppBar position="static" sx={{ mb: 4, borderRadius: 2 }}>
          <Toolbar sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
            <Box onClick={() => {
              logUserAction('navigation', { from: 'theme_showcase', to: 'home', method: 'logo_click' });
              navigate('/');
            }} sx={{ cursor: 'pointer' }}>
              <AnimatedLogo size={40} showText />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {/* Theme toggle in app bar */}
            <IconButton color="inherit" onClick={() => {
              logUserAction('theme_toggle', { from: 'theme_showcase', mode: !isDark ? 'dark' : 'light' });
              onToggleTheme?.();
            }} aria-label="toggle theme">
              {isDark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <IconButton color="inherit" onClick={() => {
              logUserAction('navigation', { from: 'theme_showcase', to: 'media_player', method: 'icon_button' });
              navigate('/');
            }} title="Open Media Player">
              <PlayCircle />
            </IconButton>
            <IconButton color="inherit" onClick={() => {
              logUserAction('search_clicked', { from: 'theme_showcase' });
              // TODO: Implement search functionality
            }}>
              <Search />
            </IconButton>
            <IconButton color="inherit" onClick={() => {
              logUserAction('navigation', { from: 'theme_showcase', to: 'profile', method: 'icon_button' });
              navigate('/profile');
            }} sx={{ p: 0.5 }}>
              <Avatar 
                src={profilePicture || undefined}
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.main'
                }}
              >
                <AccountCircle sx={{ fontSize: '1.5rem' }} />
              </Avatar>
            </IconButton>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            {/* Logging Dashboard Button (Development Only) */}
            {import.meta.env.DEV && (
              <IconButton 
                onClick={() => setIsLoggingDashboardOpen(true)} 
                color="inherit"
                title="Open Logging Dashboard"
              >
                <BugReport />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Navigation Breadcrumbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/">
            <Home sx={{ mr: 0.5, fontSize: 'inherit' }} />
            MediaPlayer
          </Link>
          <Link underline="hover" color="inherit" href="/showcase">
            Showcase
          </Link>
          <Typography color="text.primary">Theme Demo</Typography>
        </Breadcrumbs>
      </motion.div>

      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        MediaPlayer Theme Showcase
      </Typography>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Components" />
            <Tab label="Forms" />
            <Tab label="Media Controls" />
            <Tab label="Layout" />
            <Tab label="Design" />
          </Tabs>
        </Box>
      </motion.div>

      <Grid container spacing={4}>
        {/* Tab Panel 1: Components */}
        {tabValue === 0 && (
          <>
            {/* Buttons */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Buttons</Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                      <Button variant="contained" startIcon={<PlayArrow />}>
                        Play
                      </Button>
                      <Button variant="outlined" startIcon={<Pause />}>
                        Pause
                      </Button>
                      <Button variant="text" startIcon={<Favorite />}>
                        Like
                      </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <IconButton color="primary">
                        <PlayArrow />
                      </IconButton>
                      <IconButton color="secondary">
                        <VolumeUp />
                      </IconButton>
                      <IconButton>
                        <Share />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Progress & Loading */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Progress & Loading</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>Linear Progress</Typography>
                      <LinearProgress variant="determinate" value={65} sx={{ mb: 1 }} />
                      <LinearProgress variant="indeterminate" sx={{ mb: 2 }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <CircularProgress size={30} />
                      <CircularProgress variant="determinate" value={75} size={30} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Chips & Avatars */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Chips & Avatars</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip label="Pop" color="primary" />
                      <Chip label="Rock" color="secondary" />
                      <Chip label="Jazz" variant="outlined" />
                      <Chip label="Classical" onDelete={() => {}} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Avatar>U</Avatar>
                      <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>M</Avatar>
                      <Avatar src="/placeholder-avatar.jpg" />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Alerts */}
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Alerts</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Alert severity="success">Media file loaded successfully!</Alert>
                      <Alert severity="warning">Low audio quality detected</Alert>
                      <Alert severity="error">Failed to connect to media server</Alert>
                      <Alert severity="info">New playlist feature available</Alert>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </>
        )}

        {/* Tab Panel 5: Design */}
        {tabValue === 4 && (
          <>
            <Grid size={{ xs: 12 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Theme</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <FormControl size="small" sx={{ minWidth: 220 }}>
                        <InputLabel id="theme-select-label">Theme</InputLabel>
                        <Select
                          labelId="theme-select-label"
                          label="Theme"
                          value={themeName || ''}
                          onChange={(e) => onSelectTheme?.(e.target.value)}
                        >
                          {(themeOptions || []).map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControlLabel control={<Switch checked={!!isDark} onChange={onToggleTheme} />} label={isDark ? 'Dark' : 'Light'} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Typography</Typography>
                    <Typography variant="h1">H1 Heading</Typography>
                    <Typography variant="h2">H2 Heading</Typography>
                    <Typography variant="h3">H3 Heading</Typography>
                    <Typography variant="h4">H4 Heading</Typography>
                    <Typography variant="h5">H5 Heading</Typography>
                    <Typography variant="h6">H6 Heading</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>Body1 — The quick brown fox jumps over the lazy dog.</Typography>
                    <Typography variant="body2">Body2 — The quick brown fox jumps over the lazy dog.</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Color Palette</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 2, px: 1 }}>
                      {[
                        // Primary scale
                        theme.palette.primary.light,
                        theme.palette.primary.main,
                        theme.palette.primary.dark,
                        // Secondary scale
                        theme.palette.secondary.light,
                        theme.palette.secondary.main,
                        theme.palette.secondary.dark,
                        // Background + text
                        theme.palette.background.default,
                        theme.palette.background.paper,
                        theme.palette.text.primary as any,
                        theme.palette.text.secondary as any,
                        // Status colors
                        theme.palette.success.main,
                        theme.palette.warning.main,
                        theme.palette.error.main,
                        (theme.palette.info?.main || theme.palette.primary.light),
                      ].map((color, i) => (
                        <Box key={i} sx={{ p: 1, minHeight: 72, bgcolor: color, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="caption" sx={{ color: theme.palette.getContrastText(String(color)), fontWeight: 600, whiteSpace: 'nowrap', px: 0.5 }}>
                            {String(color).toUpperCase()}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </>
        )}

        {/* Tab Panel 2: Forms */}
        {tabValue === 1 && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Form Controls</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField label="Playlist Name" variant="outlined" />
                      <TextField label="Search Media" variant="filled" />
                      <FormControl>
                        <InputLabel>Category</InputLabel>
                        <Select label="Category" defaultValue="">
                          <MenuItem value="music">Music</MenuItem>
                          <MenuItem value="video">Video</MenuItem>
                          <MenuItem value="podcast">Podcast</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Controls</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControlLabel control={<Switch defaultChecked />} label="Auto-play" />
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Shuffle" />
                      <Typography gutterBottom>Volume</Typography>
                      <Slider
                        value={sliderValue}
                        onChange={(_, value) => setSliderValue(value as number)}
                        valueLabelDisplay="auto"
                      />
                      <RadioGroup defaultValue="normal">
                        <FormControlLabel value="low" control={<Radio />} label="Low Quality" />
                        <FormControlLabel value="normal" control={<Radio />} label="Normal Quality" />
                        <FormControlLabel value="high" control={<Radio />} label="High Quality" />
                      </RadioGroup>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </>
        )}

        {/* Tab Panel 3: Media Controls */}
        {tabValue === 2 && (
          <>
            <Grid size={{ xs: 12}}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Media Player Controls</Typography>
                    <Box sx={{ textAlign: 'center', p: 3 }}>
                      <Typography variant="h5" gutterBottom>
                        Now Playing: "Sample Track"
                      </Typography>
                      <LinearProgress variant="determinate" value={45} sx={{ mb: 3 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                        <IconButton size="large">
                          <PlayArrow fontSize="large" />
                        </IconButton>
                        <IconButton size="large">
                          <Pause fontSize="large" />
                        </IconButton>
                        <IconButton size="large">
                          <VolumeUp fontSize="large" />
                        </IconButton>
                      </Box>

                      <ToggleButtonGroup
                        value={toggleValue}
                        exclusive
                        onChange={(_, value) => setToggleValue(value)}
                      >
                        <ToggleButton value="list">
                          <LibraryMusic />
                        </ToggleButton>
                        <ToggleButton value="view1">
                          <Home />
                        </ToggleButton>
                        <ToggleButton value="view2">
                          <Settings />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </>
        )}

        {/* Tab Panel 4: Layout */}
        {tabValue === 3 && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>Navigation</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><Home /></ListItemIcon>
                      <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><LibraryMusic /></ListItemIcon>
                      <ListItemText primary="Library" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Search /></ListItemIcon>
                      <ListItemText primary="Search" />
                    </ListItem>
                  </List>
                </Paper>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Accordion 
                    expanded={accordionExpanded === 'panel1'}
                    onChange={(_, expanded) => setAccordionExpanded(expanded ? 'panel1' : false)}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Recent Playlists</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Your recently played playlists will appear here with quick access controls.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion 
                    expanded={accordionExpanded === 'panel2'}
                    onChange={(_, expanded) => setAccordionExpanded(expanded ? 'panel2' : false)}
                  >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>Recommended</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        AI-powered recommendations based on your listening history and preferences.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </motion.div>
            </Grid>
          </>
        )}
      </Grid>

      {/* Floating Action Button */}
      <SpeedDial
        ariaLabel="Media Controls"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              logUserAction('speed_dial_action', { action: action.name });
              setSpeedDialOpen(false);
            }}
          />
        ))}
      </SpeedDial>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            background: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(30, 30, 30, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: (theme) => 
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem onClick={() => { 
          logUserAction('navigation', { from: 'theme_showcase', to: 'media_player' }); 
          navigate('/'); 
          handleMenuClose(); 
        }}>
          <PlayCircle sx={{ mr: 2 }} />
          Media Player
        </MenuItem>
        <MenuItem onClick={() => { 
          logUserAction('navigation', { from: 'theme_showcase', to: 'settings' }); 
          navigate('/settings'); 
          handleMenuClose(); 
        }}>
          <SettingsIcon sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={() => { 
          logUserAction('navigation', { from: 'theme_showcase', to: 'about' }); 
          navigate('/about'); 
          handleMenuClose(); 
        }}>
          <InfoIcon sx={{ mr: 2 }} />
          About
        </MenuItem>
      </Menu>

      {/* Logging Dashboard */}
      <LoggingDashboard 
        isOpen={isLoggingDashboardOpen} 
        onClose={() => setIsLoggingDashboardOpen(false)} 
      />

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          MediaPlayer Theme Showcase - {theme.palette.mode === 'dark' ? 'Dark' : 'Light'} Mode
        </Typography>
      </motion.div>
    </Box>
  );
}
