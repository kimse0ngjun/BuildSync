import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "../../styles/auth/SignupPage.css";

interface SignupForm {
  loginId: string;
  password: string;
  passwordConfirm: string;
  companyName: string;
  ceoName: string;
  businessNumber: string;
  businessRegistrationNumber: string;
  address: string;
  homepage: string;
  businessType: string;
  phone: string;
}

interface Errors {
  [key: string]: string;
}

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupForm>({
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

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const validate = (): Errors => {
    const errs: Errors = {};
    if (!form.loginId) errs.loginId = "아이디를 입력하세요.";
    if (!form.password) errs.password = "비밀번호를 입력하세요.";
    if (form.password !== form.passwordConfirm)
      errs.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    if (!form.companyName) errs.companyName = "업체명을 입력하세요.";
    if (!form.businessType) errs.businessType = "업체 유형을 선택하세요.";
    if (!form.ceoName) errs.ceoName = "대표자 이름을 입력하세요.";
    if (!form.businessNumber)
      errs.businessNumber = "사업자등록번호를 입력하세요.";
    if (!form.phone) errs.phone = "연락처를 입력하세요.";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await authApi.signup({ ...form, phone: form.phone.replace(/-/g, "") });
      navigate("/login");
    } catch {
      setErrors({ global: "회원가입에 실패했습니다." });
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-page-header">
        <p className="signup-breadcrumb">회원 관리</p>
        <div className="signup-title-row">
          <button
            className="signup-back-btn"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
          >
            ←
          </button>
          <h2 className="signup-page-title">회원가입</h2>
        </div>
        <p className="signup-page-desc">
          업체 계정 생성을 위해 로그인 정보와 업체 정보를 입력하세요.
        </p>
      </div>

      <div className="signup-section-card">
        <div className="signup-section-header">
          <span className="signup-section-icon">🔒</span>
          <div>
            <h3 className="signup-section-title">로그인 정보</h3>
            <p className="signup-section-desc">
              서비스 이용에 필요한 계정 정보를 입력하세요.
            </p>
          </div>
        </div>

        <div className="signup-field-grid">
          <SignupField
            label="로그인 ID"
            icon="🙍"
            required
            error={errors.loginId}
          >
            <input
              className={`signup-input${errors.loginId ? " signup-input--error" : ""}`}
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
            />
          </SignupField>

          <SignupField
            label="비밀번호"
            icon="🔒"
            required
            error={errors.password}
          >
            <input
              className={`signup-input${errors.password ? " signup-input--error" : ""}`}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
            />
          </SignupField>
        </div>

        <div className="signup-field-grid signup-field-grid--half">
          <SignupField
            label="비밀번호 확인"
            icon="🔒"
            required
            error={errors.passwordConfirm}
          >
            <input
              className={`signup-input${errors.passwordConfirm ? " signup-input--error" : ""}`}
              name="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </SignupField>
        </div>
      </div>

      <div className="signup-section-card">
        <div className="signup-section-header">
          <span className="signup-section-icon">🏢</span>
          <div>
            <h3 className="signup-section-title">업체 정보</h3>
            <p className="signup-section-desc">
              등록할 업체의 기본 정보를 입력하세요.
            </p>
          </div>
        </div>

        <div className="signup-field-grid">
          <SignupField
            label="업체 유형"
            icon="🏢"
            required
            error={errors.businessType}
          >
            <select
              className={`signup-input signup-select${errors.businessType ? " signup-input--error" : ""}`}
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
            >
              <option value="">업체 유형을 선택하세요</option>
              <option value="건설사">건설사</option>
              <option value="시공사">시공사</option>
              <option value="자재사">자재사</option>
              <option value="기타">기타</option>
            </select>
          </SignupField>

          <SignupField
            label="업체명"
            icon="🏢"
            required
            error={errors.companyName}
          >
            <input
              className={`signup-input${errors.companyName ? " signup-input--error" : ""}`}
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="업체명을 입력하세요"
            />
          </SignupField>
        </div>

        <div className="signup-field-grid">
          <SignupField
            label="대표자 이름"
            icon="🙍"
            required
            error={errors.ceoName}
          >
            <input
              className={`signup-input${errors.ceoName ? " signup-input--error" : ""}`}
              name="ceoName"
              value={form.ceoName}
              onChange={handleChange}
              placeholder="대표자 이름을 입력하세요"
            />
          </SignupField>

          <SignupField
            label="사업자등록번호"
            icon="#"
            required
            error={errors.businessNumber}
          >
            <input
              className={`signup-input${errors.businessNumber ? " signup-input--error" : ""}`}
              name="businessNumber"
              value={form.businessNumber}
              onChange={handleChange}
              placeholder="예) 123-45-67891"
            />
          </SignupField>
        </div>

        <div className="signup-field-grid">
          <SignupField label="연락처" icon="📞" required error={errors.phone}>
            <input
              className={`signup-input${errors.phone ? " signup-input--error" : ""}`}
              name="phone"
              value={form.phone}
              onChange={handlePhoneChange}
              placeholder="예) 010-1234-5678"
            />
          </SignupField>

          <SignupField label="홈페이지 URL" icon="🌐">
            <input
              className="signup-input"
              name="homepage"
              value={form.homepage}
              onChange={handleChange}
              placeholder="예) https://www.company.com"
            />
          </SignupField>
        </div>

        <div className="signup-field-grid">
          <SignupField label="상업 등록번호" icon="#">
            <input
              className="signup-input"
              name="businessRegistrationNumber"
              value={form.businessRegistrationNumber}
              onChange={handleChange}
              placeholder="상업 등록번호를 입력하세요"
            />
          </SignupField>

          <SignupField label="업체 주소" icon="📍">
            <input
              className="signup-input"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="업체 주소를 입력하세요"
            />
          </SignupField>
        </div>

        {errors.global && (
          <p className="signup-error-global">{errors.global}</p>
        )}

        <div className="signup-btn-row">
          <button
            className="signup-btn signup-btn--ghost"
            onClick={() => navigate("/login")}
          >
            취소
          </button>
          <button
            className="signup-btn signup-btn--primary"
            onClick={handleSubmit}
          >
            가입 완료
          </button>
        </div>
      </div>
    </div>
  );
}

interface SignupFieldProps {
  label: string;
  icon?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function SignupField({
  label,
  icon,
  required,
  error,
  children,
}: SignupFieldProps) {
  return (
    <div className="signup-field">
      <label className="signup-label">
        {icon && <span className="signup-label-icon">{icon}</span>}
        {label}
        {required && <span className="signup-required">*</span>}
      </label>
      {children}
      {error && <p className="signup-error">{error}</p>}
    </div>
  );
}
