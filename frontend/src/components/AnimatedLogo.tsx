import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useLogger } from '../hooks/useLogger';

interface AnimatedLogoProps {
  size?: number;
  showText?: boolean;
}

export function AnimatedLogo({ size = 60, showText = false }: AnimatedLogoProps) {
  const theme = useTheme();
  const { logUserAction } = useLogger('AnimatedLogo');

  // Guard so we log hover only once per continuous hover session
  const hoveringRef = useRef(false);

  const handleHoverStart = () => {
    if (!hoveringRef.current) {
      hoveringRef.current = true;
      logUserAction('logo_hovered');
    }
  };

  const handleHoverEnd = () => {
    hoveringRef.current = false;
  };
  const handleClick = () => {
    logUserAction('logo_clicked');
  };

  // Variants for wrapper scale and subtle tilt
  const logoVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
    },
    tap: {
      scale: 0.95,
      rotate: -2,
      transition: { type: 'spring' as const, stiffness: 400, damping: 17 },
    },
  };

  const textVariants = {
    idle: { opacity: 0.8, x: 0 },
    hover: {
      opacity: 1,
      x: 5,
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
    },
  };

  const primaryColor = theme.palette.primary.main;
  const secondaryColor = theme.palette.secondary.main;
  const contrastOnPrimary = theme.palette.getContrastText(primaryColor);

  // Ensure numeric size and stable coordinates
  const S = Number.isFinite(size) && size! > 0 ? size! : 60;
  const baseR = 35; // viewBox is 100x100

  return (
    <Box
      component={motion.div}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      variants={logoVariants}
      role="button"
      tabIndex={0}
      aria-label="MediaPlayer Logo"
      sx={{
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        // Small padding keeps the pointer within the wrapper when SVG scales
        p: 1,
      }}
    >
      <motion.svg
        width={S}
        height={S}
        viewBox="0 0 100 100"        
        style={{ overflow: 'visible', display: 'block' }}
        // Ensure the wrapper handles interactions
        pointerEvents="none"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="70%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        {/* High-contrast outer ring to improve separation on blue backgrounds */}
        <circle
          cx={50}
          cy={50}
          r={baseR + 3}
          fill="none"
          stroke={contrastOnPrimary}
          strokeWidth={3}
          opacity={0.9}
        />

        {/* Main pulse circle, numeric attrs only */}
        <motion.circle
          cx={50}
          cy={50}
          r={baseR}
          fill="url(#logoGradient)"
          initial={{ r: baseR, opacity: 0.9 }}
          animate={{ r: [baseR, baseR + 2, baseR], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Play triangle */}
        <motion.path
          d="M 40 35 L 40 65 L 65 50 Z"
          fill={contrastOnPrimary}
          stroke="#000000"
          strokeOpacity={0.25}
          strokeWidth={1}
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
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.8, 0.3], strokeWidth: [2.5, 3, 2.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 78 35 Q 88 42 88 50 Q 88 58 78 65"
          fill="none"
          stroke={secondaryColor}
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ opacity: 0.2 }}
          animate={{ opacity: [0.2, 0.6, 0.2], strokeWidth: [2, 2.5, 2] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Musical notes */}
        <motion.circle
          cx={25}
          cy={25}
          r={2}
          fill={secondaryColor}
          initial={{ y: 0, opacity: 0.4, scale: 0.8 }}
          animate={{ y: [0, -5, 0], opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.circle
          cx={75}
          cy={75}
          r={1.5}
          fill={primaryColor}
          initial={{ y: 0, opacity: 0.3, scale: 0.7 }}
          animate={{ y: [0, -3, 0], opacity: [0.3, 0.7, 0.3], scale: [0.7, 1.3, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
      </motion.svg>

      {showText && (
        <motion.div
          variants={textVariants}
          // pointer events through to wrapper
          style={{
            marginLeft: 12,
            fontFamily: theme.typography.fontFamily,
            fontSize: S * 0.3,
            fontWeight: 700,
            color: theme.palette.mode === 'dark' ? theme.palette.common.white : contrastOnPrimary,
            textShadow: '0 0 4px rgba(0,0,0,0.35)',
            pointerEvents: 'none',
          }}
        >
          MediaPlayer
        </motion.div>
      )}
    </Box>
  );
}
