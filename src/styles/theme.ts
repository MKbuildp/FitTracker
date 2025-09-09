import { Dimensions } from 'react-native';

// Základní rozměry obrazovky
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpointy pro různé velikosti telefonů
const breakpoints = {
  small: 375,   // iPhone SE, malé telefony
  medium: 414,  // iPhone Plus, střední telefony  
  large: 480    // Velké telefony, fold telefony
};

// Funkce pro určení velikosti obrazovky
const getScreenSize = () => {
  if (screenWidth <= breakpoints.small) return 'small';
  if (screenWidth <= breakpoints.medium) return 'medium';
  return 'large';
};

// Multiplikátory pro škálování
const responsiveMultipliers = {
  small: 0.85,
  medium: 1.0,
  large: 1.15
};

// Helper funkce pro responzivní velikosti
const responsiveSize = (baseSize: number) => {
  const multiplier = responsiveMultipliers[getScreenSize()];
  return Math.round(baseSize * multiplier);
};

const responsiveFontSize = (baseFontSize: number) => {
  const multiplier = responsiveMultipliers[getScreenSize()];
  return Math.round(baseFontSize * multiplier);
};

const responsiveSpacing = (baseSpacing: number) => {
  const multiplier = responsiveMultipliers[getScreenSize()];
  return Math.round(baseSpacing * multiplier);
};

// Responzivní komponenty
export const responsiveComponents = {
  buttonHeight: responsiveSize(50),
  iconSize: responsiveSize(24),
  actionButtonSize: responsiveSize(36),
  onlineIndicatorSize: responsiveSize(12),
  cardPadding: responsiveSpacing(16),
  cardMarginBottom: responsiveSpacing(12),
  cardBorderRadius: responsiveSize(12),
  progressBarSize: responsiveSize(52),
  progressBarStrokeWidth: responsiveSize(5),
};

// Responzivní typografie
export const responsiveTypography = {
  title: { fontSize: responsiveFontSize(24) },
  subtitle: { fontSize: responsiveFontSize(18) },
  body: { fontSize: responsiveFontSize(16) },
  caption: { fontSize: responsiveFontSize(14) },
  button: { fontSize: responsiveFontSize(18) },
  cardTitle: { fontSize: responsiveFontSize(16) },
  cardValue: { fontSize: responsiveFontSize(14.6) },
  cardDescription: { fontSize: responsiveFontSize(11.4) },
  languageTitle: { fontSize: responsiveFontSize(28) },
  languageSubtitle: { fontSize: responsiveFontSize(20) },
  languageDescription: { fontSize: responsiveFontSize(16) },
  languageButton: { fontSize: responsiveFontSize(18) },
  languageButtonDescription: { fontSize: responsiveFontSize(14) },
};

// Responzivní spacing hodnoty
export const responsiveSpacingValues = {
  xxs: responsiveSpacing(2),
  xs: responsiveSpacing(4),
  sm: responsiveSpacing(8),
  md: responsiveSpacing(16),
  lg: responsiveSpacing(24),
  xl: responsiveSpacing(32),
  xxl: responsiveSpacing(48),
};

// Export základních rozměrů pro speciální případy
export const screenDimensions = {
  width: screenWidth,
  height: screenHeight,
};

// Export breakpointů pro podmíněné styly
export const breakpointValues = breakpoints;

// Export funkce pro určení velikosti obrazovky
export const getCurrentScreenSize = getScreenSize;

// Export helper funkcí pro responzivní design
export { responsiveSize, responsiveFontSize, responsiveSpacing };
