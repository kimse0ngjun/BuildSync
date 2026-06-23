export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface SignupRequest {
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

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  ceoName: string;
  companyName: string;
}