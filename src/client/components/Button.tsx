import React from 'react';
import { theme } from '../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...props
}) => {
  const isPrimary = variant === 'primary';

  const baseStyle: React.CSSProperties = {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.md,
    fontWeight: 600,
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    ...(isPrimary ? {
      background: theme.colors.primary,
      color: theme.colors.surface,
    } : {
      background: theme.colors.surface,
      color: theme.colors.text,
      border: `2px solid ${theme.colors.border}`,
    }),
    ...style
  };

  return (
    <button
      style={baseStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span>⏳</span>}
      {children}
    </button>
  );
};
