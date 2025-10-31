import { RequestConfig, ResponseData, ActivityEntry } from '../../shared/types/index.js';

export interface HttpRequestResult {
  data: ResponseData;
  activities: ActivityEntry[];
}

export interface TimingInfo {
  startTime: number;
  endTime: number;
  duration: number;
}
