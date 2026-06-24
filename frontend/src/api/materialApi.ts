import api from "../utils/axios";

export const materialApi = {
  getAllMaterials: (params: any) =>
    api.get("/materials", { params }).then((res) => res.data),

  getMaterials: (params: any) =>
    api.get("/company-materials", { params }).then((res) => res.data),

  getMaterial: (id: number | string) =>
    api.get(`/materials/${id}`).then((res) => res.data),

  getCategories: () => api.get("/material-categories").then((res) => res.data),

  createMaterial: (data: any) =>
    api.post("/materials", data).then((res) => res.data),

  updateCompanyMaterial: (id: number | string, data: any) =>
    api.put(`/company-materials/${id}`, data).then((res) => res.data),

  deleteCompanyMaterial: (id: number | string) =>
    api.delete(`/company-materials/${id}`).then((res) => res.data),
};
