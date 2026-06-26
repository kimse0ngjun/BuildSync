import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import authApi from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import "../../styles/LoginPage.css";

function LoginPage() {
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
      const res = await authApi.login({
        loginId,
        password,
      });

      login({
        token: res.data.token,
        ceoName: res.data.ceoName,
        companyName: res.data.companyName,
        companyId: res.data.companyId,
        companyType: res.data.companyType,
        contactId: res.data.contactId,
      });

      localStorage.removeItem("isAdmin");

      setError("");
      navigate("/dashboard");
    } catch {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
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

        <h1>로그인</h1>

        <form className="login-form">
          <label>
            <span>아이디</span>
            <div className="login-input">
              <FiUser />
              <input
                type="text"
                placeholder="아이디를 입력하세요"
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
            로그인
            <FiArrowRight />
          </button>
        </form>

        <div className="login-links">
          <button type="button" onClick={() => navigate("/find-id")}>
            아이디 찾기
          </button>
          <span />
          <button type="button" onClick={() => navigate("/find-password")}>
            비밀번호 찾기
          </button>
          <span />
          <button type="button" onClick={() => navigate("/join")}>
            회원가입
          </button>
          <span />
          <button type="button" onClick={() => navigate("/admin/login")}>
            운영자 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
