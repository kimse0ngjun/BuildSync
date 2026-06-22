import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiLock,
  FiBriefcase,
  FiHash,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiCalendar,
} from "react-icons/fi";
import authApi from "../../api/authApi";
import "../../styles/JoinPage.css";

function JoinPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyType: "",
    loginId: "",
    password: "",
    passwordCheck: "",
    companyName: "",
    ceoName: "",
    businessNumber: "",
    address: "",
    homepageUrl: "",
    phone: "",
    email: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/[^0-9]/g, "");

    let formatted = number;
    if (number.length > 3 && number.length <= 7) {
      formatted = `${number.slice(0, 3)}-${number.slice(3)}`;
    } else if (number.length > 7) {
      formatted = `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(
        7,
        11,
      )}`;
    }

    setForm((prev) => ({ ...prev, phone: formatted }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.loginId) return setError("아이디를 입력하세요.");
    if (!form.password) return setError("비밀번호를 입력하세요.");
    if (form.password !== form.passwordCheck) {
      return setError("비밀번호가 일치하지 않습니다.");
    }
    if (!form.companyType) return setError("업체 유형을 선택하세요.");
    if (!form.companyName) return setError("업체명을 입력하세요.");
    if (!form.ceoName) return setError("대표자 이름을 입력하세요.");
    if (!form.businessNumber) return setError("사업자등록번호를 입력하세요.");
    if (!form.phone) return setError("연락처를 입력하세요.");
    if (!form.address) return setError("주소를 입력하세요.");
    if (!form.email) return setError("이메일을 입력하세요.");

    try {
      await authApi.signup({
        ...form,
        phone: form.phone.replace(/-/g, ""),
      });

      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch {
      setError("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="join-page">
      <div className="join-header">
        <button className="join-back-btn" onClick={() => navigate("/login")}>
          <FiArrowLeft />
        </button>

        <div>
          <p className="join-page-label">회원 관리</p>
          <h1>회원가입</h1>
          <p className="join-page-desc">
            업체 계정 생성을 위해 로그인 정보와 업체 정보를 입력하세요.
          </p>
        </div>
      </div>

      <form className="join-form">
        <section className="join-section">
          <div className="join-section-title">
            <FiLock />
            <div>
              <h2>로그인 정보</h2>
              <p>서비스 이용에 필요한 계정 정보를 입력하세요.</p>
            </div>
          </div>

          <div className="join-form-grid">
            <FormField icon={<FiUser />} label="로그인 ID" required>
              <input
                name="loginId"
                value={form.loginId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
              />
            </FormField>

            <FormField icon={<FiLock />} label="비밀번호" required>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
              />
            </FormField>

            <FormField icon={<FiLock />} label="비밀번호 확인" required>
              <input
                type="password"
                name="passwordCheck"
                value={form.passwordCheck}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
              />
            </FormField>
          </div>
        </section>

        <section className="join-section">
          <div className="join-section-title">
            <FiBriefcase />
            <div>
              <h2>업체 정보</h2>
              <p>등록할 업체의 기본 정보를 입력하세요.</p>
            </div>
          </div>

          <div className="join-form-grid">
            <FormField icon={<FiBriefcase />} label="업체 유형" required>
              <select
                name="companyType"
                value={form.companyType}
                onChange={handleChange}
              >
                <option value="">업체 유형을 선택하세요</option>
                <option value="CONSTRUCTION">건설업체</option>
                <option value="SUPPLIER">공급업체</option>
              </select>
            </FormField>

            <FormField icon={<FiBriefcase />} label="업체명" required>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="업체명을 입력하세요"
              />
            </FormField>

            <FormField icon={<FiUser />} label="대표자 이름" required>
              <input
                name="ceoName"
                value={form.ceoName}
                onChange={handleChange}
                placeholder="대표자 이름을 입력하세요"
              />
            </FormField>

            <FormField icon={<FiHash />} label="사업자등록번호" required>
              <input
                name="businessNumber"
                value={form.businessNumber}
                onChange={handleChange}
                placeholder="예) 123-45-67891"
              />
            </FormField>

            <FormField icon={<FiPhone />} label="연락처" required>
              <input
                name="phone"
                value={form.phone}
                onChange={handlePhoneChange}
                placeholder="예) 010-1234-5678"
                maxLength={13}
              />
            </FormField>

            <FormField icon={<FiUser />} label="이메일" required>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
              />
            </FormField>

            <FormField icon={<FiGlobe />} label="홈페이지 URL">
              <input
                name="homepageUrl"
                value={form.homepageUrl}
                onChange={handleChange}
                placeholder="예) https://www.company.com"
              />
            </FormField>

            <FormField icon={<FiMapPin />} label="주소" required full>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="업체 주소를 입력하세요"
              />
            </FormField>

            <FormField icon={<FiCalendar />} label="등록날짜">
              <input name="createdAt" value={form.createdAt} readOnly />
            </FormField>
          </div>
        </section>

        {error && <p className="join-error">{error}</p>}

        <div className="join-actions">
          <button
            type="button"
            className="join-cancel-btn"
            onClick={() => navigate("/login")}
          >
            취소
          </button>

          <button
            type="button"
            className="join-submit-btn"
            onClick={handleSubmit}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}

function FormField({
  icon,
  label,
  required,
  full,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={full ? "join-form-field full" : "join-form-field"}>
      <span>
        {icon}
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

export default JoinPage;
