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
    createdAt: new Date().toISOString().split("T")[0],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
                <option value="건설업체">건설업체</option>
                <option value="공급업체">공급업체</option>
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
                onChange={handleChange}
                placeholder="예) 010-1234-5678"
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

        <div className="join-actions">
          <button
            type="button"
            className="join-cancel-btn"
            onClick={() => navigate("/login")}
          >
            취소
          </button>

          <button type="button" className="join-submit-btn">
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
