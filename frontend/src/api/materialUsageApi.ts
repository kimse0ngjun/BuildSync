import api from "../utils/axios";

export const materialUsageApi = {
  getUsages: (params?: {
    keyword?: string;
    siteId?: string | number;
    materialId?: string | number;
    page?: number;
    size?: number;
  }) => api.get("/site-material-usages", { params }).then((res) => res.data),
};
