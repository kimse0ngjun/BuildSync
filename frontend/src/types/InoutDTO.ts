export interface PageResponse<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface InOutSumResponse {
  totalCount: number;
  inCount: number;
  outCount: number;
  todayCount: number;

  totalInQty: number;
  totalOutQty: number;
  netInOutQty: number;
  totalProcessedCount: number;

  inOutList: PageResponse<any>;
}

export interface ItemInfo {
  stockInoutId: number;
  materialId: number;
  materialName: string;
  quantity: number;
  unit: string;
}

export interface InOutResponse {
  inOutId: number;
  siteName: string;
  orderId: number;
  contactId: number;
  contactName: string;
  type: string;
  processedDate: string;
  memo: string;
  items: ItemInfo[];
}
