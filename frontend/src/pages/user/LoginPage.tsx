import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import "../../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [autoLogin, setAutoLogin] = useState(true);

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
              <input type="text" placeholder="아이디를 입력하세요" />
            </div>
          </label>

          <label>
            <span>비밀번호</span>
            <div className="login-input">
              <FiLock />
              <input type="password" placeholder="비밀번호를 입력하세요" />
            </div>
          </label>

          <label className="auto-login">
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={() => setAutoLogin((prev) => !prev)}
            />
            <span>자동 로그인</span>
          </label>

          <button
            type="button"
            className="login-submit"
            onClick={() => navigate("/dashboard")}
          >
            로그인
            <FiArrowRight />
          </button>
        </form>

        <div className="login-links">
          <button type="button">아이디 찾기</button>
          <span />
          <button type="button">비밀번호 찾기</button>
          <span />
          <button type="button" onClick={() => navigate("/join")}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
