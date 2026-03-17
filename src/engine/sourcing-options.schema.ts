/**
 * Sourcing Options Schema & Coordinator Intelligence
 * Defines data structures for AI-driven sourcing option generation
 */

export interface SourcingOption {
  id: string;
  orderId: string;
  optionNumber: number;
  negotiationCycle: number;
  sourcingMode: 'direct' | 'consolidated' | 'split' | 'backorder';
  primaryHub: 'NBI' | 'DKR';
  secondaryHub?: 'NBI' | 'DKR';
  goodsCostUsd: number;
  transportCostUsd: number;
  totalEstimatedCostUsd: number;
  countryTransportLiability: string;
  paymentTermsNote: string;
  estimatedDeliveryDays: number;
  coverageConfidence: 'high' | 'medium' | 'low';
  coordinatorSummary: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'expired';
  proposedBy: string;
  proposedAt: Date;
  respondedAt?: Date;
  respondedBy?: string;
  rejectionReason?: string;
  internalFlags: Record<string, any>;
  lines: SourcingOptionLine[];
}

export interface SourcingOptionLine {
  id: string;
  optionId: string;
  lineId: string;
  skuCode: string;
  requestedQty: number;
  proposedQty: number;
  backorderQty: number;
  sourceHub: 'NBI' | 'DKR';
  fulfillmentType: 'full' | 'partial' | 'backorder';
  fefoLotReference?: string;
  etaDays: number;
  unitCostUsd: number;
  lineGoodsCostUsd: number;
}

export interface CountryOptionResponse {
  id: string;
  orderId: string;
  optionId: string;
  response: 'accept' | 'reject' | 'request_alternative';
  respondedBy: string;
  respondedAt: Date;
  rejectionReason?: string;
  alternativeRequestNotes?: string;
  acceptedTransportCost?: number;
}

export interface InventoryAssessment {
  skuCode: string;
  totalRequested: number;
  availableByHub: {
    hub: 'NBI' | 'DKR';
    availableQty: number;
  }[];
  shortageQty: number;
  canCoverFully: boolean;
  recommendedSourcing: {
    mode: SourcingOption['sourcingMode'];
    primaryHub: 'NBI' | 'DKR';
    secondaryHub?: 'NBI' | 'DKR';
    reason: string;
  };
}

export interface CoordinatorIntelligence {
  inventoryAssessments: InventoryAssessment[];
  generatedOptions: SourcingOption[];
  exceptions: {
    skuCode: string;
    issue: string;
    suggestedActions: string[];
  }[];
  totalCostRange: {
    min: number;
    max: number;
    currency: 'USD';
  };
  deliveryRange: {
    minDays: number;
    maxDays: number;
  };
}

// COORDINATOR LOGIC ENGINE
export class CoordinatorEngine {
  /**
   * Assess inventory availability across hubs for a set of order lines
   */
  static assessInventory(
    orderLines: { skuCode: string; requestedQty: number }[],
    inventoryByHub: Record<string, { hub: 'NBI' | 'DKR'; availableQty: number; fefoLots: { lotNumber: string; qty: number; expiry: Date; unitCost: number }[] }>
  ): InventoryAssessment[] {
    return orderLines.map(line => {
      const availableByHub = Object.entries(inventoryByHub)
        .filter(([_, data]) => data.skuCode === line.skuCode)
        .map(([hub, data]) => ({
          hub: hub as 'NBI' | 'DKR',
          availableQty: data.availableQty,
        }));

      const totalAvailable = availableByHub.reduce((sum, h) => sum + h.availableQty, 0);
      const shortage = Math.max(0, line.requestedQty - totalAvailable);

      // Determine sourcing mode
      let recommendedSourcing: InventoryAssessment['recommendedSourcing'];
      if (totalAvailable >= line.requestedQty) {
        const primary = availableByHub.find(h => h.availableQty >= line.requestedQty);
        if (primary) {
          recommendedSourcing = {
            mode: 'direct',
            primaryHub: primary.hub,
            reason: `Full quantity available at ${primary.hub}`,
          };
        } else {
          recommendedSourcing = {
            mode: 'split',
            primaryHub: 'NBI',
            secondaryHub: 'DKR',
            reason: 'Split across hubs to fulfill full quantity',
          };
        }
      } else {
        recommendedSourcing = {
          mode: 'backorder',
          primaryHub: availableByHub[0]?.hub || 'NBI',
          reason: 'Insufficient stock; partial fulfillment with backorder',
        };
      }

      return {
        skuCode: line.skuCode,
        totalRequested: line.requestedQty,
        availableByHub,
        shortageQty: shortage,
        canCoverFully: totalAvailable >= line.requestedQty,
        recommendedSourcing,
      };
    });
  }

