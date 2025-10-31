export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type AuthType = 'none' | 'apiKey' | 'bearer' | 'custom';

export interface HeaderEntry {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export interface AuthConfig {
  type: AuthType;
  apiKey?: {
    headerName: string;
    value: string;
  };
  bearer?: {
    token: string;
  };
  customHeaders?: HeaderEntry[];
}

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers: HeaderEntry[];
  auth: AuthConfig;
  body?: string;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  responseTime: number;
  responseSize: number;
}

export interface ActivityEntry {
  id: string;
  timestamp: number;
  requestId: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export interface ApiResponse {
  success: boolean;
  data?: ResponseData;
  activities: ActivityEntry[];
  error?: string;
}
