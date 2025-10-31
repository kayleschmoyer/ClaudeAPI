import React, { useEffect, useRef } from 'react';
import { ActivityEntry } from '../../../shared/types';
import { Card } from '../../components/Card';
import { ActivityItem } from './ActivityItem';
import { theme } from '../../styles/theme';

interface ActivityLogProps {
  activities: ActivityEntry[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activities]);

  const listContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    overflowY: 'auto',
    flex: 1,
    maxHeight: 'calc(100vh - 200px)'
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

  return (
    <Card title="Activity Log" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div ref={containerRef} style={listContainerStyle}>
        {activities.length === 0 ? (
          <div style={emptyStateStyle}>
            No activity yet
          </div>
        ) : (
          activities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </Card>
  );
};
