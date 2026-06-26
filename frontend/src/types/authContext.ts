export type AuthContextType = {
  isLogin: boolean;
  ceoName: string;
  companyName: string;
  companyType: string;
  contactId: number | null;

  login: (data: {
    token: string;
    ceoName: string;
    companyName: string;
    companyId: number;
    companyType: string;
    contactId: number | null;
  }) => void;

  logout: () => void;

  updateCompanyInfo: (companyName: string, ceoName: string) => void;
};
