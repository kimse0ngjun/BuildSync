export interface CompanyResponse {
  id: number;
  companyType: string;
  companyName: string;
  ceoName: string;
  businessNumber: string;
  address: string;
  homepageUrl: string;
  phone: string;
  createdAt: string;
  status: string;
}

export interface Contact {
  contactId: number;
  companyId: number;
  contactName: string;
  department: string;
  position: string;
  phone: string;
  email: string;
}

export interface MaterialResponse {
  id: number;

  company: {
    id: number;
    companyName: string;
  };

  material: {
    id: number;
    materialCode: string;
    materialName: string;
    materialCategory: string;
    unit: string;
    unitPrice: number;
    specification: string;
  };

  SupStock: {
    id: number;
    unitPrice: number;
  };
}

export interface WriteOrderInfo {
  orderItems: any[];
}

export interface SelectedMaterialItem extends MaterialResponse {
  orderQuantity: number;
  totalAmount: number;
}

export interface Orders {
  orderId: number;
  contactId: number;
  companyId: number;
  orderDate: Date;
  totalAmount: number;
  status: string;
  memo: string;
}

export interface OrderDetail extends Orders {
  orderItemId: number;
  materialId: number;
  unitPrice: number;
  unit: string;
  amount: number;
  quantity: number;
}

export interface OrderList extends OrderDetail {
  orderId: number;
  orderDate: Date;
  companyName: string;
  representativeItem: string;
  itemCount: number;
  totalAmount: number;
  status: string;
}

export interface OrderDetailProps {
  selectedOrder: any | null;
  onClose: () => void;
}

export interface PageResponse<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
