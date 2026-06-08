import axios from "axios";
import type {
  Company,
  Contact,
  Material,
  OrderDetail,
} from "../types/OrderDTO";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const writeOrderApi = {
  getSupplierList: () => api<Company[]>("").then((res) => res.data),
  getContactList: (companyId: number) =>
    api<Contact[]>(`/contact?companyId=${companyId}`).then((res) => res.data),
  getOurCompanyMaterial: () => api<Material[]>("").then((res) => res.data),

  writeOrder: (data: OrderDetail) => api.post("", data).then((res) => res.data),
};
