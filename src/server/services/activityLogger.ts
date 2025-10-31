import { ActivityEntry, RequestConfig } from '../../shared/types/index.js';

let activityCounter = 0;

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createActivity(
  requestId: string,
  type: ActivityEntry['type'],
  message: string
): ActivityEntry {
  return {
    id: `activity_${activityCounter++}`,
    timestamp: Date.now(),
    requestId,
    type,
    message
  };
}

export function logRequestStart(
  requestId: string,
  config: RequestConfig
): ActivityEntry {
  return createActivity(
    requestId,
    'info',
    `Preparing request...`
  );
}

export function logRequestSending(
  requestId: string,
  config: RequestConfig
): ActivityEntry {
  return createActivity(
    requestId,
    'info',
    `Sending ${config.method} to ${config.url}`
  );
}

export function logAuthAttached(
  requestId: string,
  config: RequestConfig
): ActivityEntry | null {
  if (config.auth.type === 'bearer') {
    const masked = config.auth.bearer?.token.substring(0, 4) + '****';
    return createActivity(
      requestId,
      'info',
      `Attached Authorization header (Bearer ${masked})`
    );
  } else if (config.auth.type === 'apiKey') {
    return createActivity(
      requestId,
      'info',
      `Attached API Key header (${config.auth.apiKey?.headerName})`
    );
  } else if (config.auth.type === 'custom') {
    return createActivity(
      requestId,
      'info',
      `Attached custom authentication headers`
    );
  }
  return null;
}

export function logRequestSuccess(
  requestId: string,
  status: number,
  statusText: string,
  responseTime: number
): ActivityEntry {
  return createActivity(
    requestId,
    'success',
    `Received ${status} ${statusText} in ${responseTime}ms`
  );
}

export function logResponseParsed(
  requestId: string,
  size: number
): ActivityEntry {
  const sizeKb = (size / 1024).toFixed(1);
  return createActivity(
    requestId,
    'success',
    `Parsed ${sizeKb}kb response body`
  );
}

export function logRequestError(
  requestId: string,
  error: any
): ActivityEntry {
  const message = error.response
    ? `Request failed with ${error.response.status} ${error.response.statusText}`
    : error.message || 'Request failed';
  return createActivity(requestId, 'error', message);
}
