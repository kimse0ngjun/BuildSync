import { createContext, useContext, useState } from "react";

type AuthContextType = {
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

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const [ceoName, setCeoName] = useState(
    () => localStorage.getItem("ceoName") || "",
  );

  const [companyName, setCompanyName] = useState(
    () => localStorage.getItem("companyName") || "",
  );

  // 로그인 처리
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("ceoName", data.ceoName);
    localStorage.setItem("companyName", data.companyName);

    setIsLogin(true);
    setCeoName(data.ceoName);
    setCompanyName(data.companyName);
  };

  // 로그아웃 처리
  const logout = () => {
    localStorage.removeItem("token");

    setIsLogin(false);
    setCeoName("");
    setCompanyName("");
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        ceoName,
        companyName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 사용 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider 없음");
  return context;
};
