import { useNavigate } from "react-router-dom";
import { FiLock, FiArrowRight } from "react-icons/fi";
import "../styles/LoginRequired.css";

function LoginRequired() {
  const navigate = useNavigate();

  return (
    <div className="login-required">
      <div className="login-required-card">
        <div className="login-required-icon">
          <FiLock />
        </div>

        <h1>로그인 후 이용 가능합니다</h1>
        <p>서비스를 이용하려면 먼저 로그인해주세요.</p>

        <button type="button" onClick={() => navigate("/login")}>
          로그인하러 가기
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}

export default LoginRequired;
