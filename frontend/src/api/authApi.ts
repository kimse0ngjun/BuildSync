import api from "../utils/axios";

interface LoginRequest {
  loginId: string;
  password: string;
}

interface SignupRequest {
  companyType: string;
  loginId: string;
  password: string;
  companyName: string;
  ceoName: string;
  businessNumber: string;
  phone: string;
  homepageUrl: string;
  address: string;
  email: string;
}

interface ResetPasswordRequest {
  email: string;
  password: string;
}

const authApi = {
  login: (data: LoginRequest) =>
    api.post("/auth/login", data),

  signup: (data: SignupRequest) =>
    api.post("/auth/signup", data),

  findId: (phone: string) =>
    api.post("/auth/find-id", { phone }),

  findPassword: (email: string) =>
    api.post("/auth/find-password", { email }),

  resetPassword: (data: ResetPasswordRequest) =>
    api.post("/auth/reset-password", data),
};

export default authApi;