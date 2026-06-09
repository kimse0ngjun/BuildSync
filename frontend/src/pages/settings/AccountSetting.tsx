import { useState } from "react";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiBriefcase,
  FiAward,
  FiEdit3,
  FiSave,
} from "react-icons/fi";
import "../../styles/AccountSetting.css";

function AccountSetting() {
  const [form, setForm] = useState({
    companyName: "대한건설",
    companyType: "건설업체",
    contactName: "김철수",
    department: "구매팀",
    position: "팀장",
    phone: "010-1234-5678",
    email: "kim@buildsync.com",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="account-setting-page">
      <div className="account-setting-header">
        <div>
          <p className="account-setting-label">설정</p>
          <h1>계정 설정</h1>
          <p className="account-setting-desc">
            로그인한 담당자의 기본 정보를 확인하고 수정합니다.
          </p>
        </div>
      </div>

      <section className="account-profile-summary">
        <div className="account-avatar">
          <FiUser />
        </div>

        <div>
          <div className="account-profile-title">
            <h2>{form.contactName}</h2>
            <span>{form.position}</span>
          </div>
          <p>
            {form.companyName} · {form.department}
          </p>
        </div>
      </section>

      <section className="account-setting-section">
        <div className="account-section-title">
          <FiEdit3 />
          <div>
            <h2>내 정보 수정</h2>
            <p>담당자 이름, 부서, 직급, 연락처, 이메일을 수정할 수 있습니다.</p>
          </div>
        </div>

        <div className="account-form-grid">
          <FormField icon={<FiBriefcase />} label="업체명">
            <input value={form.companyName} readOnly />
          </FormField>

          <FormField icon={<FiBriefcase />} label="업체 유형">
            <input value={form.companyType} readOnly />
          </FormField>

          <FormField icon={<FiUser />} label="담당자 이름" required>
            <input
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              placeholder="담당자 이름을 입력하세요"
            />
          </FormField>

          <FormField icon={<FiBriefcase />} label="부서" required>
            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="부서를 입력하세요"
            />
          </FormField>

          <FormField icon={<FiAward />} label="직급" required>
            <input
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="직급을 입력하세요"
            />
          </FormField>

          <FormField icon={<FiPhone />} label="연락처" required>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="연락처를 입력하세요"
            />
          </FormField>

          <FormField icon={<FiMail />} label="이메일" required full>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
            />
          </FormField>
        </div>
      </section>

      <div className="account-actions">
        <button className="account-cancel-btn">취소</button>
        <button className="account-save-btn">
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
