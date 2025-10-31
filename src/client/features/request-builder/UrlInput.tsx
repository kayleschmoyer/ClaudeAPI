import React from 'react';
import { Input } from '../../components/Input';

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ value, onChange }) => {
  return (
    <Input
      label="Request URL"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="https://api.example.com/endpoint"
    />
  );
};
