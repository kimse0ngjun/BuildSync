import axios from "axios";
import type { Company, Contact, Material, OrderList } from "../types/OrderDTO";

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
    return api
      .get<OrderList[]>("/list", { params: filters })
      .then((res) => res.data);
  },
};
