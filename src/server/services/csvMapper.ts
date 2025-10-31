import { CSVRow } from '../../shared/types/index.js';

export interface VOLProductPayload {
  branchId: string;
  accountCodeId: string;
  salesClassId: string;
  productNumber: string;
  description: string;
  productTypeId: number;
  tire: boolean;
  includeInTireQuoteScreen: boolean;
  discountable: boolean;
  allowDecimalQuantity: boolean;
  inventoriable: boolean;
  isQuickAdd: boolean;
  tyreGroupForTax: number;
  manufacturerId: string;
  tireDetails: {
    catalogSize: string;
    searchSize: string;
    tireWidth: string;
    tireRatio: string;
    tireRim: string;
    loadIndex: string;
    rate: string;
    loadRange: string;
    wallCode: string;
    uniformTireQualityGrading: string;
    manufacturerWarrantyMiles: number | null;
    tireTread: number | null;
    msRated: boolean;
    passengerAndLightTruck: null;
    discontinued: null;
  };
  pricing: {
    publishedCost: number;
    listPrice: number;
    laborAmount: number;
    productAddon: number;
    laborAddon: number;
    hasCore: boolean;
    labourPayableHoursMin: number;
    labourPayableHoursMax: number;
    coreValue: number;
    workHours: number;
  };
  businessToBusiness: {
    showPart: boolean;
    showPrice: boolean;
  };
  businessToCustomer: {
    showPart: boolean;
    showPrice: boolean;
  };
  warrantyInfo: object;
  wheel: object;
  batteries: object;
  chains: object;
  commodityCodes: object;
}

function parseNumber(value: string | undefined): number | null {
  if (!value || value.trim() === '') {
    return null;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

export function mapCSVRowToVOLProduct(row: CSVRow): VOLProductPayload {
  const width = row.Width || '';
  const profile = row.Profile || '';
  const rim = row.Rim || '';
  const catalogSize = `${width}${profile}${rim}`;

  return {
    branchId: row.Source || '',
    accountCodeId: '0520000',
    salesClassId: '052',
    productNumber: row['IPCCode/Part #'] || '',
    description: row.ItemName || '',
    productTypeId: 1,
    tire: true,
    includeInTireQuoteScreen: true,
    discountable: true,
    allowDecimalQuantity: true,
    inventoriable: true,
    isQuickAdd: true,
    tyreGroupForTax: 1,
    manufacturerId: row.Make || '',
    tireDetails: {
      catalogSize,
      searchSize: catalogSize,
      tireWidth: width,
      tireRatio: profile,
      tireRim: rim,
      loadIndex: row.LoadIndex || '',
      rate: row.SpeedRating || '',
      loadRange: row['Load Range'] || '',
      wallCode: row.Sidewall || '',
      uniformTireQualityGrading: row.UTQG || '',
      manufacturerWarrantyMiles: parseNumber(row.Warranty),
      tireTread: parseNumber(row['Tread Depth']),
      msRated: false,
      passengerAndLightTruck: null,
      discontinued: null
    },
    pricing: {
      publishedCost: 0,
      listPrice: parseNumber(row.Price) || 0,
      laborAmount: 0,
      productAddon: 0,
      laborAddon: 0,
      hasCore: false,
      labourPayableHoursMin: 0,
      labourPayableHoursMax: 0,
      coreValue: 0,
      workHours: 0
    },
    businessToBusiness: {
      showPart: true,
      showPrice: true
    },
    businessToCustomer: {
      showPart: true,
      showPrice: true
    },
    warrantyInfo: {},
    wheel: {},
    batteries: {},
    chains: {},
    commodityCodes: {}
  };
}
