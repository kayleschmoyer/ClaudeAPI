import { Router, Request, Response } from 'express';
import axios from 'axios';
import { buildVolHeaders } from '../utils/headerBuilder.js';
import { mapCSVRowsToInventoryPayload } from '../services/inventoryMapper.js';

const router = Router();

router.post('/sendInventoryAdjustment', async (req: Request, res: Response) => {
  try {
    const { url, token, body } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'url is required'
      });
    }

    if (!token) {
      return res.status(400).json({
        error: 'token is required'
      });
    }

    if (!body) {
      return res.status(400).json({
        error: 'body is required'
      });
    }

    const headers = buildVolHeaders(token);

    const response = await axios({
      method: 'PUT',
      url: url,
      headers: headers,
      data: body,
      validateStatus: () => true
    });

    res.json({
      httpStatusCode: response.status,
      requestBody: body,
      responseBody: response.data
    });
  } catch (error: any) {
    console.error('Request failed:', error);
    res.status(500).json({
      httpStatusCode: 500,
      requestBody: req.body.body || {},
      responseBody: {
        error: error.message || 'Request failed'
      }
    });
  }
});

router.post('/bulkInventoryAdjustment', async (req: Request, res: Response) => {
  try {
    const { url, token, rows } = req.body;

    if (!url) {
      return res.status(400).json({
        error: 'url is required'
      });
    }

    if (!token) {
      return res.status(400).json({
        error: 'token is required'
      });
    }

    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({
        error: 'rows array is required'
      });
    }

    const headers = buildVolHeaders(token);
    const payloads = mapCSVRowsToInventoryPayload(rows);

    const logEntries: any[] = [];
    let succeeded = 0;
    let failed = 0;

    // Process each branch payload
    for (let i = 0; i < payloads.length; i++) {
      const payload = payloads[i];

      try {
        const response = await axios({
          method: 'PUT',
          url: url,
          headers: headers,
          data: payload,
          validateStatus: () => true
        });

        const isSuccess = response.status >= 200 && response.status < 300;

        if (isSuccess) {
          succeeded++;
        } else {
          failed++;
        }

        const logEntry: any = {
          payloadNumber: i + 1,
          branchId: payload.branchId,
          adjustmentCount: payload.adjustmentLines.length,
          httpStatusCode: response.status,
          status: isSuccess ? 'Success' : 'Failed',
          requestBody: payload,
          responseBody: response.data,
          timestamp: new Date().toISOString()
        };

        if (!isSuccess) {
          if (response.data?.title) {
            logEntry.message = response.data.title;
          }
          if (response.data?.errors) {
            logEntry.details = Object.values(response.data.errors).flat();
          }
        }

        logEntries.push(logEntry);
      } catch (error: any) {
        failed++;

        logEntries.push({
          payloadNumber: i + 1,
          branchId: payload.branchId,
          adjustmentCount: payload.adjustmentLines.length,
          httpStatusCode: 500,
          status: 'Failed',
          requestBody: payload,
          responseBody: {
            error: error.message || 'Request failed'
          },
          timestamp: new Date().toISOString(),
          message: error.message || 'Request failed'
        });
      }
    }

    const summary = {
      totalPayloads: payloads.length,
      totalRows: rows.length,
      succeeded,
      failed,
      results: logEntries.map(entry => ({
        payloadNumber: entry.payloadNumber,
        branchId: entry.branchId,
        adjustmentCount: entry.adjustmentCount,
        status: entry.status,
        httpCode: entry.httpStatusCode,
        message: entry.message,
        details: entry.details
      }))
    };

    res.json({
      summary,
      logEntries
    });
  } catch (error: any) {
    console.error('Bulk inventory adjustment failed:', error);
    res.status(500).json({
      error: error.message || 'Bulk inventory adjustment failed'
    });
  }
});

export default router;
