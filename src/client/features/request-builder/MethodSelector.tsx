import React from 'react';
import { HttpMethod } from '../../../shared/types';
import { Select } from '../../components/Select';

interface MethodSelectorProps {
  value: HttpMethod;
  onChange: (method: HttpMethod) => void;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({ value, onChange }) => {
  const methods: { value: HttpMethod; label: string }[] = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' }
  ];

  return (
    <Select
      label="HTTP Method"
      value={value}
      onChange={(e) => onChange(e.target.value as HttpMethod)}
      options={methods}
    />
  );
};
