import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useLogger } from '../hooks/useLogger';

interface AnimatedLogoProps {
  size?: number;
  showText?: boolean;
}

/** Module level throttle for hover logs */
let lastHoverLogTs = 0;
const HOVER_LOG_COOLDOWN_MS = 2000;

export function AnimatedLogo({ size = 60, showText = false }: AnimatedLogoProps) {
  const theme = useTheme();
  const { logUserAction } = useLogger('AnimatedLogo');

  const handlePointerEnter = () => {
    const now = Date.now();
    if (now - lastHoverLogTs > HOVER_LOG_COOLDOWN_MS) {
      lastHoverLogTs = now;
      logUserAction('logo_hovered');
    }
  };

  const handleClick = () => {
    logUserAction('logo_clicked');
  };

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;

  const S = Number.isFinite(size) && size! > 0 ? size! : 60;
  const baseR = 35;

  const textVariants = {
    idle: { opacity: 0.9, x: 0 },
    hover: {
      opacity: 1,
      x: 5,
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
    },
  };

  return (
    <Box
      component={motion.div}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      onPointerEnter={handlePointerEnter}
      onClick={handleClick}
      sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', p: 1 }}
    >
      <motion.svg
        width={S}
        height={S}
        viewBox="0 0 100 100"
        style={{ overflow: 'visible', display: 'block' }}
        pointerEvents="none"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="70%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.7} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Contrast ring */}
        <circle cx={50} cy={50} r={baseR + 3} fill="none" stroke="#ffffff" strokeWidth={3} opacity={0.9} />

        {/* Main animated circle */}
        <motion.circle
          cx={50}
          cy={50}
          r={baseR}
          fill="url(#logoGradient)"
          filter="url(#glow)"
          initial={{ r: baseR, opacity: 0.95 }}
          animate={{ r: [baseR, baseR + 2, baseR], opacity: [0.95, 1, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Play triangle */}
        <motion.path
          d="M 40 35 L 40 65 L 65 50 Z"
          fill="white"
          initial={{ scale: 1, x: 0 }}
          animate={{ scale: [1, 1.05, 1], x: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />

        {/* Sound waves */}
        <motion.path
          d="M 72 40 Q 78 45 78 50 Q 78 55 72 60"
          fill="none"
          stroke={primaryColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.85, 0.4], strokeWidth: [2.5, 3, 2.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 78 35 Q 88 42 88 50 Q 88 58 78 65"
          fill="none"
          stroke={secondaryColor}
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.7, 0.3], strokeWidth: [2, 2.5, 2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Musical notes */}
        <motion.circle
          cx={25}
          cy={25}
          r={2}
          fill={secondaryColor}
          initial={{ y: 0, opacity: 0.5, scale: 0.9 }}
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.circle
          cx={75}
          cy={75}
          r={1.5}
          fill={primaryColor}
          initial={{ y: 0, opacity: 0.4, scale: 0.8 }}
          animate={{ y: [0, -3, 0], opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </motion.svg>

      {showText && (
        <motion.div
          variants={textVariants}
          style={{
            marginLeft: 12,
            fontFamily: theme.typography.fontFamily,
            fontSize: S * 0.3,
            fontWeight: 700,
            color: '#ffffff',
            textShadow: '0 0 4px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}
        >
          MediaPlayer
        </motion.div>
      )}
    </Box>
  );
}
