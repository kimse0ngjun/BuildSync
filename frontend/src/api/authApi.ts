import api from "../utils/axios";

const authApi = {
  login: (data) => api.post("/auth/login", data),

  signup: (data) => api.post("/auth/signup", data),

  findId: (phone) => api.post("/auth/find-id", { phone }),

  findPassword: (email) => api.post("/auth/find-password", { email }),

  resetPassword: (data) => api.post("/auth/reset-password", data),
};

export default authApi;
