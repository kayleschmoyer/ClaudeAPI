import { Router, Request, Response } from 'express';
import { RequestConfig, ApiResponse } from '../../shared/types/index.js';
import { dispatchRequest } from '../services/http/requestDispatcher.js';

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

export default router;
