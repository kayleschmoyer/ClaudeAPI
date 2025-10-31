import { COLORS } from '../../shared/constants/colors';

export const theme = {
  colors: {
    primary: COLORS.KLIPBOARD_MAGENTA,
    text: COLORS.CHARCOAL,
    background: COLORS.BISCUIT,
    surface: COLORS.WHITE,
    border: `${COLORS.CHARCOAL}20`,
    borderHover: `${COLORS.CHARCOAL}40`,
    shadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    shadowLg: '0 8px 24px rgba(0, 0, 0, 0.12)'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px'
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px'
  }
};
