import React, { useState, useEffect } from 'react';
import { TextArea } from '../../components/TextArea';
import { HttpMethod } from '../../../shared/types';

interface BodyEditorProps {
  method: HttpMethod;
  body: string;
  onChange: (body: string) => void;
}

export const BodyEditor: React.FC<BodyEditorProps> = ({ method, body, onChange }) => {
  const [error, setError] = useState<string>('');

  const supportsBody = ['POST', 'PUT', 'PATCH'].includes(method);

  useEffect(() => {
    if (body && supportsBody) {
      try {
        JSON.parse(body);
        setError('');
      } catch {
        setError('Invalid JSON');
      }
    } else {
      setError('');
    }
  }, [body, supportsBody]);

  if (!supportsBody) {
    return null;
  }

  return (
    <TextArea
      label="Request Body (JSON)"
      value={body}
      onChange={(e) => onChange(e.target.value)}
      placeholder='{"key": "value"}'
      error={error}
      rows={8}
    />
  );
};
