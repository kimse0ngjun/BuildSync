import axios from "axios";
import type { Company, Contact, Material } from "../types/OrderDTO";

const api = axios.create({
  baseURL: "/order",
  headers: {
    "Content-Type": "application/json",
  },
});

export const writeOrderApi = {
  getSupplierList: () => api<Company[]>("/company").then((res) => res.data),

  getContactList: (companyId: number) =>
    api<Contact[]>(`/contact?companyId=${companyId}`).then((res) => res.data),

  getOurCompanyMaterial: (companyId: number) =>
    api<Material[]>(`/material?companyId=${companyId}`).then((res) => res.data),

  writeOrder: (data: any) => api.post("/write", data).then((res) => res.data),
};

export const orderListApi = {
  getOrderList: (filters: {
    status?: string;
    search?: string;
    currentPage: number;
    size: number;
  }) => {
    return api.get<any[]>("/list", { params: filters }).then((res) => res.data);
  },

  getOrderDetail: (orderId: number) => {
    return api.get<any>(`/detail/${orderId}`).then((res) => res.data);
  },

  updateStockIn: (orderId: number) => {
    api.patch<string>(`/stock-in/${orderId}`);
  },

  changeOrderCancel: (orderId: number, status: string) => {
    api
      .patch<string>(`/cancel/${orderId}`, null, {
        params: { status: status },
      })
      .then((res) => res.data);
  },

  updateOrderDetail: (orderId: number, updateData: any) => {
    api.patch<string>(`/update/${orderId}`, updateData).then((res) => res.data);
  },

  updateOrderStatus: (orderId: number, status: string) => {
    api
      .patch<string>(`/update-status/${orderId}`, null, {
        params: { status: status },
      })
      .then((res) => res.data);
  },
};
