import { useState } from 'react';
import { ActivityEntry } from '../../shared/types';

export function useActivityLog() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  const addActivities = (newActivities: ActivityEntry[]) => {
    setActivities(prev => [...prev, ...newActivities]);
  };

  const clearActivities = () => {
    setActivities([]);
  };

  return {
    activities,
    addActivities,
    clearActivities
  };
}
