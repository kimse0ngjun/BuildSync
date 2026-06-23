import axios from "axios";
import type {
  ContactInfo,
  MaterialSelectResponse,
  OrderDetailResponse,
  OrderListResponse,
  OrderRequest,
  OrderStatusResponse,
  PageResponse,
  SelectResponse,
} from "../types/Order";

const api = axios.create({
  baseURL: "http://localhost:8080/api/order",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const orderListApi = {
  // 건설업체 대시보드 상태 카운트 조회
  getConstructionCounts: async (
    companyId: number,
  ): Promise<OrderStatusResponse> => {
    const response = await api.get("/counts/construction", {
      params: { companyId },
    });
    return response.data;
  },

  // 공급업체 대시보드 상태 카운트 조회
  getSupplierCounts: async (
    companyId: number,
  ): Promise<OrderStatusResponse> => {
    const response = await api.get("/counts/supplier", {
      params: { companyId },
    });
    return response.data;
  },

  // 발주 목록
  getOrderList: async (
    companyId: number,
    partnerType: string,
    page: number = 0,
    size: number = 10,
  ): Promise<PageResponse<OrderListResponse>> => {
    const targetUrl =
      partnerType === "CONSTRUCTION" ? "/construction" : "/supplier";

    const response = await api.get(targetUrl, {
      params: {
        companyId,
        page,
        size,
      },
    });

    return response.data;
  },

  // 발주서 상세 보기
  getOrderDetail: async (orderId: number): Promise<OrderDetailResponse> => {
    const response = await api.get(`/detail/${orderId}`);
    return response.data;
  },
};

export const writeOrderApi = {
  // 공사현장 셀렉트 박스 조회
  getSiteSelectOptions: async (): Promise<SelectResponse[]> => {
    const response = await api.get("/site");
    return response.data;
  },

  // 공급업체별 자재 셀렉트 박스 조회
  getMaterialSelectOptions: async (
    companyId: number,
  ): Promise<MaterialSelectResponse[]> => {
    const response = await api.get("/material", {
      params: { companyId },
    });
    return response.data;
  },

  // 공급업체 셀렉트 박스 조회
  getPartnerSelectOptions: async (
    companyType: "SUPPLIER" | "CONSTRUCTION",
  ): Promise<SelectResponse[]> => {
    const response = await api.get("/company", {
      params: { companyType },
    });
    return response.data;
  },

  // 담당자 자동 채움
  getContactOptions: async (companyId: number): Promise<ContactInfo[]> => {
    const response = await api.get("/contact", { params: { companyId } });
    return response.data;
  },

  // 발주서 등록
  registOrder: async (data: OrderRequest): Promise<void> => {
    await api.post("/write", data);
  },

  // 건설업체 발주서 전체 수정
  modifyOrderByCompany: async (
    orderId: number,
    data: OrderRequest,
  ): Promise<string> => {
    const response = await api.put(`/update/${orderId}`, data);
    return response.data;
  },

  // 건설업체 발주서 취소
  cancelOrderByConstruction: async (orderId: number): Promise<string> => {
    const response = await api.patch(`/cancel/${orderId}`);
    return response.data;
  },

  // 7. 공급업체 발주서 상태만 수정
  updateStatusBySupplier: async (
    orderId: number,
    status: string,
  ): Promise<string> => {
    const response = await api.patch(`/update/status/${orderId}`, null, {
      params: { status },
    });
    return response.data;
  },
};
