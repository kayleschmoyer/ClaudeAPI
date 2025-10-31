import React, { useState, useRef } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { theme } from '../../styles/theme';
import { CSVRow } from '../../../shared/types';

interface BulkImportProps {
  onImport: (rows: CSVRow[]) => Promise<void>;
}

export const BulkImport: React.FC<BulkImportProps> = ({ onImport }) => {
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [rowCount, setRowCount] = useState<number>(0);
  const [parsedRows, setParsedRows] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const rows: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      rows.push(row);
    }

    return rows;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCSVFile(file);
    const text = await file.text();
    const rows = parseCSV(text);
    setParsedRows(rows);
    setRowCount(rows.length);
  };

  const handleSendAll = async () => {
    if (parsedRows.length === 0) return;

    setLoading(true);
    try {
      await onImport(parsedRows);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md
  };

  const uploadAreaStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    border: `2px dashed ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    background: theme.colors.background,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const fileInputStyle: React.CSSProperties = {
    display: 'none'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    fontWeight: 600
  };

  const infoStyle: React.CSSProperties = {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    opacity: 0.7
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: theme.spacing.sm
  };

  return (
    <Card title="Bulk Import" style={{ height: '100%' }}>
      <div style={containerStyle}>
        <div
          style={uploadAreaStyle}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={fileInputStyle}
          />
          <span style={labelStyle}>
            {csvFile ? csvFile.name : 'Click to select CSV file'}
          </span>
          {rowCount > 0 && (
            <span style={infoStyle}>
              Preview rows detected: {rowCount}
            </span>
          )}
        </div>

        <div style={buttonContainerStyle}>
          <Button
            variant="primary"
            onClick={handleSendAll}
            disabled={rowCount === 0}
            loading={loading}
          >
            Send All
          </Button>
        </div>
      </div>
    </Card>
  );
};
