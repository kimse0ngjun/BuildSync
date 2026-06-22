import api from "../utils/axios";

const adminApi = {
  login: (data: { loginId: string; password: string }) =>
    api.post("/admin/auth/login", data),

  getDashboard: () => api.get("/admin/dashboard").then((res) => res.data),

  getPendingCompanies: (params?: { page?: number; size?: number }) =>
    api.get("/admin/companies/pending", { params }).then((res) => res.data),

  approveCompany: (companyId: number | string) =>
    api.patch(`/admin/companies/${companyId}/approve`).then((res) => res.data),

  rejectCompany: (companyId: number | string) =>
    api.patch(`/admin/companies/${companyId}/reject`).then((res) => res.data),

  getMaterialCategories: () =>
    api.get("/material-categories").then((res) => res.data),

  createMaterialCategory: (data: { categoryName: string }) =>
    api.post("/admin/material-categories", data).then((res) => res.data),

  updateMaterialCategory: (
    categoryId: number | string,
    data: { categoryName: string },
  ) =>
    api
      .put(`/admin/material-categories/${categoryId}`, data)
      .then((res) => res.data),

  deleteMaterialCategory: (categoryId: number | string) =>
    api
      .delete(`/admin/material-categories/${categoryId}`)
      .then((res) => res.data),
};

export default adminApi;
