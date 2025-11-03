import { RequestConfig, ApiResponse, CSVRow, BulkImportResponse, InventoryCSVRow } from '../../shared/types';

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

export async function sendBulkImport(rows: CSVRow[], url: string, token: string): Promise<BulkImportResponse> {
  const response = await fetch('/api/bulkImport', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rows, url, token })
  });

  if (!response.ok) {
    throw new Error('Failed to send bulk import');
  }

  return response.json();
}

export async function sendInventoryAdjustment(url: string, token: string, body: any): Promise<any> {
  const response = await fetch('/api/inventory/sendInventoryAdjustment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, token, body })
  });

  if (!response.ok) {
    throw new Error('Failed to send inventory adjustment');
  }

  return response.json();
}

export async function sendBulkInventoryAdjustment(rows: InventoryCSVRow[], url: string, token: string): Promise<BulkImportResponse> {
  const response = await fetch('/api/inventory/bulkInventoryAdjustment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ rows, url, token })
  });

  if (!response.ok) {
    throw new Error('Failed to send bulk inventory adjustment');
  }

  return response.json();
}
