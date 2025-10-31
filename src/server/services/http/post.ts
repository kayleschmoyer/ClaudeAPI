import axios from 'axios';
import { RequestConfig } from '../../../shared/types/index.js';
import { HttpRequestResult } from '../../models/types.js';
import { buildHeaders } from '../../utils/headerBuilder.js';
import { safeJsonParse, calculateSize } from '../../utils/jsonParser.js';
import {
  generateRequestId,
  logRequestStart,
  logRequestSending,
  logAuthAttached,
  logRequestSuccess,
  logResponseParsed,
  logRequestError
} from '../activityLogger.js';

export async function executePost(config: RequestConfig): Promise<HttpRequestResult> {
  const requestId = generateRequestId();
  const activities = [];

  activities.push(logRequestStart(requestId, config));
  activities.push(logRequestSending(requestId, config));

  const authLog = logAuthAttached(requestId, config);
  if (authLog) activities.push(authLog);

  try {
    const startTime = Date.now();
    const headers = buildHeaders(config.headers, config.auth);

    let body = config.body;
    if (body) {
      try {
        body = JSON.parse(body);
      } catch {
      }
    }

    const response = await axios({
      method: 'POST',
      url: config.url,
      headers,
      data: body,
      validateStatus: () => true
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    activities.push(
      logRequestSuccess(requestId, response.status, response.statusText, responseTime)
    );

    const parsedBody = safeJsonParse(response.data);
    const responseSize = calculateSize(response.data);

    activities.push(logResponseParsed(requestId, responseSize));

    return {
      data: {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        body: parsedBody,
        responseTime,
        responseSize
      },
      activities
    };
  } catch (error: any) {
    activities.push(logRequestError(requestId, error));

    if (error.response) {
      const responseTime = 0;
      const parsedBody = safeJsonParse(error.response.data);
      const responseSize = calculateSize(error.response.data);

      return {
        data: {
          status: error.response.status,
          statusText: error.response.statusText,
          headers: error.response.headers as Record<string, string>,
          body: parsedBody,
          responseTime,
          responseSize
        },
        activities
      };
    }

    throw error;
  }
}
