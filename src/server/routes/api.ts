import { Router, Request, Response } from 'express';
import { RequestConfig, ApiResponse, CSVRow, BulkImportResult } from '../../shared/types/index.js';
import { dispatchRequest } from '../services/http/requestDispatcher.js';
import { mapCSVRowToVOLProduct } from '../services/csvMapper.js';
import axios from 'axios';
import { buildVolHeaders } from '../utils/headerBuilder.js';

const router = Router();

router.post('/sendRequest', async (req: Request, res: Response) => {
  try {
    const config: RequestConfig = req.body;

    if (!config.url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
        activities: []
      });
    }

    if (!config.method) {
      return res.status(400).json({
        success: false,
        error: 'HTTP method is required',
        activities: []
      });
    }

    const result = await dispatchRequest(config);

    const response: ApiResponse = {
      success: true,
      data: result.data,
      activities: result.activities
    };

    res.json(response);
  } catch (error: any) {
    console.error('Request failed:', error);

    const response: ApiResponse = {
      success: false,
      error: error.message || 'Request failed',
      activities: []
    };

    res.status(500).json(response);
  }
});

router.post('/bulkImport', async (req: Request, res: Response) => {
  try {
    const { rows, url, token } = req.body as { rows: CSVRow[], url: string, token: string };

    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({
        error: 'Invalid request: rows array is required'
      });
    }

    if (!url) {
      return res.status(400).json({
        error: 'Invalid request: url is required'
      });
    }

    if (!token) {
      return res.status(400).json({
        error: 'Invalid request: token is required'
      });
    }

    const results: BulkImportResult[] = [];
    const headers = buildVolHeaders(token);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 1;

      try {
        const productPayload = mapCSVRowToVOLProduct(row);

        const response = await axios({
          method: 'POST',
          url: url,
          headers: headers,
          data: productPayload,
          validateStatus: () => true
        });

        results.push({
          rowNumber,
          httpStatusCode: response.status,
          statusText: response.status >= 200 && response.status < 300 ? 'Created' : 'Failed',
          requestBody: productPayload,
          responseBody: response.data,
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        results.push({
          rowNumber,
          httpStatusCode: 500,
          statusText: 'Failed',
          requestBody: mapCSVRowToVOLProduct(row),
          responseBody: {
            error: error.message || 'Request failed'
          },
          timestamp: new Date().toISOString()
        });
      }
    }

    res.json({ results });
  } catch (error: any) {
    console.error('Bulk import failed:', error);
    res.status(500).json({
      error: error.message || 'Bulk import failed'
    });
  }
});

export default router;
