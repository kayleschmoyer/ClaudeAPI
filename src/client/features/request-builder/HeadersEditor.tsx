import React from 'react';
import { HeaderEntry } from '../../../shared/types';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { theme } from '../../styles/theme';

interface HeadersEditorProps {
  headers: HeaderEntry[];
  onChange: (headers: HeaderEntry[]) => void;
}

export const HeadersEditor: React.FC<HeadersEditorProps> = ({ headers, onChange }) => {
  const addHeader = () => {
    onChange([
      ...headers,
      { id: Date.now().toString(), key: '', value: '', enabled: true }
    ]);
  };

  const updateHeader = (id: string, field: keyof HeaderEntry, value: any) => {
    onChange(
      headers.map(h => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  const removeHeader = (id: string) => {
    onChange(headers.filter(h => h.id !== id));
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md
  };

  const headerRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '30px 1fr 1fr 40px',
    gap: theme.spacing.sm,
    alignItems: 'end'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm
  };

  const checkboxStyle: React.CSSProperties = {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: theme.colors.primary
  };

  const deleteButtonStyle: React.CSSProperties = {
    background: 'transparent',
    color: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.fontSize.lg,
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>Headers</div>
      {headers.map(header => (
        <div key={header.id} style={headerRowStyle}>
          <input
            type="checkbox"
            checked={header.enabled}
            onChange={(e) => updateHeader(header.id, 'enabled', e.target.checked)}
            style={checkboxStyle}
          />
          <Input
            value={header.key}
            onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
            placeholder="Header name"
          />
          <Input
            value={header.value}
            onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
            placeholder="Header value"
          />
          <button
            onClick={() => removeHeader(header.id)}
            style={deleteButtonStyle}
          >
            ×
          </button>
        </div>
      ))}
      <Button variant="secondary" onClick={addHeader}>
        + Add Header
      </Button>
    </div>
  );
};
