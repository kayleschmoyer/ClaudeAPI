import React from 'react';
import { RequestConfig } from '../../../shared/types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { MethodSelector } from './MethodSelector';
import { UrlInput } from './UrlInput';
import { HeadersEditor } from './HeadersEditor';
import { AuthConfig } from './AuthConfig';
import { BodyEditor } from './BodyEditor';
import { theme } from '../../styles/theme';

interface RequestBuilderProps {
  config: RequestConfig;
  onChange: (config: RequestConfig) => void;
  onSend: () => void;
  loading: boolean;
}

export const RequestBuilder: React.FC<RequestBuilderProps> = ({
  config,
  onChange,
  onSend,
  loading
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.lg,
    height: '100%'
  };

  return (
    <Card title="Request Builder" style={{ height: '100%', overflow: 'auto' }}>
      <div style={containerStyle}>
        <MethodSelector
          value={config.method}
          onChange={(method) => onChange({ ...config, method })}
        />

        <UrlInput
          value={config.url}
          onChange={(url) => onChange({ ...config, url })}
        />

        <HeadersEditor
          headers={config.headers}
          onChange={(headers) => onChange({ ...config, headers })}
        />

        <AuthConfig
          auth={config.auth}
          onChange={(auth) => onChange({ ...config, auth })}
        />

        <BodyEditor
          method={config.method}
          body={config.body || ''}
          onChange={(body) => onChange({ ...config, body })}
        />

        <Button
          variant="primary"
          onClick={onSend}
          loading={loading}
          disabled={!config.url || loading}
        >
          Send Request
        </Button>
      </div>
    </Card>
  );
};
