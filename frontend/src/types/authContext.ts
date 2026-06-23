export type AuthContextType = {
  isLogin: boolean;
  ceoName: string;
  companyName: string;

  login: (data: {
    token: string;
    ceoName: string;
    companyName: string;
  }) => void;

  logout: () => void;
};
