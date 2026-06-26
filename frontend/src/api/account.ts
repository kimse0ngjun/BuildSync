import axios from "axios";

const BASE = `${import.meta.env.VITE_API_URL}/company`;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getAccount = (companyId: number) => {
  return axios.get(`${BASE}/${companyId}/account`, {
    headers: getAuthHeader(),
  });
};

export const updateAccount = (
  companyId: number,
  data: {
    companyName: string;
    ceoName: string;
    phone: string;
    homepageUrl: string;
    address: string;
  },
) => {
  return axios.put(`${BASE}/${companyId}/account`, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
};

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return axios.put(`${BASE}/password`, data, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
};

export const deleteAccount = (password: string) => {
  return axios.delete(`${BASE}`, {
    data: {
      password,
    },

    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
};
