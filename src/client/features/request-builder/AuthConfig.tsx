import React from 'react';
import { AuthConfig as AuthConfigType, AuthType } from '../../../shared/types';
import { Select } from '../../components/Select';
import { Input } from '../../components/Input';
import { theme } from '../../styles/theme';
import { HeadersEditor } from './HeadersEditor';

interface AuthConfigProps {
  auth: AuthConfigType;
  onChange: (auth: AuthConfigType) => void;
}

export const AuthConfig: React.FC<AuthConfigProps> = ({ auth, onChange }) => {
  const authTypes: { value: AuthType; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'apiKey', label: 'API Key' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'custom', label: 'Custom Headers' }
  ];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md
  };

  return (
    <div style={containerStyle}>
      <Select
        label="Authentication"
        value={auth.type}
        onChange={(e) => onChange({ ...auth, type: e.target.value as AuthType })}
        options={authTypes}
      />

      {auth.type === 'apiKey' && (
        <>
          <Input
            label="Header Name"
            value={auth.apiKey?.headerName || ''}
            onChange={(e) => onChange({
              ...auth,
              apiKey: { ...auth.apiKey, headerName: e.target.value, value: auth.apiKey?.value || '' }
            })}
            placeholder="X-API-Key"
          />
          <Input
            label="API Key"
            value={auth.apiKey?.value || ''}
            onChange={(e) => onChange({
              ...auth,
              apiKey: { ...auth.apiKey, headerName: auth.apiKey?.headerName || '', value: e.target.value }
            })}
            placeholder="your-api-key"
            type="password"
          />
        </>
      )}

      {auth.type === 'bearer' && (
        <Input
          label="Bearer Token"
          value={auth.bearer?.token || ''}
          onChange={(e) => onChange({
            ...auth,
            bearer: { token: e.target.value }
          })}
          placeholder="your-bearer-token"
          type="password"
        />
      )}

      {auth.type === 'custom' && (
        <HeadersEditor
          headers={auth.customHeaders || []}
          onChange={(headers) => onChange({ ...auth, customHeaders: headers })}
        />
      )}
    </div>
  );
};
