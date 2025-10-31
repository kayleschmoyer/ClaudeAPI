import { RequestConfig, ApiResponse, CSVRow, BulkImportResponse } from '../../shared/types';

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

export async function sendBulkImport(rows: CSVRow[]): Promise<BulkImportResponse> {
  const response = await fetch('/api/bulkImport', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rows })
  });

  if (!response.ok) {
    throw new Error('Failed to send bulk import');
  }

  return response.json();
}
