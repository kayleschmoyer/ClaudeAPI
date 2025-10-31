import React from 'react';
import { theme } from '../styles/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  style
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: '#10B981', color: '#FFFFFF' };
      case 'error':
        return { bg: '#EF4444', color: '#FFFFFF' };
      case 'warning':
        return { bg: '#F59E0B', color: '#FFFFFF' };
      case 'info':
        return { bg: theme.colors.text, color: '#FFFFFF' };
      default:
        return { bg: theme.colors.primary, color: '#FFFFFF' };
    }
  };

  const colors = getColors();

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.xs,
    fontWeight: 600,
    background: colors.bg,
    color: colors.color,
    ...style
  };

  return <span style={badgeStyle}>{children}</span>;
};