  /**
   * Build sourcing options based on inventory assessment
   */
  static buildSourcingOptions(
    orderId: string,
    assessments: InventoryAssessment[],
    inventoryByHub: Record<string, any>,
    baseTransportCostPerHub: Record<'NBI' | 'DKR', number>,
    countryTransportLiability: string
  ): SourcingOption[] {
    const options: SourcingOption[] = [];

    // Option 1: Direct from NBI if feasible
    const nbiOption = this.buildDirectOption(orderId, assessments, 'NBI', inventoryByHub, baseTransportCostPerHub.NBI, countryTransportLiability);
    if (nbiOption) options.push(nbiOption);

    // Option 2: Direct from DKR if feasible
    const dkrOption = this.buildDirectOption(orderId, assessments, 'DKR', inventoryByHub, baseTransportCostPerHub.DKR, countryTransportLiability);
    if (dkrOption) options.push(dkrOption);

    // Option 3: Split across hubs if needed
    if (assessments.some(a => !a.canCoverFully && a.availableByHub.length > 1)) {
      const splitOption = this.buildSplitOption(orderId, assessments, inventoryByHub, baseTransportCostPerHub, countryTransportLiability);
      if (splitOption) options.push(splitOption);
    }

    return options;
  }

  private static buildDirectOption(
    orderId: string,
    assessments: InventoryAssessment[],
    hub: 'NBI' | 'DKR',
    inventoryByHub: Record<string, any>,
    transportCost: number,
    countryTransportLiability: string
  ): SourcingOption | null {
    const lines = assessments.map(assessment => {
      const hubData = assessment.availableByHub.find(h => h.hub === hub);
      if (!hubData) return null;

      const inventory = Object.values(inventoryByHub).find((data: any) => data.skuCode === assessment.skuCode && data.hub === hub);
      const fefoLot = inventory?.fefoLots?.[0];

      return {
        id: crypto.randomUUID(),
        optionId: '', // Will be set when option is created
        lineId: crypto.randomUUID(),
        skuCode: assessment.skuCode,
        requestedQty: assessment.totalRequested,
        proposedQty: Math.min(assessment.totalRequested, hubData.availableQty),
        backorderQty: Math.max(0, assessment.totalRequested - hubData.availableQty),
        sourceHub: hub,
        fulfillmentType: hubData.availableQty >= assessment.totalRequested ? 'full' : 'partial',
        fefoLotReference: fefoLot?.lotNumber,
        etaDays: hub === 'NBI' ? 7 : 10,
        unitCostUsd: fefoLot?.unitCost || 0,
        lineGoodsCostUsd: 0, // Will be calculated
      };
    }).filter(Boolean) as SourcingOptionLine[];

    if (lines.length === 0) return null;

    const goodsCost = lines.reduce((sum, line) => sum + (line.unitCostUsd * line.proposedQty), 0);
    const totalCost = goodsCost + transportCost;

    return {
      id: crypto.randomUUID(),
      orderId,
      optionNumber: 1,
      negotiationCycle: 1,
      sourcingMode: 'direct',
      primaryHub: hub,
      goodsCostUsd: goodsCost,
      transportCostUsd: transportCost,
      totalEstimatedCostUsd: totalCost,
      countryTransportLiability,
      paymentTermsNote: 'Standard WHO payment terms: 30 days net',
      estimatedDeliveryDays: hub === 'NBI' ? 7 : 10,
      coverageConfidence: lines.every(l => l.fulfillmentType === 'full') ? 'high' : 'medium',
      coordinatorSummary: `Direct shipment from ${hub}. ${lines.filter(l => l.fulfillmentType === 'partial').length} items partially fulfilled.`,
      status: 'proposed',
      proposedBy: 'coordinator',
      proposedAt: new Date(),
      internalFlags: {},
      lines,
    };
  }

