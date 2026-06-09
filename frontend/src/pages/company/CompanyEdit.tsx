import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiBriefcase,
  FiUser,
  FiHash,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiTag,
  FiSave,
} from "react-icons/fi";
import "../../styles/CompanyEdit.css";

const initialCompany = {
  id: 1,
  type: "공급업체",
  companyName: "대한건설자재",
  ceoName: "김철수",
  businessNumber: "123-45-67891",
  address: "부산광역시 부산진구 중앙대로 708, 5층",
  homepageUrl: "https://www.daehan.com",
  phone: "010-1234-5678",
  createdAt: "2026-06-05",
};

function CompanyEdit() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialCompany);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="company-edit-page">
      <div className="edit-header">
        <button
          className="edit-back-icon"
          onClick={() => navigate("/company/1")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <p className="edit-page-label">업체 관리</p>
          <h1>업체 정보 수정</h1>
          <p className="edit-page-desc">
            등록된 업체의 기본 정보와 연락 정보를 수정합니다.
          </p>
        </div>
      </div>

      <section className="edit-summary">
        <div className="edit-summary-icon">
          <FiBriefcase />
        </div>

        <div>
          <div className="edit-summary-title">
            <h2>{form.companyName || "업체명"}</h2>
            <span>{form.type}</span>
          </div>
          <p>{form.address || "주소가 입력됩니다."}</p>
        </div>
      </section>

      <div className="edit-grid">
        <section className="edit-section">
          <div className="edit-section-title">
            <FiBriefcase />
            <h3>업체 기본 정보</h3>
          </div>

          <div className="edit-form-list">
            <FormField icon={<FiTag />} label="업체 유형" required>
              <select name="type" value={form.type} onChange={handleChange}>
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
                placeholder="사업자등록번호를 입력하세요"
              />
            </FormField>
          </div>
        </section>

        <section className="edit-section">
          <div className="edit-section-title">
            <FiPhone />
            <h3>연락 및 주소 정보</h3>
          </div>

          <div className="edit-form-list">
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

            <FormField icon={<FiMapPin />} label="주소" required>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="주소를 입력하세요"
              />
            </FormField>

            <FormField icon={<FiHash />} label="등록날짜">
              <input value={form.createdAt} disabled />
            </FormField>
          </div>
        </section>
      </div>

      <div className="edit-actions">
        <button
          className="company-cancel-btn"
          onClick={() => navigate("/company/1")}
        >
          취소
        </button>

        <button className="save-btn" onClick={() => navigate("/company/1")}>
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
  children,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="edit-form-row">
      <div className="edit-form-label">
        {icon}
        <span>
          {label}
          {required && <em>*</em>}
        </span>
      </div>

      <div className="edit-form-control">{children}</div>
    </label>
  );
}

export default CompanyEdit;
