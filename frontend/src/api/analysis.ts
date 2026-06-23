import axios from "axios";
import type {
  MonthlyMaterialCostResponse,
  SiteMaterialUsageAnalysisResponse,
} from "../types/analysis";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

// 월별 자재 구매 비용 분석
export const getMonthlyMaterialCost = (companyId: number) => {
  return axios.get<MonthlyMaterialCostResponse[]>(
    `${API_URL}/analysis/material/monthly`,
    {
      params: { companyId },
      headers: getAuthHeader(),
    },
  );
};

// 현장별 자재 사용 분석
export const getSiteMaterialUsage = (companyId: number) => {
  return axios.get<SiteMaterialUsageAnalysisResponse[]>(
    `${API_URL}/analysis/material/site`,
    {
      params: { companyId },
      headers: getAuthHeader(),
    },
  );
};
