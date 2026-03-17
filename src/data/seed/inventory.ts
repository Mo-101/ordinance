/**
 * Inventory Seed Data
 * NBI and DKR hub inventory with FEFO lots and 4-parameter tracking
 */

import { InventoryLot } from '../../types';

// NBI Hub Inventory
export const NBI_INVENTORY: InventoryLot[] = [
  // Emergency Response Kits
  {
    id: 'nbi-lot-erk-001',
    warehouseId: 'wh-nbi-001',
    skuCode: 'ERK-204',
    lotNumber: 'EK-B1-2024',
    expiryDate: new Date('2029-03-31'),
    physicalQty: 120,
    reservedQty: 20,
    quarantineQty: 0,
    unitCostUsd: 149.00,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'nbi-lot-erk-002',
    warehouseId: 'wh-nbi-001',
    skuCode: 'ERK-204',
    lotNumber: 'EK-C2-2024',
    expiryDate: new Date('2029-06-30'),
    physicalQty: 85,
    reservedQty: 10,
    quarantineQty: 0,
    unitCostUsd: 152.50,
    createdAt: new Date('2024-02-20'),
  },
  
  // N95 Masks
  {
    id: 'nbi-lot-n95-001',
    warehouseId: 'wh-nbi-001',
    skuCode: 'N95-118',
    lotNumber: 'MK-D3-2024',
    expiryDate: new Date('2028-12-31'),
    physicalQty: 350,
    reservedQty: 50,
    quarantineQty: 0,
    unitCostUsd: 42.00,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 'nbi-lot-n95-002',
    warehouseId: 'wh-nbi-001',
    skuCode: 'N95-118',
    lotNumber: 'MK-E4-2024',
    expiryDate: new Date('2029-02-28'),
    physicalQty: 280,
    reservedQty: 30,
    quarantineQty: 0,
    unitCostUsd: 44.25,
    createdAt: new Date('2024-03-05'),
  },
  
  // Nitrile Gloves
  {
    id: 'nbi-lot-sng-001',
    warehouseId: 'wh-nbi-001',
    skuCode: 'SNG-441',
    lotNumber: 'GL-F5-2024',
    expiryDate: new Date('2029-06-30'),
    physicalQty: 480,
    reservedQty: 80,
    quarantineQty: 0,
    unitCostUsd: 28.00,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'nbi-lot-sng-002',
    warehouseId: 'wh-nbi-001',
    skuCode: 'SNG-441',
    lotNumber: 'GL-G6-2024',
    expiryDate: new Date('2029-09-30'),
    physicalQty: 320,
    reservedQty: 40,
    quarantineQty: 0,
    unitCostUsd: 29.75,
    createdAt: new Date('2024-02-15'),
  },
  
  // Rapid Diagnostic Tests
  {
    id: 'nbi-lot-rdt-001',
    warehouseId: 'wh-nbi-001',
    skuCode: 'RDT-302',
    lotNumber: 'RD-H7-2024',
    expiryDate: new Date('2028-09-30'),
    physicalQty: 90,
    reservedQty: 10,
    quarantineQty: 0,
    unitCostUsd: 65.00,
    createdAt: new Date('2024-01-25'),
  },
  {
    id: 'nbi-lot-rdt-002',
    warehouseId: 'wh-nbi-001',
    skuCode: 'RDT-302',
    lotNumber: 'RD-I8-2024',
    expiryDate: new Date('2029-01-31'),
    physicalQty: 75,
    reservedQty: 5,
    quarantineQty: 0,
    unitCostUsd: 67.50,
    createdAt: new Date('2024-03-10'),
  },
  
  // IV Infusion Sets
  {
    id: 'nbi-lot-ivs-001',
    warehouseId: 'wh-nbi-001',
    skuCode: 'IVS-215',
    lotNumber: 'IV-J9-2024',
    expiryDate: new Date('2029-02-28'),
    physicalQty: 600,
    reservedQty: 100,
    quarantineQty: 0,
    unitCostUsd: 3.50,
    createdAt: new Date('2024-01-30'),
  },
  {
    id: 'nbi-lot-ivs-002',
    warehouseId: 'wh-nbi-001',
    skuCode: 'IVS-215',
    lotNumber: 'IV-K10-2024',
    expiryDate: new Date('2029-05-31'),
    physicalQty: 450,
    reservedQty: 75,
    quarantineQty: 0,
    unitCostUsd: 3.75,
    createdAt: new Date('2024-02-28'),
  },
];

