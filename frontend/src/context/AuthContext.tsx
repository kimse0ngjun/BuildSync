import { createContext, useContext, useState } from "react";
import type { LoginResponse } from "../types/Auth.ts";
import type { AuthContextType } from "../types/authContext";
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

  // 로그인
  const login = (data: LoginResponse) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("ceoName", data.ceoName);
    localStorage.setItem("companyName", data.companyName);

    setIsLogin(true);
    setCeoName(data.ceoName);
    setCompanyName(data.companyName);
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ceoName");
    localStorage.removeItem("companyName");

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

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthProvider 없음");
  }

  return context;
};
