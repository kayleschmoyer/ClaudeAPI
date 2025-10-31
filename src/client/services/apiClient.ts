import { RequestConfig, ApiResponse } from '../../shared/types';

export async function sendRequest(config: RequestConfig): Promise<ApiResponse> {
  const response = await fetch('/api/sendRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });

  if (!response.ok) {
    throw new Error('Failed to send request');
  }

  return response.json();
}
