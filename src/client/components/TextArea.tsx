import React from 'react';
import { theme } from '../styles/theme';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  const textAreaStyle: React.CSSProperties = {
    width: '100%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    border: `2px solid ${error ? theme.colors.primary : theme.colors.border}`,
    fontSize: theme.fontSize.sm,
    background: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: 'Monaco, Menlo, monospace',
    resize: 'vertical',
    minHeight: '120px',
    transition: 'all 0.2s ease',
    ...style
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
    width: '100%'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    fontWeight: 600,
    color: theme.colors.text
  };

  const errorStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: 500
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea style={textAreaStyle} {...props} />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};
