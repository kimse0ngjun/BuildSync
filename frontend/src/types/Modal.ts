import type { OrderDetailResponse } from "./Order";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  deleteIcon: React.ReactNode;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export interface OrderModalDetailProps {
  selectedOrder: number;
  onClose: () => void;
  myCompanyType: "CONSTRUCTION" | "SUPPLIER";
}

export interface ForCompanyProps {
  selectedOrder: OrderDetailResponse;
  onClose: () => void;
}
