export interface PageResponse<T> {
  list: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// 개별 자재 품목 상세 정보
export interface ItemInfo {
  materialId: number;
  materialName: string;
  quantity: number;
  unit: string;
}

export interface InOutResponse {
  stockInoutId: number;
  siteId: number | null;
  siteName: string | null;
  orderId: number | null;
  contactId: number | null;
  contactName: string | null;
  type: string;
  processedDate: string;
  memo: string | null;
  items: ItemInfo[];
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
  inOutList: PageResponse<InOutResponse>;

  chartData: ChartDataDetail[];
}

export interface InOutFilterParams {
  companyId: number;
  type?: string;
  materialId?: number;
  siteId?: number;
  orderId?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  page: number;
  size: number;
}

export interface AutoFillItem {
  materialId: number;
  materialName: string;
  materialCode: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

export interface AutoFillResponse {
  siteId?: number;
  siteName?: string | null;
  contactId?: number;
  contactName?: string | null;
  items: AutoFillItem[];
}

export interface InOutRegItemDetail {
  materialId: number;
  quantity: number;
}

// 최종 등록/수정 요청
export interface InOutRegRequest {
  companyId: number;
  siteId: number | null;
  orderId: number | null;
  contactId: number | null;
  type: string;
  memo: string | null;
  items: InOutRegItemDetail[];
  deleteInoutIds?: number[];
}

// 입출고 등록 우측 카드
export interface MaterialStockDetail {
  materialId: number;
  materialName: string;
  materialCode: string;
  unit: string;
  currentQuantity: number;
  minimumQuantity: number;
  unitPrice: number | null;
}

export interface StockInfoResponse {
  materials: MaterialStockDetail[];
}

export interface SelectOption {
  value: number;
  label: string;
}

export interface ChartDataDetail {
  date: string;
  inQuantity: number;
  outQuantity: number;
}

export interface InOutDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    stockInoutId: number;
    type: string;
    processedDate: string | null;
    siteName: string | null;
    orderId: number | null;
    contactName: string | null;
    memo: string | null;
    items?: {
      materialId: number;
      materialName: string;
      quantity: number;
      unit: string;
    }[];
  } | null;
}
