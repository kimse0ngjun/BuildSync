import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";
import {
  FiLock,
  FiShield,
  FiUser,
  FiCalendar,
  FiAlertTriangle,
  FiTrash2,
  FiSave,
} from "react-icons/fi";
import "../../styles/SecuritySetting.css";

function SecuritySetting() {
  const { isLogin } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordCheck: "",
    deletePassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (!isLogin) {
    return <LoginRequired />;
  }

  return (
    <div className="security-setting-page">
      <div className="security-setting-header">
        <p className="security-setting-label">설정</p>
        <h1>보안 설정</h1>
        <p className="security-setting-desc">
          비밀번호 변경과 계정 보안 정보를 관리합니다.
        </p>
      </div>

      <section className="security-section">
        <div className="security-section-title">
          <FiShield />
          <div>
            <h2>계정 보안</h2>
            <p>현재 비밀번호 확인 후 새 비밀번호로 변경할 수 있습니다.</p>
          </div>
        </div>

        <div className="security-form-grid">
          <FormField icon={<FiLock />} label="현재 비밀번호" required>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="현재 비밀번호를 입력하세요"
            />
          </FormField>

          <FormField icon={<FiLock />} label="새 비밀번호" required>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="새 비밀번호를 입력하세요"
            />
          </FormField>

          <FormField icon={<FiLock />} label="새 비밀번호 확인" required full>
            <input
              type="password"
              name="newPasswordCheck"
              value={form.newPasswordCheck}
              onChange={handleChange}
              placeholder="새 비밀번호를 다시 입력하세요"
            />
          </FormField>
        </div>

        <div className="security-inner-actions">
          <button className="security-save-btn">
            <FiSave />
            비밀번호 변경
          </button>
        </div>
      </section>

      <section className="security-section">
        <div className="security-section-title">
          <FiUser />
          <div>
            <h2>로그인 정보</h2>
            <p>계정의 로그인 ID와 가입 정보를 확인합니다.</p>
          </div>
        </div>

        <div className="security-info-list">
          <InfoRow icon={<FiUser />} label="로그인 ID" value="supplier01" />
          <InfoRow icon={<FiCalendar />} label="가입일" value="2026-06-05" />
          <InfoRow
            icon={<FiCalendar />}
            label="최근 로그인"
            value="2026-06-24 13:40"
          />
        </div>
      </section>

      <section className="security-section danger-section">
        <div className="security-section-title danger-title">
          <FiAlertTriangle />
          <div>
            <h2>회원 탈퇴</h2>
            <p>탈퇴 시 계정이 비활성화되며 서비스 이용이 제한됩니다.</p>
          </div>
        </div>

        <div className="danger-box">
          <div>
            <strong>회원 탈퇴 전 확인해주세요.</strong>
            <p>
              발주 내역, 자재 정보, 업체 정보는 데이터 보존을 위해 즉시 삭제되지
              않고 계정만 비활성화됩니다.
            </p>
          </div>
        </div>

        <div className="delete-confirm">
          <FormField icon={<FiLock />} label="비밀번호 확인" required>
            <input
              type="password"
              name="deletePassword"
              value={form.deletePassword}
              onChange={handleChange}
              placeholder="탈퇴 확인을 위해 비밀번호를 입력하세요"
            />
          </FormField>

          <button className="delete-account-btn">
            <FiTrash2 />
            회원 탈퇴
          </button>
        </div>
      </section>
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
    <label
      className={full ? "security-form-field full" : "security-form-field"}
    >
      <span>
        {icon}
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="security-info-row">
      <div>
        {icon}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
    </div>
  );
}

export default SecuritySetting;
