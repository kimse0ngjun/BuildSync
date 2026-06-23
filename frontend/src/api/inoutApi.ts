import axios from "axios";
import type {
  AutoFillResponse,
  InOutFilterParams,
  InOutRegRequest,
  InOutResponse,
  InOutSumResponse,
  SelectOption,
  StockInfoResponse,
} from "../types/InOut";

const api = axios.create({
  baseURL: "http://localhost:8080/api/inout",
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

export const inoutApi = {
  // 입출고 대시보드
  getInoutDashboard: (
    filters: InOutFilterParams,
  ): Promise<InOutSumResponse> => {
    const params = {
      companyId: filters.companyId,
      type: filters.type || undefined,
      materialId: filters.materialId || undefined,
      siteId: filters.siteId || undefined,
      orderId: filters.orderId || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      keyword: filters.keyword?.trim() || undefined,
      page: filters.page,
      size: filters.size,
    };

    return api.get<InOutSumResponse>("/dashboard", { params }).then((res) => {
      console.log("입출고 API 수신", res.data);
      return res.data;
    });
  },

  // 입출고 등록
  getAutoFillData: (orderId: number): Promise<AutoFillResponse> => {
    return api
      .get<AutoFillResponse>("/auto-fill", { params: { orderId } })
      .then((res) => {
        console.log("발주 자동완성 데이터", res.data);
        return res.data;
      });
  },

  registerStockInout: (regData: InOutRegRequest): Promise<string> => {
    return api.post<string>("/regist", regData).then((res) => {
      console.log("입출고 등록 성공");
      return res.data;
    });
  },

  getPureStockInfo: (
    companyId: number,
    materialId: number,
  ): Promise<StockInfoResponse> => {
    return api
      .get<StockInfoResponse>("/stock-info", {
        params: {
          companyId,
          materialId,
        },
      })
      .then((res) => {
        console.log("자재 실시간 기준정보", res.data);
        return res.data;
      });
  },

  // 상세
  getInoutDetail: (stockInoutId: number): Promise<InOutResponse> => {
    return api
      .get<InOutResponse>(`/detail/${stockInoutId}`)
      .then((res) => res.data);
  },

  // 수정
  updateStockInout: (
    stockInoutId: number,
    regData: InOutRegRequest,
  ): Promise<string> => {
    return api.patch<string>(`/update/${stockInoutId}`, regData).then((res) => {
      console.log("입출고 수정 처리 성공:", res.data);
      return res.data;
    });
  },

  // 공통 Select 옵션 (자재 / 현장 / 발주)
  getMaterials: (): Promise<SelectOption[]> => {
    return api.get<SelectOption[]>("/materials").then((res) => {
      return res.data;
    });
  },

  getSites: (): Promise<SelectOption[]> => {
    return api.get<SelectOption[]>("/sites").then((res) => {
      return res.data;
    });
  },

  getOrders: (companyId: number): Promise<SelectOption[]> => {
    return api
      .get<SelectOption[]>("/orders", { params: { companyId } })
      .then((res) => {
        return res.data;
      });
  },
};