// DKR Hub Inventory
export const DKR_INVENTORY: InventoryLot[] = [
  // Emergency Response Kits
  {
    id: 'dkr-lot-erk-001',
    warehouseId: 'wh-dkr-001',
    skuCode: 'ERK-204',
    lotNumber: 'EK-L11-2024',
    expiryDate: new Date('2029-04-30'),
    physicalQty: 45,
    reservedQty: 5,
    quarantineQty: 0,
    unitCostUsd: 149.00,
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'dkr-lot-erk-002',
    warehouseId: 'wh-dkr-001',
    skuCode: 'ERK-204',
    lotNumber: 'EK-M12-2024',
    expiryDate: new Date('2029-07-31'),
    physicalQty: 60,
    reservedQty: 8,
    quarantineQty: 0,
    unitCostUsd: 151.00,
    createdAt: new Date('2024-03-15'),
  },
  
  // N95 Masks
  {
    id: 'dkr-lot-n95-001',
    warehouseId: 'wh-dkr-001',
    skuCode: 'N95-118',
    lotNumber: 'MK-N13-2024',
    expiryDate: new Date('2029-01-31'),
    physicalQty: 180,
    reservedQty: 30,
    quarantineQty: 0,
    unitCostUsd: 42.00,
    createdAt: new Date('2024-02-05'),
  },
  {
    id: 'dkr-lot-n95-002',
    warehouseId: 'wh-dkr-001',
    skuCode: 'N95-118',
    lotNumber: 'MK-O14-2024',
    expiryDate: new Date('2029-04-30'),
    physicalQty: 150,
    reservedQty: 20,
    quarantineQty: 0,
    unitCostUsd: 43.50,
    createdAt: new Date('2024-03-20'),
  },
  
  // Nitrile Gloves
  {
    id: 'dkr-lot-sng-001',
    warehouseId: 'wh-dkr-001',
    skuCode: 'SNG-441',
    lotNumber: 'GL-P15-2024',
    expiryDate: new Date('2029-07-31'),
    physicalQty: 220,
    reservedQty: 20,
    quarantineQty: 0,
    unitCostUsd: 28.00,
    createdAt: new Date('2024-02-25'),
  },
  {
    id: 'dkr-lot-sng-002',
    warehouseId: 'wh-dkr-001',
    skuCode: 'SNG-441',
    lotNumber: 'GL-Q16-2024',
    expiryDate: new Date('2029-10-31'),
    physicalQty: 180,
    reservedQty: 15,
    quarantineQty: 0,
    unitCostUsd: 29.25,
    createdAt: new Date('2024-03-25'),
  },
  
  // Rapid Diagnostic Tests
  {
    id: 'dkr-lot-rdt-001',
    warehouseId: 'wh-dkr-001',
    skuCode: 'RDT-302',
    lotNumber: 'RD-R17-2024',
    expiryDate: new Date('2028-10-31'),
    physicalQty: 40,
    reservedQty: 0,
    quarantineQty: 0,
    unitCostUsd: 65.00,
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'dkr-lot-rdt-002',
    warehouseId: 'wh-dkr-001',
    skuCode: 'RDT-302',
    lotNumber: 'RD-S18-2024',
    expiryDate: new Date('2029-02-28'),
    physicalQty: 55,
    reservedQty: 5,
    quarantineQty: 0,
    unitCostUsd: 66.75,
    createdAt: new Date('2024-04-05'),
  },
  
  // IV Infusion Sets
  {
    id: 'dkr-lot-ivs-001',
    warehouseId: 'wh-dkr-001',
    skuCode: 'IVS-215',
    lotNumber: 'IV-T19-2024',
    expiryDate: new Date('2029-03-31'),
    physicalQty: 250,
    reservedQty: 50,
    quarantineQty: 0,
    unitCostUsd: 3.50,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'dkr-lot-ivs-002',
    warehouseId: 'wh-dkr-001',
    skuCode: 'IVS-215',
    lotNumber: 'IV-U20-2024',
    expiryDate: new Date('2029-06-30'),
    physicalQty: 200,
    reservedQty: 30,
    quarantineQty: 0,
    unitCostUsd: 3.65,
    createdAt: new Date('2024-03-30'),
  },
];

