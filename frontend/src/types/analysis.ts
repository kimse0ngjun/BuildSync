// 건설업체
export interface MonthlyPurchase {
  month: string;
  totalCost: number;
}

export interface SiteUsage {
  siteName: string;
  totalQuantity: number;
}

// 공급업체
export interface MonthlySales {
  month: string;
  totalSales: number;
}

export interface SiteCost {
  siteName: string;
  materialName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
