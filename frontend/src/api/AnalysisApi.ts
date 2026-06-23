import axios from "axios";
import type { AnalysisFilters, Sites } from "../types/AnalysisDTO";

const api = axios.create({
  baseURL: "/analysis",
  headers: {
    "Content-Type": "application/json",
  },
});

export const analysisApi = {
  getSitesList: (): Promise<Sites[]> => {
    return api<Sites[]>("/sites").then((res) => res.data);
  },

  getMonthlyAnalysis: (filters: AnalysisFilters): Promise<any> => {
    return api.get("/monthly", { params: filters }).then((res) => res.data);
  },

  getSiteAnalysis: (filters: AnalysisFilters): Promise<any> => {
    return api.get("/site", { params: filters }).then((res) => res.data);
  },
};
