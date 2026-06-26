import axios from "axios";
import type {
  MaterialShortageResponse,
  PageResponse,
  StockShortageResponse,
} from "../types/Notification";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/shortage`,
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

export const stockShortageApi = {
  getShortageCard: (companyId: number) => {
    return api
      .get<StockShortageResponse>(`/card?companyId=${companyId}`)
      .then((res) => res.data);
  },

  getShortageList: (companyId: number, page: number = 0) => {
    return api
      .get<
        PageResponse<MaterialShortageResponse>
      >(`/list?companyId=${companyId}&page=${page}`)
      .then((res) => res.data);
  },
};
