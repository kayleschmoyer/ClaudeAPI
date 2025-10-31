import { RequestConfig } from '../../../shared/types/index.js';
import { HttpRequestResult } from '../../models/types.js';
import { executeGet } from './get.js';
import { executePost } from './post.js';
import { executePut } from './put.js';
import { executePatch } from './patch.js';
import { executeDelete } from './delete.js';

export async function dispatchRequest(config: RequestConfig): Promise<HttpRequestResult> {
  switch (config.method) {
    case 'GET':
      return executeGet(config);
    case 'POST':
      return executePost(config);
    case 'PUT':
      return executePut(config);
    case 'PATCH':
      return executePatch(config);
    case 'DELETE':
      return executeDelete(config);
    default:
      throw new Error(`Unsupported HTTP method: ${config.method}`);
  }
}
