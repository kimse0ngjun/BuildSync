import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "../../styles/FindPasswordPage.css";

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
      <div className="findpw-page">
        <div className="findpw-card">
          <h2 className="findpw-title">임시 비밀번호 전송 완료</h2>

          <p className="findpw-desc">임시 비밀번호가</p>

          <div className="findpw-result-box">{email}</div>

          <p className="findpw-desc" style={{ marginTop: 4 }}>
            으로 전송되었습니다.
          </p>

          <div className="findpw-btn-row">
            <button
              className="findpw-action-btn findpw-action-btn--ghost"
              onClick={() => navigate(-1)}
            >
              이전으로
            </button>

            <button
              className="findpw-action-btn findpw-action-btn--primary"
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
    <div className="findpw-page">
      <div className="findpw-card">
        <div className="login-logo">
          <div className="login-logo-box">B</div>
          <span>
            <b>Build</b>
            <strong>Sync</strong>
          </span>
        </div>
        <button className="findpw-back-btn" onClick={() => navigate("/login")}>
          ←
        </button>
        <h2 className="findpw-title">비밀번호 찾기</h2>

        <p className="findpw-desc">
          가입 시 등록한 이메일 주소를 입력하면 임시 비밀번호 또는 비밀번호를
          재설정할 수 있는 링크를 이메일로 보내드립니다.
        </p>

        <div className="findpw-field">
          <label className="findpw-label">이메일 주소</label>

          <input
            className={`findpw-input${error ? " error" : ""}`}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="example@buildsync.com"
          />

          {error && <p className="findpw-error">{error}</p>}
        </div>

        <button
          className={`findpw-btn${!email ? " disabled" : ""}`}
          disabled={!email}
          onClick={handleSend}
        >
          이메일 전송
        </button>
      </div>
    </div>
  );
}
