import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit3,
  FiTrash2,
  FiBriefcase,
  FiUser,
  FiHash,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiCalendar,
  FiTag,
} from "react-icons/fi";
import "../../styles/CompanyDetail.css";

const company = {
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

function CompanyDetail() {
  const navigate = useNavigate();

  return (
    <div className="company-detail-page">
      <div className="detail-header">
        <div>
          <p className="detail-label">업체 관리</p>
          <h1>업체 상세</h1>
          <p className="detail-desc">
            등록된 업체의 기본 정보와 연락 정보를 확인합니다.
          </p>
        </div>
      </div>

      <section className="company-detail-summary">
        <div className="summary-icon">
          <FiBriefcase />
        </div>

        <div>
          <div className="summary-title">
            <h2>{company.companyName}</h2>
            <span className="type-badge">{company.type}</span>
          </div>
          <p>{company.address}</p>
        </div>
      </section>

      <div className="detail-grid">
        <section className="detail-section">
          <div className="section-title">
            <FiBriefcase />
            <h3>업체 기본 정보</h3>
          </div>

          <div className="info-list">
            <InfoRow icon={<FiTag />} label="업체 유형" value={company.type} />
            <InfoRow
              icon={<FiBriefcase />}
              label="업체명"
              value={company.companyName}
            />
            <InfoRow
              icon={<FiUser />}
              label="대표자 이름"
              value={company.ceoName}
            />
            <InfoRow
              icon={<FiHash />}
              label="사업자등록번호"
              value={company.businessNumber}
            />
          </div>
        </section>

        <section className="detail-section">
          <div className="section-title">
            <FiPhone />
            <h3>연락 및 주소 정보</h3>
          </div>

          <div className="info-list">
            <InfoRow icon={<FiPhone />} label="연락처" value={company.phone} />
            <InfoRow
              icon={<FiGlobe />}
              label="홈페이지 URL"
              value={company.homepageUrl}
            />
            <InfoRow icon={<FiMapPin />} label="주소" value={company.address} />
            <InfoRow
              icon={<FiCalendar />}
              label="등록날짜"
              value={company.createdAt}
            />
          </div>
        </section>
      </div>

      <div className="bottom-actions">
        <button className="back-btn" onClick={() => navigate("/company")}>
          <FiArrowLeft />
          목록으로
        </button>

        <button className="edit-btn">
          <FiEdit3 />
          수정
        </button>

        <button className="delete-btn">
          <FiTrash2 />
          삭제
        </button>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="info-row">
      <div className="info-label">
        {icon}
        <span>{label}</span>
      </div>
      <div className="info-value">{value}</div>
    </div>
  );
}

export default CompanyDetail;
