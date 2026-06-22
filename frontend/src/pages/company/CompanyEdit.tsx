import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { getCompany, updateCompany } from "../../api/company";

function CompanyEdit() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const [form, setForm] = useState({
    companyType: "",
    companyName: "",
    ceoName: "",
    businessNumber: "",
    address: "",
    homepageUrl: "",
    phone: "",
    createdAt: "",
  });

  useEffect(() => {
    if (!companyId) return;

    const loadCompany = async () => {
      try {
        const res = await getCompany(Number(companyId));
        const data = res.data;
        setForm({
          companyType: data.companyType,
          companyName: data.companyName,
          ceoName: data.ceoName,
          businessNumber: data.businessNumber ?? "",
          address: data.address,
          homepageUrl: data.homepageUrl ?? "",
          phone: data.phone,
          createdAt: data.createdAt.slice(0, 10),
        });
      } catch (e) {
        console.error("업체 조회 실패", e);
      }
    };

    loadCompany();
  }, [companyId]);

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const formatBusinessNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  let formatted = value;
  if (name === "phone") formatted = formatPhone(value);
  if (name === "businessNumber") formatted = formatBusinessNumber(value);

  setForm((prev) => ({ ...prev, [name]: formatted }));
};

  const handleSave = async () => {
    if (!companyId) return;
    try {
      await updateCompany(Number(companyId), form);
      navigate(`/company/${companyId}`);
    } catch (e) {
      console.error("수정 실패", e);
    }
  };

  return (
    <div className="company-edit-page">
      <div className="edit-header">
        <button
          className="edit-back-icon"
          onClick={() => navigate(`/company/${companyId}`)}
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

            <span>
              {form.companyType === "SUPPLIER"
                ? "공급업체"
                : "건설업체"}
            </span>
          </div>

          <p>
            {form.address || "주소가 입력됩니다."}
          </p>
        </div>
      </section>

      <div className="edit-grid">
        <section className="edit-section">
          <div className="edit-section-title">
            <FiBriefcase />
            <h3>업체 기본 정보</h3>
          </div>

          <div className="edit-form-list">
            <FormField
              icon={<FiTag />}
              label="업체 유형"
              required
            >
              <select
                name="companyType"
                value={form.companyType}
                onChange={handleChange}
              >
                <option value="CONSTRUCTION">
                  건설업체
                </option>

                <option value="SUPPLIER">
                  공급업체
                </option>
              </select>
            </FormField>

            <FormField
              icon={<FiBriefcase />}
              label="업체명"
              required
            >
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
              />
            </FormField>

            <FormField
              icon={<FiUser />}
              label="대표자 이름"
              required
            >
              <input
                name="ceoName"
                value={form.ceoName}
                onChange={handleChange}
              />
            </FormField>

            <FormField
              icon={<FiHash />}
              label="사업자등록번호"
              required
            >
              <input
                name="businessNumber"
                value={form.businessNumber}
                onChange={handleChange}
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
            <FormField
              icon={<FiPhone />}
              label="연락처"
              required
            >
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </FormField>

            <FormField
              icon={<FiGlobe />}
              label="홈페이지 URL"
            >
              <input
                name="homepageUrl"
                value={form.homepageUrl}
                onChange={handleChange}
              />
            </FormField>

            <FormField
              icon={<FiMapPin />}
              label="주소"
              required
            >
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </FormField>

            <FormField
              icon={<FiHash />}
              label="등록날짜"
            >
              <input
                value={form.createdAt}
                disabled
              />
            </FormField>
          </div>
        </section>
      </div>

      <div className="edit-actions">
        <button
          className="company-cancel-btn"
          onClick={() => navigate(`/company/${companyId}`)}
        >
          취소
        </button>

        <button
          className="save-btn"
          onClick={handleSave}
        >
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

      <div className="edit-form-control">
        {children}
      </div>
    </label>
  );
}

export default CompanyEdit;