import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "../../styles/auth/LoginPage.css";
import "../../styles/auth/AuthPage.css";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    passwordConfirm: "",
    companyName: "",
    ceoName: "",
    businessNumber: "",
    businessRegistrationNumber: "",
    address: "",
    homepage: "",
    businessType: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (e) => {
    const number = e.target.value.replace(/[^0-9]/g, "");
    let formatted = number;
    if (number.length > 3 && number.length <= 7) {
      formatted = `${number.slice(0, 3)}-${number.slice(3)}`;
    } else if (number.length > 7) {
      formatted = `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7, 11)}`;
    }
    setForm((prev) => ({ ...prev, phone: formatted }));
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.loginId) errs.loginId = "아이디를 입력하세요.";
    if (!form.password) errs.password = "비밀번호를 입력하세요.";
    if (form.password !== form.passwordConfirm)
      errs.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    if (!form.companyName) errs.companyName = "상호 명칭을 입력하세요.";
    if (!form.ceoName) errs.ceoName = "대표자를 입력하세요.";
    if (!form.businessNumber)
      errs.businessNumber = "사업자등록번호를 입력하세요.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      await authApi.signup({
        ...form,
        phone: form.phone.replace(/-/g, ""),
      });
      navigate("/login");
    } catch {
      setErrors({ global: "회원가입에 실패했습니다." });
    }
  };

  return (
    <div className="auth-inner">
      <h2 className="auth-title">회원가입</h2>

      <div className="auth-section-label">
        로그인 정보 <span className="auth-required">*</span>
      </div>

      <Field label="아이디" error={errors.loginId}>
        <input
          className={`login-input${errors.loginId ? " error" : ""}`}
          name="loginId"
          value={form.loginId}
          onChange={handleChange}
          placeholder="아이디"
        />
      </Field>
      <Field label="비밀번호" error={errors.password}>
        <input
          className={`login-input${errors.password ? " error" : ""}`}
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="비밀번호"
        />
      </Field>
      <Field label="비밀번호 확인" error={errors.passwordConfirm}>
        <input
          className={`login-input${errors.passwordConfirm ? " error" : ""}`}
          name="passwordConfirm"
          type="password"
          value={form.passwordConfirm}
          onChange={handleChange}
          placeholder="비밀번호 확인"
        />
      </Field>

      <div className="auth-section-label" style={{ marginTop: 24 }}>
        업체 정보 <span className="auth-required">*</span>
      </div>

      <Field label="상호 명칭" error={errors.companyName}>
        <input
          className={`login-input${errors.companyName ? " error" : ""}`}
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
        />
      </Field>
      <Field label="대표자" error={errors.ceoName}>
        <input
          className={`login-input${errors.ceoName ? " error" : ""}`}
          name="ceoName"
          value={form.ceoName}
          onChange={handleChange}
        />
      </Field>
      <Field label="사업자등록번호" error={errors.businessNumber}>
        <input
          className={`login-input${errors.businessNumber ? " error" : ""}`}
          name="businessNumber"
          value={form.businessNumber}
          onChange={handleChange}
          placeholder="ex) 123-45-6789"
        />
      </Field>
      <Field label="상업 등록번호">
        <input
          className="login-input"
          name="businessRegistrationNumber"
          value={form.businessRegistrationNumber}
          onChange={handleChange}
          placeholder="ex) 123456-6789012"
        />
      </Field>
      <Field label="상호 유형">
        <input
          className="login-input"
          name="businessType"
          value={form.businessType}
          onChange={handleChange}
        />
      </Field>
      <Field label="연락처">
        <input
          className="login-input"
          name="phone"
          value={form.phone}
          onChange={handlePhoneChange}
          placeholder="ex) 010xxxxxxxx 하이폰 빼고 입력"
        />
      </Field>
      <Field label="홈페이지 url">
        <input
          className="login-input"
          name="homepage"
          value={form.homepage}
          onChange={handleChange}
        />
      </Field>
      <Field label="업체 주소">
        <input
          className="login-input"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
      </Field>

      {errors.global && <p className="login-error show">{errors.global}</p>}

      <div className="auth-btn-row">
        <button className="auth-btn auth-btn--primary" onClick={handleSubmit}>
          회원가입
        </button>
        <button
          className="auth-btn auth-btn--ghost"
          onClick={() => navigate("/login")}
        >
          취소
        </button>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="login-field">
      <label className="login-label">{label}</label>
      {children}
      {error && <p className="login-error show">{error}</p>}
    </div>
  );
}
