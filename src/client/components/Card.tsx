import React from 'react';
import { theme } from '../styles/theme';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, title, style }) => {
  const cardStyle: React.CSSProperties = {
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    boxShadow: theme.colors.shadow,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    ...style
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fontSize.lg,
    fontWeight: 700,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm
  };

  return (
    <div style={cardStyle}>
      {title && <h2 style={titleStyle}>{title}</h2>}
      {children}
    </div>
  );
};
