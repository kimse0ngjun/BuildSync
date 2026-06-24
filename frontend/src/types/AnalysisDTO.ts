export interface Sites {
  siteId: number;
  siteName: string;
  constructionType: string;
  address: string;
  detailAddress: string;
  cost: number;
  status: string;
}

export interface AnalysisFilters {
  year: string;
  month: string;
  siteId?: number | string;
}
