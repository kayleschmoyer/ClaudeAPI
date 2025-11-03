import { InventoryCSVRow, InventoryAdjustmentLine, InventoryAdjustmentPayload } from '../../shared/types/index.js';

function parseNumber(value: string | undefined): number {
  if (!value || value.trim() === '') {
    return 0;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

function sanitizeString(value: string | undefined): string {
  return value?.trim() || '';
}

export function mapCSVRowToInventoryAdjustmentLine(row: InventoryCSVRow): InventoryAdjustmentLine {
  const make = sanitizeString(row.Make);
  const partNumber = sanitizeString(row['IPCCode/Part #']);
  const productId = `${make}${partNumber}`;
  const quantity = parseNumber(row.Stock);

  return {
    productId,
    quantity,
    reasonId: '5' // Hardcoded as per requirements
  };
}

export function mapCSVRowsToInventoryPayload(rows: InventoryCSVRow[]): InventoryAdjustmentPayload[] {
  // Group rows by branchId (Source)
  const groupedByBranch: Record<string, InventoryAdjustmentLine[]> = {};

  for (const row of rows) {
    const branchId = sanitizeString(row.Source);
    if (!branchId) {
      continue; // Skip rows without a Source
    }

    if (!groupedByBranch[branchId]) {
      groupedByBranch[branchId] = [];
    }

    const adjustmentLine = mapCSVRowToInventoryAdjustmentLine(row);
    groupedByBranch[branchId].push(adjustmentLine);
  }

  // Convert grouped data to array of payloads
  return Object.entries(groupedByBranch).map(([branchId, adjustmentLines]) => ({
    branchId,
    adjustmentLines
  }));
}
