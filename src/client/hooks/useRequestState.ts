import { useState } from 'react';
import { RequestConfig, ResponseData } from '../../shared/types';

export function useRequestState() {
  const [config, setConfig] = useState<RequestConfig>({
    method: 'GET',
    url: '',
    headers: [],
    auth: { type: 'none' },
    body: ''
  });

  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);

  return {
    config,
    setConfig,
    response,
    setResponse,
    loading,
    setLoading
  };
}
