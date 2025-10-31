import { Router, Request, Response } from 'express';
import axios from 'axios';
import { buildVolHeaders } from '../utils/headerBuilder.js';
import { mapCSVRowToVOLProduct } from '../services/csvMapper.js';

const router = Router();

router.post('/sendRequest', async (req: Request, res: Response) => {
  try {
    const { baseUrl, token, body } = req.body;

    if (!baseUrl) {
      return res.status(400).json({
        error: 'baseUrl is required'
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
    const url = `${baseUrl}/products/products?api-version=3.0`;

    const response = await axios({
      method: 'POST',
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

router.post('/bulkImport', async (req: Request, res: Response) => {
  try {
    const { baseUrl, token, rows } = req.body;

    if (!baseUrl) {
      return res.status(400).json({
        error: 'baseUrl is required'
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
    const url = `${baseUrl}/products/products?api-version=3.0`;

    const logEntries: any[] = [];
    let succeeded = 0;
    let failed = 0;

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

        const isSuccess = response.status >= 200 && response.status < 300;

        if (isSuccess) {
          succeeded++;
        } else {
          failed++;
        }

        const logEntry: any = {
          rowNumber,
          httpStatusCode: response.status,
          status: isSuccess ? 'Created' : 'Failed',
          requestBody: productPayload,
          responseBody: response.data,
          timestamp: new Date().toISOString()
        };

        if (productPayload.productNumber) {
          logEntry.productNumber = productPayload.productNumber;
        }

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

        const productPayload = mapCSVRowToVOLProduct(row);

        logEntries.push({
          rowNumber,
          httpStatusCode: 500,
          status: 'Failed',
          requestBody: productPayload,
          responseBody: {
            error: error.message || 'Request failed'
          },
          timestamp: new Date().toISOString(),
          message: error.message || 'Request failed',
          productNumber: productPayload.productNumber
        });
      }
    }

    const summary = {
      totalRows: rows.length,
      succeeded,
      failed,
      results: logEntries.map(entry => ({
        rowNumber: entry.rowNumber,
        status: entry.status,
        httpCode: entry.httpStatusCode,
        productNumber: entry.productNumber,
        message: entry.message,
        details: entry.details
      }))
    };

    res.json({
      summary,
      logEntries
    });
  } catch (error: any) {
    console.error('Bulk import failed:', error);
    res.status(500).json({
      error: error.message || 'Bulk import failed'
    });
  }
});

export default router;
