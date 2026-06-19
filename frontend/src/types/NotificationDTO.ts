export interface PageResponse<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface NotificationResponse {
  noticeId: number;
  type: string;
  title: string;
  content: string;
  relatedId: number;
  isRead: number;
  createdAt: string;
  receiverId: number;
}

export interface MaterialShortageResponse {
  materialId: number;
  materialName: string;
  currentStock: number;
  safetyStock: number;
  deficitQuantity: number;
  unitPrice: number;
  statusMessage: string;
}

export interface StockShortageResponse {
  criticalCount: number;
  warningCount: number;
  onOrderCount: number;
  estimatedRequiredCost: number;
}
