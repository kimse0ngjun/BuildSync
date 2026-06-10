import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const isDisabled = !loginId || !password;

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
      });

      setError("");
      navigate("/dashboard");
    } catch (err) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="login-form">
      <div className="login-field">
        <label className="login-label">아이디</label>
        <input
          className={`login-input${error ? " error" : ""}`}
          value={loginId}
          onChange={(e) => {
            setLoginId(e.target.value);
            setError("");
          }}
          autoComplete="username"
        />
      </div>

      <div className="login-field">
        <label className="login-label">비밀번호</label>
        <div className="login-pw-wrap">
          <input
            className={`login-input${error ? " error" : ""}`}
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            autoComplete="current-password"
          />
          <button
            className="login-pw-toggle"
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label="비밀번호 표시 전환"
          >
            {showPw ? "🧿" : "👁️"}
          </button>
        </div>
      </div>

      {error && <p className="login-error show">{error}</p>}

      <label className="login-remember">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        자동 로그인
      </label>

      <button
        className={`login-btn${isDisabled ? " disabled" : ""}`}
        disabled={isDisabled}
        onClick={handleLogin}
      >
        로그인
      </button>

      <div className="login-links">
        <Link to="/find-id">아이디 찾기</Link>
        <span className="sep">|</span>
        <Link to="/find-password">비밀번호 찾기</Link>
        <span className="sep">|</span>
        <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
}
