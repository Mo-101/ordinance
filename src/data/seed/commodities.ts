/**
 * Commodities Seed Data
 * Core medical commodities with security stock, threshold, and reorder quantities
 */

export interface Commodity {
  id: string;
  name: string;
  skuCode: string;
  description: string;
  unitOfMeasure: string;
  category: string;
  securityStockQty: number;
  thresholdStockQty: number;
  reorderQty: number;
  unitCostUsd: number;
  leadTimeDays: number;
  shelfLifeMonths: number;
  storageRequirements: string;
  whoPrequalification: boolean;
  unicefSupplyCatalog: boolean;
  lastUpdated: Date;
}

export const COMMODITIES: Commodity[] = [
  {
    id: 'com-001',
    name: 'Emergency Response Kit',
    skuCode: 'ERK-204',
    description: 'Trauma-ready, sealed, category-labeled kits for field response, clinics, and rapid dispatch stations.',
    unitOfMeasure: 'kit',
    category: 'Emergency Kits',
    securityStockQty: 50,
    thresholdStockQty: 30,
    reorderQty: 100,
    unitCostUsd: 149.00,
    leadTimeDays: 45,
    shelfLifeMonths: 60,
    storageRequirements: 'Cool, dry place. Temperature 15-25°C. Humidity < 60%.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-15'),
  },
  {
    id: 'com-002',
    name: 'N95 Protective Masks',
    skuCode: 'N95-118',
    description: 'High-filtration respiratory masks for airborne barrier protection in clinical, laboratory, and public-health response settings.',
    unitOfMeasure: 'box',
    category: 'Personal Protective Equipment',
    securityStockQty: 200,
    thresholdStockQty: 100,
    reorderQty: 400,
    unitCostUsd: 42.00,
    leadTimeDays: 30,
    shelfLifeMonths: 36,
    storageRequirements: 'Dry, well-ventilated area. Avoid direct sunlight and moisture.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-10'),
  },
  {
    id: 'com-003',
    name: 'Sterile Nitrile Gloves',
    skuCode: 'SNG-441',
    description: 'Powder-free nitrile examination gloves with sterile presentation for controlled handling and clean procedural work.',
    unitOfMeasure: 'box',
    category: 'Personal Protective Equipment',
    securityStockQty: 300,
    thresholdStockQty: 150,
    reorderQty: 600,
    unitCostUsd: 28.00,
    leadTimeDays: 35,
    shelfLifeMonths: 48,
    storageRequirements: 'Room temperature. Protect from extreme temperatures and direct sunlight.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-12'),
  },
  {
    id: 'com-004',
    name: 'Rapid Diagnostic Test Kit',
    skuCode: 'RDT-302',
    description: 'Multiplex antigen/antibody rapid test for priority pathogens in field and clinic settings.',
    unitOfMeasure: 'kit',
    category: 'Diagnostics',
    securityStockQty: 80,
    thresholdStockQty: 40,
    reorderQty: 160,
    unitCostUsd: 65.00,
    leadTimeDays: 60,
    shelfLifeMonths: 24,
    storageRequirements: 'Refrigerated 2-8°C. Protect from freezing and heat.',
    whoPrequalification: true,
    unicefSupplyCatalog: false,
    lastUpdated: new Date('2024-03-08'),
  },
  {
    id: 'com-005',
    name: 'IV Infusion Set',
    skuCode: 'IVS-215',
    description: 'Sterile infusion set with drip chamber, 15 µm filter, 20 drops/mL, 150 cm tubing.',
    unitOfMeasure: 'unit',
    category: 'Medical Equipment',
    securityStockQty: 500,
    thresholdStockQty: 300,
    reorderQty: 1000,
    unitCostUsd: 3.50,
    leadTimeDays: 25,
    shelfLifeMonths: 36,
    storageRequirements: 'Clean, dry area. Room temperature. Protect from moisture.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-20'),
  },
  {
    id: 'com-006',
    name: 'Antiretroviral Therapy Kit',
    skuCode: 'ART-501',
    description: 'First-line antiretroviral drug combination for HIV treatment initiation and maintenance.',
    unitOfMeasure: 'kit',
    category: 'Medicines',
    securityStockQty: 100,
    thresholdStockQty: 60,
    reorderQty: 200,
    unitCostUsd: 245.00,
    leadTimeDays: 90,
    shelfLifeMonths: 48,
    storageRequirements: 'Temperature controlled 15-25°C. Secure storage with access logs.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-05'),
  },
  {
    id: 'com-007',
    name: 'Malaria Rapid Test',
    skuCode: 'MRT-603',
    description: 'Rapid diagnostic test for Plasmodium falciparum detection in endemic regions.',
    unitOfMeasure: 'kit',
    category: 'Diagnostics',
    securityStockQty: 150,
    thresholdStockQty: 75,
    reorderQty: 300,
    unitCostUsd: 1.25,
    leadTimeDays: 45,
    shelfLifeMonths: 24,
    storageRequirements: 'Room temperature. Protect from heat and humidity.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-18'),
  },
  {
    id: 'com-008',
    name: 'Oral Rehydration Salts',
    skuCode: 'ORS-707',
    description: 'Electrolyte solution for dehydration treatment in cholera and diarrheal disease management.',
    unitOfMeasure: 'carton',
    category: 'Medicines',
    securityStockQty: 1000,
    thresholdStockQty: 500,
    reorderQty: 2000,
    unitCostUsd: 8.50,
    leadTimeDays: 30,
    shelfLifeMonths: 36,
    storageRequirements: 'Dry, cool place. Protect from moisture.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-22'),
  },
  {
    id: 'com-009',
    name: 'Vaccine Carrier with Ice Packs',
    skuCode: 'VCC-809',
    description: 'Insulated container with ice packs for cold chain vaccine transport to remote areas.',
    unitOfMeasure: 'unit',
    category: 'Cold Chain Equipment',
    securityStockQty: 25,
    thresholdStockQty: 15,
    reorderQty: 50,
    unitCostUsd: 85.00,
    leadTimeDays: 60,
    shelfLifeMonths: 120,
    storageRequirements: 'Clean, dry storage. Ice packs stored separately in freezer.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-25'),
  },
  {
    id: 'com-010',
    name: 'Blood Pressure Monitor',
    skuCode: 'BPM-910',
    description: 'Automated digital blood pressure monitor with adult and pediatric cuffs.',
    unitOfMeasure: 'unit',
    category: 'Medical Equipment',
    securityStockQty: 20,
    thresholdStockQty: 10,
    reorderQty: 40,
    unitCostUsd: 125.00,
    leadTimeDays: 45,
    shelfLifeMonths: 60,
    storageRequirements: 'Clean, dry place. Protect from impact and moisture.',
    whoPrequalification: false,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-28'),
  },
  {
    id: 'com-011',
    name: 'Hand Sanitizer (500ml)',
    skuCode: 'HSA-011',
    description: 'Alcohol-based hand rub for infection prevention and control.',
    unitOfMeasure: 'bottle',
    category: 'Infection Control',
    securityStockQty: 200,
    thresholdStockQty: 100,
    reorderQty: 400,
    unitCostUsd: 4.50,
    leadTimeDays: 20,
    shelfLifeMonths: 24,
    storageRequirements: 'Cool, dry place. Away from heat and open flame.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-03-30'),
  },
  {
    id: 'com-012',
    name: 'Thermometer (Digital)',
    skuCode: 'THM-012',
    description: 'Digital clinical thermometer for temperature monitoring.',
    unitOfMeasure: 'unit',
    category: 'Medical Equipment',
    securityStockQty: 50,
    thresholdStockQty: 25,
    reorderQty: 100,
    unitCostUsd: 12.00,
    leadTimeDays: 30,
    shelfLifeMonths: 48,
    storageRequirements: 'Protect from impact. Store in protective case.',
    whoPrequalification: false,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-04-01'),
  },
  {
    id: 'com-013',
    name: 'Surgical Masks',
    skuCode: 'SGM-013',
    description: 'Disposable surgical masks for general medical use and infection control.',
    unitOfMeasure: 'box',
    category: 'Personal Protective Equipment',
    securityStockQty: 500,
    thresholdStockQty: 250,
    reorderQty: 1000,
    unitCostUsd: 15.00,
    leadTimeDays: 25,
    shelfLifeMonths: 24,
    storageRequirements: 'Dry, well-ventilated area. Avoid moisture contamination.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-04-03'),
  },
  {
    id: 'com-014',
    name: 'Gloves (Examination, Non-Sterile)',
    skuCode: 'GLV-014',
    description: 'Latex-free examination gloves for routine medical examinations.',
    unitOfMeasure: 'box',
    category: 'Personal Protective Equipment',
    securityStockQty: 400,
    thresholdStockQty: 200,
    reorderQty: 800,
    unitCostUsd: 8.50,
    leadTimeDays: 20,
    shelfLifeMonths: 36,
    storageRequirements: 'Room temperature. Protect from extreme temperatures.',
    whoPrequalification: true,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-04-05'),
  },
  {
    id: 'com-015',
    name: 'Basic Diagnostic Kit',
    skuCode: 'BDK-015',
    description: 'Portable diagnostic kit with stethoscope, otoscope, and basic examination tools.',
    unitOfMeasure: 'kit',
    category: 'Medical Equipment',
    securityStockQty: 30,
    thresholdStockQty: 15,
    reorderQty: 60,
    unitCostUsd: 185.00,
    leadTimeDays: 40,
    shelfLifeMonths: 60,
    storageRequirements: 'Clean, dry storage. Protective case required.',
    whoPrequalification: false,
    unicefSupplyCatalog: true,
    lastUpdated: new Date('2024-04-08'),
  },
];

