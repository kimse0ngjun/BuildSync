export interface MonthlyMaterialCostResponse {
  month: string;
  totalOrderAmount: number;
  totalMaterialCost: number;
}

export interface SiteMaterialUsageAnalysisResponse {
  siteId: number;
  siteName: string;
  materialName: string;
  inboundQuantity: number;
  outboundQuantity: number;
  currentStock: number;
  unitPrice: number;
  unit: string;
}
