export interface MonthlyMaterialCostResponse {
  month: string;
  totalQuantity: number;
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
