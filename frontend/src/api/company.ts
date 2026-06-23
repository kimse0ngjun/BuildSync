import axios from "axios";
import type {
  CompanyListResponse,
  CompanyDetail
} from "../types/company";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};


export const getCompanies = (
  page = 0,
  keyword = "",
  type = ""
) => {
  return axios.get<CompanyListResponse>(
    `${API_URL}/companies`,
    {
      params: {
        page,
        size: 10,
        keyword,
        type,
        sort: "companyId,asc",
      },
      headers: getAuthHeader(),
    }
  );
};


export const getCompany = (
  companyId: number
) => {
  return axios.get<CompanyDetail>(
    `${API_URL}/companies/${companyId}`,
    {
      headers: getAuthHeader(),
    }
  );
};


export const updateCompany = (
  companyId: number,
  data: any
) => {
  return axios.put(
    `${API_URL}/companies/${companyId}`,
    data,
    {
      headers: getAuthHeader(),
    }
  );
};


export const deleteCompany = (
  companyId: number
) => {
  return axios.delete(
    `${API_URL}/companies/${companyId}`,
    {
      headers: getAuthHeader(),
    }
  );
};