import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "../../styles/FindIdPage.css";

export default function FindIdPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handlePhoneChange = (e) => {
    const number = e.target.value.replace(/[^0-9]/g, "");
    let formatted = number;
    if (number.length > 3 && number.length <= 7) {
      formatted = `${number.slice(0, 3)}-${number.slice(3)}`;
    } else if (number.length > 7) {
      formatted = `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7, 11)}`;
    }
    setPhone(formatted);
    setError("");
  };

  const handleFind = async () => {
    if (!phone) {
      setError("휴대전화 번호를 입력하세요.");
      return;
    }
    try {
      const res = await authApi.findId(phone.replace(/-/g, "")); // ← 하이픈 제거
      setResult(res.data.loginId);
      setError("");
    } catch {
      setError("해당 번호로 가입된 계정을 찾을 수 없습니다.");
    }
  };

  if (result) {
    return (
      <div className="findid-page">
        <div className="findid-card">
          <div className="findid-inner">
            <h2 className="findid-title">아이디 찾기 성공</h2>
            <p className="findid-desc">회원님의 아이디는</p>

            <div className="findid-result-box">{result}</div>

            <div className="findid-btn-row">
              <button
                className="findid-action-btn findid-action-btn--ghost"
                onClick={() => navigate("/find-password")}
              >
                비밀번호 찾기
              </button>

              <button
                className="findid-action-btn findid-action-btn--primary"
                onClick={() => navigate("/login")}
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="findid-page">
      <div className="findid-card">
        <div className="login-logo">
          <div className="login-logo-box">B</div>
          <span>
            <b>Build</b>
            <strong>Sync</strong>
          </span>
        </div>
        <div className="findid-inner">
          <button
            className="findid-back-btn"
            onClick={() => navigate("/login")}
          >
            ←
          </button>

          <h2 className="findid-title">아이디 찾기</h2>

          <p className="findid-desc">
            가입 시 등록한 휴대전화 번호를 입력하면 아이디를 확인할 수 있습니다.
          </p>

          <div className="findid-field">
            <label className="findid-label">휴대전화 번호</label>

            <input
              className={`findid-input${error ? " error" : ""}`}
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              maxLength={13}
            />

            {error && <p className="findid-error">{error}</p>}
          </div>

          <div className="findid-btn-single">
            <button
              className={`findid-btn${!phone ? " disabled" : ""}`}
              disabled={!phone}
              onClick={handleFind}
            >
              아이디 찾기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