// Helper functions
export const getCommodityBySku = (skuCode: string): Commodity | undefined => {
  return COMMODITIES.find(commodity => commodity.skuCode === skuCode);
};

export const getCommoditiesByCategory = (category: string): Commodity[] => {
  return COMMODITIES.filter(commodity => commodity.category === category);
};

export const getLowStockCommodities = (currentStock: Record<string, number>): Commodity[] => {
  return COMMODITIES.filter(commodity => {
    const stock = currentStock[commodity.skuCode] || 0;
    return stock <= commodity.thresholdStockQty;
  });
};

export const getReorderRecommendations = (currentStock: Record<string, number>): Array<{
  commodity: Commodity;
  currentStock: number;
  recommendedOrderQty: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}> => {
  return COMMODITIES.map(commodity => {
    const stock = currentStock[commodity.skuCode] || 0;
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let recommendedOrderQty = 0;

    if (stock <= commodity.thresholdStockQty) {
      if (stock === 0) {
        urgency = 'critical';
        recommendedOrderQty = commodity.reorderQty;
      } else if (stock < commodity.securityStockQty) {
        urgency = 'high';
        recommendedOrderQty = commodity.securityStockQty - stock;
      } else {
        urgency = 'medium';
        recommendedOrderQty = commodity.thresholdStockQty - stock + commodity.reorderQty;
      }
    }

    return {
      commodity,
      currentStock: stock,
      recommendedOrderQty,
      urgency,
    };
  }).filter(rec => rec.recommendedOrderQty > 0);
};

