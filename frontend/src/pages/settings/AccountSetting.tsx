import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";
import {
  FiUser,
  FiPhone,
  FiBriefcase,
  FiEdit3,
  FiSave,
  FiGlobe,
  FiMapPin,
  FiHash,
  FiCalendar,
  FiLock,
} from "react-icons/fi";
import "../../styles/AccountSetting.css";

function AccountSetting() {
  const { isLogin } = useAuth();
  const [form, setForm] = useState({
    loginId: "supplier01",
    companyType: "건설업체",
    companyName: "대한건설",
    ceoName: "김철수",
    businessNumber: "123-45-67891",
    phone: "010-1234-5678",
    homepageUrl: "https://www.daehan.com",
    address: "부산광역시 부산진구 중앙대로 708, 5층",
    registeredDate: "2026-06-11",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("계정 설정 수정 데이터:", form);
    alert("계정 정보가 저장되었습니다.");
  };

  if (!isLogin) {
    return <LoginRequired />;
  }

  return (
    <div className="account-setting-page">
      <div className="account-setting-header">
        <p className="account-setting-label">설정</p>
        <h1>계정 설정</h1>
        <p className="account-setting-desc">
          회원가입 시 등록한 업체 정보를 확인하고 수정합니다.
        </p>
      </div>

      <section className="account-profile-summary">
        <div className="account-avatar">
          <FiBriefcase />
        </div>

        <div>
          <div className="account-profile-title">
            <h2>{form.companyName}</h2>
            <span>{form.companyType}</span>
          </div>
          <p>{form.address}</p>
        </div>
      </section>

      <section className="account-setting-section">
        <div className="account-section-title">
          <FiEdit3 />
          <div>
            <h2>업체 정보 수정</h2>
            <p>
              업체명, 대표자, 연락처, 주소, 홈페이지 정보를 수정할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="account-form-grid">
          <FormField icon={<FiLock />} label="로그인 ID">
            <input value={form.loginId} readOnly />
          </FormField>

          <FormField icon={<FiBriefcase />} label="업체 유형" required>
            <select
              name="companyType"
              value={form.companyType}
              onChange={handleChange}
              className="account-select"
            >
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
            <input value={form.businessNumber} readOnly />
          </FormField>

          <FormField icon={<FiPhone />} label="연락처" required>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="연락처를 입력하세요"
            />
          </FormField>

          <FormField icon={<FiGlobe />} label="홈페이지 URL">
            <input
              name="homepageUrl"
              value={form.homepageUrl}
              onChange={handleChange}
              placeholder="홈페이지 URL을 입력하세요"
            />
          </FormField>

          <FormField icon={<FiCalendar />} label="등록날짜">
            <input value={form.registeredDate} readOnly />
          </FormField>

          <FormField icon={<FiMapPin />} label="주소" required full>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="업체 주소를 입력하세요"
            />
          </FormField>
        </div>
      </section>

      <div className="account-actions">
        <button className="account-cancel-btn">취소</button>
        <button className="account-save-btn" onClick={handleSave}>
          <FiSave />
          저장하기
        </button>
      </div>
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
    <label className={full ? "account-form-field full" : "account-form-field"}>
      <span>
        {icon}
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

export default AccountSetting;
