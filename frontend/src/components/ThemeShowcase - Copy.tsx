import { useMemo, useState } from 'react';
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
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Divider,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Breadcrumbs,
  Link,
  Tooltip,
  Stack
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  Settings,
  Favorite,
  Share,
  Home,
  LibraryMusic,
  Search,
  AccountCircle,
  Tune,
  Palette,
  BlurOn,
  RocketLaunch
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { alpha, useTheme } from '@mui/material/styles';
import { AnimatedLogo } from './AnimatedLogo';
import { useLogger } from '../hooks/useLogger';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

/** Small swatch chip for the Accent picker */
function AccentChip({
  value,
  current,
  onSelect,
}: {
  value: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
  current: string;
  onSelect: (v: any) => void;
}) {
  return (
    <Chip
      label={(value?.[0]?.toUpperCase() ?? '') + (value?.slice?.(1) ?? '')}
      onClick={() => onSelect(value)}
      clickable
      color={current === value ? (value as any) : undefined}
      variant={current === value ? 'filled' : 'outlined'}
      sx={{
        borderRadius: 999,
        px: 1.25,
      }}
    />
  );
}

export function ThemeShowcase() {
  const theme = useTheme();
  const { logUserAction } = useLogger('ThemeShowcase+Neo');

  // Controls
  const [tab, setTab] = useState(0);
  const [radius, setRadius] = useState<number>(4); // default moved to match your current look
  const [elev, setElev] = useState<number>(8);
  const [blur, setBlur] = useState<number>(8);
  const [accent, setAccent] = useState<'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'>('primary');
  const [density, setDensity] = useState<number>(12);
  const [chipFilter, setChipFilter] = useState<string | null>('All');
  const [toggle, setToggle] = useState('list');

  const bgGradient = useMemo(() => {
    const p = theme.palette;
    const a = (p as any)[accent]?.main ?? p.primary.main;
    const b = p.mode === 'dark' ? p.background.default : '#ffffff';
    return `radial-gradient(1200px 600px at 0% 0%, ${alpha(a, 0.12)} 0%, transparent 60%),
            radial-gradient(1200px 600px at 100% 0%, ${alpha(p.secondary.main, 0.10)} 0%, transparent 60%),
            linear-gradient(180deg, ${alpha(b, 0.6)} 0%, ${alpha(b, 1)} 40%)`;
  }, [theme, accent]);

  const glass = (opacity = 0.12) => ({
    backdropFilter: `saturate(140%) blur(${blur}px)`,
    background: alpha(theme.palette.common.white, theme.palette.mode === 'dark' ? opacity * 0.5 : opacity),
    border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
    borderRadius: radius
  });

  const sectionTitle = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 }
  };

  const handleTab = (_: React.SyntheticEvent, v: number) => {
    setTab(v);
    logUserAction('tab_changed', { v });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 4,
        px: { xs: 2, md: 3 },
        backgroundImage: bgGradient
      }}
    >
      {/* Top AppBar */}
      <AppBar
        position="sticky"
        elevation={elev}
        sx={{
          borderRadius: 3,
          mx: 'auto',
          width: 'min(1200px, 100%)',
          background: `linear-gradient(90deg, ${alpha(theme.palette.background.paper, 0.6)}, ${alpha(theme.palette.background.paper, 0.9)})`,
          backdropFilter: `blur(${Math.max(4, blur - 2)}px)`
        }}
      >
        <Toolbar>
          <AnimatedLogo size={40} showText />
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip title="Search"><IconButton color="inherit"><Search /></IconButton></Tooltip>
          <Tooltip title="Account"><IconButton color="inherit"><AccountCircle /></IconButton></Tooltip>
          <Tooltip title="Settings"><IconButton color="inherit"><Settings /></IconButton></Tooltip>
        </Toolbar>
      </AppBar>

      {/* Header crumbs */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        sx={{ width: 'min(1200px, 100%)', mx: 'auto', mt: 2, mb: 1 }}
      >
        <Breadcrumbs sx={{ opacity: 0.9 }}>
          <Link underline="hover" color="inherit" href="#"><Home sx={{ mr: 0.5, fontSize: 'inherit' }} />Home</Link>
          <Link underline="hover" color="inherit" href="#">Showcase</Link>
          <Typography color="text.primary">Neo</Typography>
        </Breadcrumbs>
      </MotionBox>

      {/* Title and quick controls */}
      <Box sx={{ width: 'min(1200px, 100%)', mx: 'auto', mb: 3 }}>
        <MotionBox variants={sectionTitle} initial="initial" animate="animate">
          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -0.5, mb: 1 }}>
            Neo Theme Showcase
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Live tune the surface: radius, elevation, blur, and accent. See components adapt in real time.
          </Typography>
        </MotionBox>

        {/* Controls row: sliders left, accent picker right */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Sliders panel */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 2, ...glass(0.10) }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BlurOn fontSize="small" /> Blur
                    </Typography>
                    <Slider min={0} max={20} value={blur} onChange={(_, v) => setBlur(v as number)} />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tune fontSize="small" /> Radius
                    </Typography>
                    <Slider min={0} max={28} value={radius} onChange={(_, v) => setRadius(v as number)} />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="caption">Elevation</Typography>
                    <Slider min={0} max={24} value={elev} onChange={(_, v) => setElev(v as number)} />
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={1}>
                    <Typography variant="caption">Density</Typography>
                    <Slider min={8} max={28} value={density} onChange={(_, v) => setDensity(v as number)} />
                    <Typography variant="caption" color="text.secondary">
                      Controls padding in demo cards. Try dragging.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Accent picker panel */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2, ...glass(0.10) }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Palette fontSize="small" /> Accent
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(['primary','secondary','success','warning','info','error'] as const).map((v) => (
                  <AccentChip key={v} value={v} current={accent} onSelect={(x) => setAccent(x)} />
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tab} onChange={handleTab}>
            <Tab label="Preview" />
            <Tab label="Inputs" />
            <Tab label="Feedback" />
            <Tab label="Layout" />
          </Tabs>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ width: 'min(1200px, 100%)', mx: 'auto' }}>
        {/* Tab 0: Live Preview */}
        {tab === 0 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <MotionCard
                elevation={elev}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                sx={{ p: density / 2, ...glass(), overflow: 'hidden' }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Player Preview</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: (theme.palette as any)[accent]?.main }}>
                      <LibraryMusic />
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography noWrap>Lo-Fi Study Beats</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>Various Artists</Typography>
                    </Box>
                    <IconButton color={accent as any}><Favorite /></IconButton>
                    <IconButton><Share /></IconButton>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={62}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: alpha(theme.palette.text.primary, 0.12),
                      '& .MuiLinearProgress-bar': { borderRadius: 999 }
                    }}
                    color={accent}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mt: 2 }}>
                    <Button variant="contained" color={accent} startIcon={<PlayArrow />}>Play</Button>
                    <Button variant="outlined" startIcon={<Pause />}>Pause</Button>
                    <IconButton color={accent as any}><VolumeUp /></IconButton>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <MotionCard
                elevation={elev}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                sx={{ p: density / 2, ...glass() }}
              >
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Quick Filters</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['All', 'Focus', 'Workout', 'Chill', 'Deep', 'Party'].map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      clickable
                      color={chipFilter === tag ? accent : undefined}
                      onClick={() => setChipFilter(tag)}
                      variant={chipFilter === tag ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="overline" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>Status</Typography>
                <Alert severity="success" sx={{ mb: 1 }}>Theme preview is interactive</Alert>
                <Alert severity="info">Try hover on cards and change the sliders</Alert>
              </MotionCard>
            </Grid>
          </Grid>
        )}

        {/* Tab 1: Inputs */}
        {tab === 1 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionCard elevation={elev} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 240, damping: 22 }} sx={{ p: density / 2, ...glass() }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Form Controls</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Playlist Name" variant="outlined" />
                  <FormControl>
                    <InputLabel>Category</InputLabel>
                    <Select label="Category" defaultValue="music">
                      <MenuItem value="music">Music</MenuItem>
                      <MenuItem value="video">Video</MenuItem>
                      <MenuItem value="podcast">Podcast</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControlLabel control={<Switch defaultChecked color={accent} />} label="Auto play" />
                </Box>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <MotionCard elevation={elev} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 240, damping: 22 }} sx={{ p: density / 2, ...glass() }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Controls</Typography>
                <Typography gutterBottom>Volume</Typography>
                <Slider color={accent} defaultValue={50} valueLabelDisplay="auto" />
                <RadioGroup defaultValue="normal" sx={{ mt: 1 }}>
                  <FormControlLabel value="low" control={<Radio />} label="Low" />
                  <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                  <FormControlLabel value="high" control={<Radio />} label="High" />
                </RadioGroup>
              </MotionCard>
            </Grid>
          </Grid>
        )}

        {/* Tab 2: Feedback */}
        {tab === 2 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <MotionCard elevation={elev} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 240, damping: 22 }} sx={{ p: density / 2, ...glass() }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Progress & Loading</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>Buffering</Typography>
                  <LinearProgress color={accent} sx={{ height: 8, borderRadius: 999, mt: 1 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <CircularProgress size={32} color={accent} />
                  <CircularProgress variant="determinate" value={72} size={32} />
                </Box>
              </MotionCard>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <MotionCard elevation={elev} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 240, damping: 22 }} sx={{ p: density / 2, ...glass() }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Alerts</Typography>
                <Alert severity="success" sx={{ mb: 1 }}>Operation completed</Alert>
                <Alert severity="warning" sx={{ mb: 1 }}>Check your connection</Alert>
                <Alert severity="error" sx={{ mb: 1 }}>Action failed</Alert>
                <Alert severity="info">New feature available</Alert>
              </MotionCard>
            </Grid>
          </Grid>
        )}

        {/* Tab 3: Layout */}
        {tab === 3 && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: density / 2, ...glass() }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Navigation</Typography>
                <Box sx={{ display: 'grid', gap: 1 }}>
                  <Button startIcon={<Home />} variant="text">Home</Button>
                  <Button startIcon={<LibraryMusic />} variant="text">Library</Button>
                  <Button startIcon={<Search />} variant="text">Search</Button>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: density / 2, ...glass() }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Panels</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Paper sx={{ p: 2, ...glass(0.08) }}>
                    <Typography>Recent Playlists</Typography>
                    <Typography variant="body2" color="text.secondary">Quick access, personalized</Typography>
                  </Paper>
                  <Paper sx={{ p: 2, ...glass(0.08) }}>
                    <Typography>Recommended</Typography>
                    <Typography variant="body2" color="text.secondary">AI powered picks for you</Typography>
                  </Paper>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Bottom quick actions */}
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} sx={{ mt: 4 }}>
          <Paper sx={{ p: 2, ...glass() }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RocketLaunch fontSize="small" /> Quick view
              </Typography>
              <ToggleButtonGroup value={toggle} exclusive onChange={(_, v) => v && setToggle(v)} size="small">
                <ToggleButton value="list"><LibraryMusic /></ToggleButton>
                <ToggleButton value="home"><Home /></ToggleButton>
                <ToggleButton value="settings"><Settings /></ToggleButton>
              </ToggleButtonGroup>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" color={accent} startIcon={<PlayArrow />}>Start</Button>
              <Button variant="outlined" startIcon={<Pause />}>Pause</Button>
              <IconButton><Share /></IconButton>
            </Box>
          </Paper>
        </MotionBox>

        {/* Footer */}
        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
          Neo Showcase, {theme.palette.mode === 'dark' ? 'Dark' : 'Light'} mode
        </Typography>
      </Box>
    </Box>
  );
}
