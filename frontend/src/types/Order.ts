export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface OrderRequest {
  companyId: number;
  siteId: number | null;
  contactId: number | null;
  memo: string;
  orderManagerName: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  materialId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrderDetailResponse {
  orderId: number;
  orderManagerName: string;
  siteId: number | null;
  siteName: string;
  contactId: number | null;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  companyId: number | null;
  companyName: string;
  orderDate: string | null;
  expectedDeliveryDate: string | null;
  status: string;
  totalAmount: number;
  memo: string;
  items: OrderItemDto[];
}

export interface OrderItemDto {
  materialId: number;
  materialName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  unit: string;
  specification: string;
}

export interface OrderListResponse {
  orderId: number;
  partnerName: string;
  partnerType: "SUPPLIER" | "CONSTRUCTION";
  managerName: string;
  status: string;
  orderDate: string;
  memo: string;
  mainItemName: string;
  extraItemCount: number;
}

export interface OrderStatusResponse {
  totalCount: number;
  pendingCount: number;
  acceptedCount: number;
  endCount: number;
  cancelCount: number;
}

export interface SelectResponse {
  value: number;
  label: string;
}

export interface MaterialSelectResponse {
  value: number; // materialId
  label: string; // materialName
  specification: string;
  unit: string;
  unitPrice: number;
}

export interface ContactInfo {
  contactId: number;
  contactName: string;
  phone: string;
  email: string;
}