  private static buildSplitOption(
    orderId: string,
    assessments: InventoryAssessment[],
    inventoryByHub: Record<string, any>,
    baseTransportCostPerHub: Record<'NBI' | 'DKR', number>,
    countryTransportLiability: string
  ): SourcingOption | null {
    const lines: SourcingOptionLine[] = [];

    assessments.forEach(assessment => {
      let remainingQty = assessment.totalRequested;

      // Try NBI first
      const nbiHub = assessment.availableByHub.find(h => h.hub === 'NBI');
      if (nbiHub && remainingQty > 0) {
        const qtyFromNbi = Math.min(remainingQty, nbiHub.availableQty);
        const inventory = Object.values(inventoryByHub).find((data: any) => data.skuCode === assessment.skuCode && data.hub === 'NBI');
        const fefoLot = inventory?.fefoLots?.[0];

        lines.push({
          id: crypto.randomUUID(),
          optionId: '',
          lineId: crypto.randomUUID(),
          skuCode: assessment.skuCode,
          requestedQty: assessment.totalRequested,
          proposedQty: qtyFromNbi,
          backorderQty: 0,
          sourceHub: 'NBI',
          fulfillmentType: qtyFromNbi === assessment.totalRequested ? 'full' : 'partial',
          fefoLotReference: fefoLot?.lotNumber,
          etaDays: 7,
          unitCostUsd: fefoLot?.unitCost || 0,
          lineGoodsCostUsd: 0,
        });

        remainingQty -= qtyFromNbi;
      }

      // Then DKR for remainder
      const dkrHub = assessment.availableByHub.find(h => h.hub === 'DKR');
      if (dkrHub && remainingQty > 0) {
        const qtyFromDkr = Math.min(remainingQty, dkrHub.availableQty);
        const inventory = Object.values(inventoryByHub).find((data: any) => data.skuCode === assessment.skuCode && data.hub === 'DKR');
        const fefoLot = inventory?.fefoLots?.[0];

        lines.push({
          id: crypto.randomUUID(),
          optionId: '',
          lineId: crypto.randomUUID(),
          skuCode: assessment.skuCode,
          requestedQty: assessment.totalRequested,
          proposedQty: qtyFromDkr,
          backorderQty: 0,
          sourceHub: 'DKR',
          fulfillmentType: 'partial',
          fefoLotReference: fefoLot?.lotNumber,
          etaDays: 10,
          unitCostUsd: fefoLot?.unitCost || 0,
          lineGoodsCostUsd: 0,
        });

        remainingQty -= qtyFromDkr;
      }

      // Backorder if still short
      if (remainingQty > 0) {
        lines.push({
          id: crypto.randomUUID(),
          optionId: '',
          lineId: crypto.randomUUID(),
          skuCode: assessment.skuCode,
          requestedQty: assessment.totalRequested,
          proposedQty: 0,
          backorderQty: remainingQty,
          sourceHub: 'NBI',
          fulfillmentType: 'backorder',
          etaDays: 21,
          unitCostUsd: 0,
          lineGoodsCostUsd: 0,
        });
      }
    });

    if (lines.length === 0) return null;

    const goodsCost = lines.reduce((sum, line) => sum + (line.unitCostUsd * line.proposedQty), 0);
    const transportCost = baseTransportCostPerHub.NBI + baseTransportCostPerHub.DKR; // Both hubs used
    const totalCost = goodsCost + transportCost;

    return {
      id: crypto.randomUUID(),
      orderId,
      optionNumber: 2,
      negotiationCycle: 1,
      sourcingMode: 'split',
      primaryHub: 'NBI',
      secondaryHub: 'DKR',
      goodsCostUsd: goodsCost,
      transportCostUsd: transportCost,
      totalEstimatedCostUsd: totalCost,
      countryTransportLiability,
      paymentTermsNote: 'Standard WHO payment terms: 30 days net',
      estimatedDeliveryDays: 14, // Weighted average
      coverageConfidence: 'medium',
      coordinatorSummary: 'Split shipment across NBI and DKR hubs to maximize availability.',
      status: 'proposed',
      proposedBy: 'coordinator',
      proposedAt: new Date(),
      internalFlags: {},
      lines,
    };
  }
}
