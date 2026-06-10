import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import authApi from "../../api/authApi";
import "../../styles/auth/LoginPage.css";
import "../../styles/auth/AuthPage.css";

interface FormState {
  password: string;
  passwordConfirm: string;
}

interface Errors {
  [key: string]: string;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState<FormState>({
    password: "",
    passwordConfirm: "",
  });

  const [showPw, setShowPw] = useState<boolean>(false);
  const [showPwConfirm, setShowPwConfirm] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = (): Errors => {
    const errs: Errors = {};

    if (!form.password) {
      errs.password = "새 비밀번호를 입력하세요.";
    } else if (form.password.length < 8) {
      errs.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (!form.passwordConfirm) {
      errs.passwordConfirm = "비밀번호 확인을 입력하세요.";
    } else if (form.password !== form.passwordConfirm) {
      errs.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      await authApi.resetPassword({
        token,
        newPassword: form.password,
      });

      setDone(true);
    } catch {
      setErrors({
        global:
          "비밀번호 재설정에 실패했습니다. 링크가 만료되었을 수 있습니다.",
      });
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title">잘못된 접근</h2>
          <p className="auth-desc">유효하지 않은 링크입니다.</p>

          <div className="auth-btn-single">
            <button
              className="auth-btn auth-btn--primary"
              onClick={() => navigate("/login")}
            >
              로그인으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 className="auth-title">비밀번호 재설정 완료</h2>
          <p className="auth-desc">새 비밀번호로 로그인해주세요.</p>

          <div className="auth-btn-single">
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
        <h2 className="auth-title">비밀번호 재설정</h2>
        <p className="auth-desc">새로운 비밀번호를 입력해주세요.</p>

        <div className="login-field">
          <label className="login-label">새 비밀번호</label>

          <div className="login-pw-wrap">
            <input
              className={`login-input${errors.password ? " error" : ""}`}
              name="password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="8자 이상 입력"
            />

            <button
              className="login-pw-toggle"
              type="button"
              onClick={() => setShowPw((v) => !v)}
            >
              {showPw ? "🧿" : "👁️"}
            </button>
          </div>

          {errors.password && (
            <p className="login-error show">{errors.password}</p>
          )}
        </div>

        <div className="login-field">
          <label className="login-label">비밀번호 확인</label>

          <div className="login-pw-wrap">
            <input
              className={`login-input${errors.passwordConfirm ? " error" : ""}`}
              name="passwordConfirm"
              type={showPwConfirm ? "text" : "password"}
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호 확인"
            />

            <button
              className="login-pw-toggle"
              type="button"
              onClick={() => setShowPwConfirm((v) => !v)}
            >
              {showPwConfirm ? "🧿" : "👁️"}
            </button>
          </div>

          {errors.passwordConfirm && (
            <p className="login-error show">{errors.passwordConfirm}</p>
          )}
        </div>

        {errors.global && <p className="login-error show">{errors.global}</p>}

        <div className="auth-btn-row">
          <button
            className={`auth-btn auth-btn--primary${
              !form.password || !form.passwordConfirm ? " disabled" : ""
            }`}
            disabled={!form.password || !form.passwordConfirm}
            onClick={handleSubmit}
          >
            재설정
          </button>

          <button
            className="auth-btn auth-btn--ghost"
            onClick={() => navigate("/login")}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