export const calculateStockValue = (currentStock: Record<string, number>): {
  totalValue: number;
  commodityValues: Array<{
    commodity: Commodity;
    quantity: number;
    value: number;
  }>;
} => {
  const commodityValues = COMMODITIES.map(commodity => {
    const quantity = currentStock[commodity.skuCode] || 0;
    const value = quantity * commodity.unitCostUsd;
    return { commodity, quantity, value };
  });

  const totalValue = commodityValues.reduce((sum, item) => sum + item.value, 0);

  return { totalValue, commodityValues };
};

export const getExpiringCommodities = (inventoryLots: Array<{
  skuCode: string;
  expiryDate: Date;
  quantity: number;
}>, daysThreshold: number = 90): Array<{
  commodity: Commodity;
  lotInfo: {
    expiryDate: Date;
    quantity: number;
    daysToExpiry: number;
  };
}> => {
  const today = new Date();
  const thresholdDate = new Date(today.getTime() + daysThreshold * 24 * 60 * 60 * 1000);

  return inventoryLots
    .filter(lot => lot.expiryDate <= thresholdDate)
    .map(lot => {
      const commodity = getCommodityBySku(lot.skuCode);
      if (!commodity) return null;

      const daysToExpiry = Math.ceil((lot.expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

      return {
        commodity,
        lotInfo: {
          expiryDate: lot.expiryDate,
          quantity: lot.quantity,
          daysToExpiry,
        },
      };
    })
  .filter((item): item is NonNullable<typeof item> => item !== null);
};
