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
    manufacturerWarrantyMiles: number;
    tireTread: number;
    msRated: boolean;
    passengerAndLightTruck: string;
    discontinued: string;
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

export function mapCSVRowToVOLProduct(row: any): VOLProductPayload {
  const width = sanitizeString(row.Width);
  const profile = sanitizeString(row.Profile);
  const rim = sanitizeString(row.Rim);
  const catalogSize = `${width}${profile}${rim}`;

  return {
    branchId: sanitizeString(row.Source),
    accountCodeId: '0520000',
    salesClassId: '052',
    productNumber: sanitizeString(row['IPCCode/Part #']),
    description: sanitizeString(row.ItemName),
    productTypeId: 1,
    tire: true,
    includeInTireQuoteScreen: true,
    discountable: true,
    allowDecimalQuantity: true,
    inventoriable: true,
    isQuickAdd: true,
    tyreGroupForTax: 1,
    manufacturerId: sanitizeString(row.Make),
    tireDetails: {
      catalogSize,
      searchSize: catalogSize,
      tireWidth: width,
      tireRatio: profile,
      tireRim: rim,
      loadIndex: sanitizeString(row.LoadIndex),
      rate: sanitizeString(row.SpeedRating),
      loadRange: sanitizeString(row['Load Range']),
      wallCode: sanitizeString(row.Sidewall),
      uniformTireQualityGrading: sanitizeString(row.UTQG),
      manufacturerWarrantyMiles: parseNumber(row.Warranty),
      tireTread: parseNumber(row['Tread Depth']),
      msRated: false,
      passengerAndLightTruck: '',
      discontinued: ''
    },
    pricing: {
      publishedCost: 0,
      listPrice: parseNumber(row.Price),
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
