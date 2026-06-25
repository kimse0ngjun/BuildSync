import axios from "axios";

import type {
  MonthlyPurchase,
  SiteUsage,
  MonthlySales,
  SiteCost,
} from "../types/analysis";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const getCompanyId = () => {
  return localStorage.getItem("companyId");
};

// 건설업체
// 월별 자재 구매 비용 합계
export const getCompanyMonthlyPurchase = async (): Promise<
  MonthlyPurchase[]
> => {
  const companyId = getCompanyId();

  const res = await axios.get(`${API_URL}/analysis/company/monthly-purchase`, {
    params: {
      companyId,
    },
    headers: getAuthHeader(),
  });

  return res.data;
};

// 건설업체
// 현장별 자재 사용 합계
export const getCompanySiteUsage = async (): Promise<SiteUsage[]> => {
  const companyId = getCompanyId();

  const res = await axios.get(`${API_URL}/analysis/company/site-usage`, {
    params: {
      companyId,
    },
    headers: getAuthHeader(),
  });

  return res.data;
};

// 공급업체
// 월별 자재 판매 비용 합계
export const getSupplierMonthlySales = async (): Promise<MonthlySales[]> => {
  const companyId = getCompanyId();

  const res = await axios.get(`${API_URL}/analysis/supplier/monthly-sales`, {
    params: {
      companyId,
    },
    headers: getAuthHeader(),
  });

  return res.data;
};

// 공급업체
// 현장별 자재 비용 상세
export const getSupplierSiteCost = async (): Promise<SiteCost[]> => {
  const companyId = getCompanyId();

  const res = await axios.get(`${API_URL}/analysis/supplier/site-cost`, {
    params: {
      companyId,
    },
    headers: getAuthHeader(),
  });

  return res.data;
};
