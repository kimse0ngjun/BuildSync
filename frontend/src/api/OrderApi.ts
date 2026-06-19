import axios from "axios";
import type {
  CompanyResponse,
  Contact,
  MaterialResponse,
  PageResponse,
} from "../types/OrderDTO";

const api = axios.create({
  baseURL: "http://localhost:8080/api/order",
  headers: {
    "Content-Type": "application/json",
  },
});

// 발주서 작성 api
export const writeOrderApi = {
  getSupplierList: () => {
    return api.get<CompanyResponse[]>("/company").then((res) => res.data);
  },

  getContactList: (companyId: number) => {
    return api
      .get<Contact[]>(`/contact?companyId=${companyId}`)
      .then((res) => res.data);
  },

  getOurCompanyMaterial: (companyId: number) => {
    return api
      .get<MaterialResponse[]>(`/material?companyId=${companyId}`)
      .then((res) => res.data);
  },

  writeOrder: (data: any) => {
    return api.post("/write", data).then((res) => res.data);
  },
};

// 발주 목록 api
export const orderListApi = {
  getOrderListConstruction: (filters: {
    companyId: number;
    status?: string;
    keyword?: string;
    page: number;
    size: number;
  }) => {
    const params = {
      companyId: filters.companyId,
      status: filters.status || undefined,
      keyword: filters.keyword || undefined,
      page: filters.page,
      size: filters.size,
    };

    return api
      .get<PageResponse<any>>("/construction", { params })
      .then((res) => res.data);
  },

  getOrderDetail: (orderId: number) => {
    return api.get<any>(`/detail/${orderId}`).then((res) => res.data);
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
