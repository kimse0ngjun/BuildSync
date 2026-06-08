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
