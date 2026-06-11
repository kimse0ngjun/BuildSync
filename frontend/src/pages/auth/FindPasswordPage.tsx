import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";

export default function FindPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!email) {
      setError("이메일을 입력하세요.");
      return;
    }
    try {
      await authApi.findPassword(email);
      setSent(true);
      setError("");
    } catch {
      setError("해당 이메일로 가입된 계정을 찾을 수 없습니다.");
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title">임시 비밀번호 전송 완료</h2>
          <p className="auth-desc">임시 비밀번호가</p>
          <div className="auth-result-box">{email}</div>
          <p className="auth-desc" style={{ marginTop: 4 }}>
            으로 전송되었습니다.
          </p>
          <div className="auth-btn-row">
            <button
              className="auth-btn auth-btn--ghost"
              onClick={() => navigate(-1)}
            >
              이전으로
            </button>
            <button
              className="auth-btn auth-btn--primary"
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="back-btn" onClick={() => navigate("/login")}>
          ←
        </button>
        <h2 className="auth-title">비밀번호 찾기</h2>
        <p className="auth-desc">
          가입 시 등록한 이메일 주소를 입력하면 임시 비밀번호 또는 비밀번호를
          재설정할 수 있는 링크를 이메일로 보내드립니다.
        </p>
        <div className="login-field">
          <label className="login-label">이메일 주소</label>
          <input
            className={`login-input${error ? " error" : ""}`}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="example@buildsync.com"
          />
          {error && <p className="login-error show">{error}</p>}
        </div>
        <button
          className={`login-btn${!email ? " disabled" : ""}`}
          disabled={!email}
          onClick={handleSend}
        >
          이메일 전송
        </button>
      </div>
    </div>
  );
}
