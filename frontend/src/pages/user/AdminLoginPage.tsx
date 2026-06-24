import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import adminApi from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import "../../styles/LoginPage.css";

function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [autoLogin, setAutoLogin] = useState(true);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!loginId || !password) {
      setError("아이디 또는 비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await adminApi.login({
        loginId,
        password,
      });

      login({
        token: res.data.token,
        ceoName: res.data.adminName,
        companyName: "관리자",
      });

      localStorage.setItem("isAdmin", "true");

      setError("");
      window.location.href = "/dashboard";
    } catch {
      setError("운영자 아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-box">B</div>
          <span>
            <b>Build</b>
            <strong>Sync</strong>
          </span>
        </div>

        <h1>운영자 로그인</h1>

        <form className="login-form">
          <label>
            <span>아이디</span>
            <div className="login-input">
              <FiUser />
              <input
                type="text"
                placeholder="운영자 아이디를 입력하세요"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  setError("");
                }}
              />
            </div>
          </label>

          <label>
            <span>비밀번호</span>
            <div className="login-input">
              <FiLock />
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
            </div>
          </label>

          {error && <p className="login-error">{error}</p>}

          <label className="auto-login">
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={() => setAutoLogin((prev) => !prev)}
            />
            <span>자동 로그인</span>
          </label>

          <button type="button" className="login-submit" onClick={handleLogin}>
            운영자 로그인
            <FiArrowRight />
          </button>
        </form>

        <div className="login-links">
          <button type="button" onClick={() => navigate("/login")}>
            일반 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
