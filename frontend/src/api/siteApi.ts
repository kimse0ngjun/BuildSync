import api from "../utils/axios";

export const siteApi = {
  getSites: (params: any) =>
    api.get("/sites", { params }).then((res) => res.data),

  createSite: (data: any) => api.post("/sites", data).then((res) => res.data),

  updateSite: (id: number | string, data: any) =>
    api.put(`/sites/${id}`, data).then((res) => res.data),

  deleteSite: (id: number | string) =>
    api.delete(`/sites/${id}`).then((res) => res.data),
};
