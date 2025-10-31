import React from 'react';
import { ActivityEntry } from '../../../shared/types';
import { Badge } from '../../components/Badge';
import { theme } from '../../styles/theme';

interface ActivityItemProps {
  activity: ActivityEntry;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderLeft: `4px solid ${theme.colors.primary}`,
    animation: 'slideIn 0.3s ease-out'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm
  };

  const timeStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    opacity: 0.6
  };

  const messageStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text
  };

  const requestIdStyle: React.CSSProperties = {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text,
    opacity: 0.5,
    fontFamily: 'Monaco, Menlo, monospace'
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <Badge variant={activity.type}>{activity.type.toUpperCase()}</Badge>
        <span style={timeStyle}>{formatTime(activity.timestamp)}</span>
      </div>
      <div style={messageStyle}>{activity.message}</div>
      <div style={requestIdStyle}>{activity.requestId}</div>
    </div>
  );
};
