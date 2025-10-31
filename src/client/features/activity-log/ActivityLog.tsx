import React, { useEffect, useRef } from 'react';
import { ActivityEntry, BulkImportResult } from '../../../shared/types';
import { Card } from '../../components/Card';
import { ActivityItem } from './ActivityItem';
import { BulkResultCard } from './BulkResultCard';
import { theme } from '../../styles/theme';

interface ActivityLogProps {
  activities: ActivityEntry[];
  bulkResults: BulkImportResult[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities, bulkResults }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activities, bulkResults]);

  const listContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    overflowY: 'auto',
    flex: 1,
    maxHeight: 'calc(100vh - 200px)',
    scrollbarWidth: 'thin',
    scrollbarColor: `${theme.colors.text}40 ${theme.colors.background}`
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

  const hasContent = activities.length > 0 || bulkResults.length > 0;

  return (
    <Card title="Activity / Results" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <style>
        {`
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: ${theme.colors.background};
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb {
            background: ${theme.colors.text}40;
            border-radius: 4px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: ${theme.colors.text}60;
          }
        `}
      </style>
      <div ref={containerRef} style={listContainerStyle}>
        {!hasContent ? (
          <div style={emptyStateStyle}>
            No activity yet
          </div>
        ) : (
          <>
            {activities.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
            {bulkResults.map((result, index) => (
              <BulkResultCard key={`bulk-${index}`} result={result} />
            ))}
          </>
        )}
      </div>
    </Card>
  );
};
