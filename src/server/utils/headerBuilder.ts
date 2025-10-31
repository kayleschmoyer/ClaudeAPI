import { HeaderEntry, AuthConfig } from '../../shared/types/index.js';

export function buildHeaders(
  headers: HeaderEntry[],
  auth: AuthConfig
): Record<string, string> {
  const result: Record<string, string> = {};

  headers.forEach(header => {
    if (header.enabled && header.key && header.value) {
      result[header.key] = header.value;
    }
  });

  if (auth.type === 'apiKey' && auth.apiKey) {
    result[auth.apiKey.headerName] = auth.apiKey.value;
  } else if (auth.type === 'bearer' && auth.bearer) {
    result['Authorization'] = `Bearer ${auth.bearer.token}`;
  } else if (auth.type === 'custom' && auth.customHeaders) {
    auth.customHeaders.forEach(header => {
      if (header.enabled && header.key && header.value) {
        result[header.key] = header.value;
      }
    });
  }

  return result;
}
