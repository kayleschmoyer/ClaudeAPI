import React, { useState } from 'react';
import { theme } from '../../styles/theme';
import { Button } from '../../components/Button';

interface HeadersDisplayProps {
  headers: Record<string, string>;
}

export const HeadersDisplay: React.FC<HeadersDisplayProps> = ({ headers }) => {
  const [expanded, setExpanded] = useState(false);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    fontWeight: 600,
    color: theme.colors.text
  };

  const headersContainerStyle: React.CSSProperties = {
    background: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Monaco, Menlo, monospace',
    maxHeight: '200px',
    overflow: 'auto'
  };

  const headerEntryStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs
  };

  const keyStyle: React.CSSProperties = {
    fontWeight: 600,
    color: theme.colors.text
  };

  const valueStyle: React.CSSProperties = {
    color: theme.colors.text,
    wordBreak: 'break-all'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>Response Headers</span>
        <Button
          variant="secondary"
          onClick={() => setExpanded(!expanded)}
          style={{ padding: `${theme.spacing.xs} ${theme.spacing.sm}`, fontSize: theme.fontSize.sm }}
        >
          {expanded ? 'Hide' : 'Show'}
        </Button>
      </div>
      {expanded && (
        <div style={headersContainerStyle}>
          {Object.entries(headers).map(([key, value]) => (
            <div key={key} style={headerEntryStyle}>
              <span style={keyStyle}>{key}:</span>
              <span style={valueStyle}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
