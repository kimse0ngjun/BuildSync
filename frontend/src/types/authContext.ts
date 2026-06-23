export type AuthContextType = {
  isLogin: boolean;
  ceoName: string;
  companyName: string;
  companyType: string;

  login: (data: {
    token: string;
    ceoName: string;
    companyName: string;
    companyId: number;
    companyType: string;
  }) => void;

  logout: () => void;
};