// Combined inventory for easy lookup
export const ALL_INVENTORY = [...NBI_INVENTORY, ...DKR_INVENTORY];

// Helper functions
export const getInventoryByHub = (hubId: string): InventoryLot[] => {
  return ALL_INVENTORY.filter(lot => lot.warehouseId === hubId);
};

export const getInventoryBySku = (skuCode: string): InventoryLot[] => {
  return ALL_INVENTORY.filter(lot => lot.skuCode === skuCode);
};

export const getAvailableQuantity = (skuCode: string, hubId?: string): number => {
  const lots = hubId 
    ? ALL_INVENTORY.filter(lot => lot.skuCode === skuCode && lot.warehouseId === hubId)
    : ALL_INVENTORY.filter(lot => lot.skuCode === skuCode);
  
  return lots.reduce((total, lot) => total + (lot.physicalQty - lot.reservedQty - lot.quarantineQty), 0);
};

export const getFefoLots = (skuCode: string, hubId?: string): InventoryLot[] => {
  const lots = hubId 
    ? ALL_INVENTORY.filter(lot => lot.skuCode === skuCode && lot.warehouseId === hubId)
    : ALL_INVENTORY.filter(lot => lot.skuCode === skuCode);
  
  // Sort by expiry date (FEFO - First Expired, First Out)
  return lots.sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime());
};

export const reserveInventory = (skuCode: string, quantity: number, hubId?: string): InventoryLot[] => {
  const availableLots = getFefoLots(skuCode, hubId);
  const reservedLots: InventoryLot[] = [];
  let remainingQty = quantity;
  
  for (const lot of availableLots) {
    if (remainingQty <= 0) break;
    
    const availableQty = lot.physicalQty - lot.reservedQty - lot.quarantineQty;
    if (availableQty > 0) {
      const reserveQty = Math.min(remainingQty, availableQty);
      reservedLots.push({
        ...lot,
        reservedQty: lot.reservedQty + reserveQty,
      });
      remainingQty -= reserveQty;
    }
  }
  
  return reservedLots;
};

export const checkInventoryAvailability = (skuCode: string, quantity: number, hubId?: string): {
  canFulfill: boolean;
  availableQty: number;
  shortageQty: number;
  suggestedHub?: 'NBI' | 'DKR';
} => {
  if (hubId) {
    const availableQty = getAvailableQuantity(skuCode, hubId);
    return {
      canFulfill: availableQty >= quantity,
      availableQty,
      shortageQty: Math.max(0, quantity - availableQty),
    };
  }
  
  // Check both hubs
  const nbiQty = getAvailableQuantity(skuCode, 'wh-nbi-001');
  const dkrQty = getAvailableQuantity(skuCode, 'wh-dkr-001');
  const totalAvailable = nbiQty + dkrQty;
  
  const suggestedHub = nbiQty >= quantity ? 'NBI' : dkrQty >= quantity ? 'DKR' : undefined;
  
  return {
    canFulfill: totalAvailable >= quantity,
    availableQty: totalAvailable,
    shortageQty: Math.max(0, quantity - totalAvailable),
    suggestedHub,
  };
};
