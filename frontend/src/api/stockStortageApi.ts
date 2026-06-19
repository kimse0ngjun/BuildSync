import axios from "axios";
import type {
  MaterialShortageResponse,
  PageResponse,
  StockShortageResponse,
} from "../types/NotificationDTO";

const api = axios.create({
  baseURL: "http://localhost:8080/api/shortage",
  headers: {
    "Content-Type": "application/json",
  },
});

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
