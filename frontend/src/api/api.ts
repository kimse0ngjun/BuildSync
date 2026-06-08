import axios from "axios";
import type { Company, Contact, Material } from "../types/OrderDTO";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const writeOrderApi = {
  getSupplierList: () =>
    api<Company[]>("/order/company").then((res) => res.data),

  getContactList: (companyId: number) =>
    api<Contact[]>(`/order/contact?companyId=${companyId}`).then(
      (res) => res.data,
    ),

  getOurCompanyMaterial: (companyId: number) =>
    api<Material[]>(`/order/material?companyId=${companyId}`).then(
      (res) => res.data,
    ),

  writeOrder: (data: any) =>
    api.post("/order/write", data).then((res) => res.data),
};
