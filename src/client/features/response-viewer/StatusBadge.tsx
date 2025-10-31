import React from 'react';
import { Badge } from '../../components/Badge';

interface StatusBadgeProps {
  status: number;
  statusText: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, statusText }) => {
  const getVariant = () => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 300 && status < 400) return 'info';
    if (status >= 400 && status < 500) return 'warning';
    if (status >= 500) return 'error';
    return 'primary';
  };

  return (
    <Badge variant={getVariant()}>
      {status} {statusText}
    </Badge>
  );
};
