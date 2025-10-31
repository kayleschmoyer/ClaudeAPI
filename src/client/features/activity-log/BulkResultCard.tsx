import React from 'react';
import { BulkImportResult } from '../../../shared/types';
import { Badge } from '../../components/Badge';
import { theme } from '../../styles/theme';

interface BulkResultCardProps {
  result: BulkImportResult;
}

export const BulkResultCard: React.FC<BulkResultCardProps> = ({ result }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderLeft: `4px solid ${result.httpStatusCode >= 200 && result.httpStatusCode < 300 ? theme.colors.primary : '#EF4444'}`,
    animation: 'slideIn 0.3s ease-out',
    boxShadow: theme.colors.shadow
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexWrap: 'wrap'
  };

  const headerLeftStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center'
  };

  const rowLabelStyle: React.CSSProperties = {
    fontSize: theme.fontSize.md,
    fontWeight: 700,
    color: theme.colors.text
  };

  const timestampStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    opacity: 0.6
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    fontWeight: 600,
    color: theme.colors.text,
    opacity: 0.8
  };

  const jsonBlockStyle: React.CSSProperties = {
    background: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.xs,
    fontFamily: 'Monaco, Menlo, Consolas, monospace',
    color: theme.colors.text,
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  };

  const getStatusBadgeVariant = (statusCode: number): 'success' | 'error' => {
    return statusCode >= 200 && statusCode < 300 ? 'success' : 'error';
  };

  const formatJSON = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <span style={rowLabelStyle}>Row #{result.rowNumber}</span>
          <Badge variant={getStatusBadgeVariant(result.httpStatusCode)}>
            {result.statusText}
          </Badge>
          <Badge variant="info">
            HTTP {result.httpStatusCode}
          </Badge>
        </div>
        <span style={timestampStyle}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Request Sent:</div>
        <div style={jsonBlockStyle}>
          {formatJSON(result.requestBody)}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Response:</div>
        <div style={jsonBlockStyle}>
          {formatJSON(result.responseBody)}
        </div>
      </div>
    </div>
  );
};
