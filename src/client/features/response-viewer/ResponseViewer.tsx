import React from 'react';
import { ResponseData } from '../../../shared/types';
import { Card } from '../../components/Card';
import { StatusBadge } from './StatusBadge';
import { HeadersDisplay } from './HeadersDisplay';
import { theme } from '../../styles/theme';

interface ResponseViewerProps {
  response: ResponseData | null;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    height: '100%'
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const metaItemStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text
  };

  const bodyContainerStyle: React.CSSProperties = {
    background: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.sm,
    fontFamily: 'Monaco, Menlo, monospace',
    overflow: 'auto',
    flex: 1,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  };

  const emptyStateStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.colors.text,
    opacity: 0.5,
    fontSize: theme.fontSize.md
  };

  if (!response) {
    return (
      <Card title="Response" style={{ height: '100%' }}>
        <div style={emptyStateStyle}>
          No response yet
        </div>
      </Card>
    );
  }

  const formatBody = () => {
    if (typeof response.body === 'string') {
      return response.body;
    }
    try {
      return JSON.stringify(response.body, null, 2);
    } catch {
      return String(response.body);
    }
  };

  return (
    <Card title="Response" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={containerStyle}>
        <div style={metaStyle}>
          <StatusBadge status={response.status} statusText={response.statusText} />
          <span style={metaItemStyle}>
            <strong>Time:</strong> {response.responseTime}ms
          </span>
          <span style={metaItemStyle}>
            <strong>Size:</strong> {(response.responseSize / 1024).toFixed(2)}kb
          </span>
        </div>

        <HeadersDisplay headers={response.headers} />

        <div>
          <div style={{ fontSize: theme.fontSize.sm, fontWeight: 600, marginBottom: theme.spacing.sm }}>
            Response Body
          </div>
          <div style={bodyContainerStyle}>
            {formatBody()}
          </div>
        </div>
      </div>
    </Card>
  );
};
