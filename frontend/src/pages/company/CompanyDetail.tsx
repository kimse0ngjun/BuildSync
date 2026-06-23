import { useNavigate, useParams } from "react-router-dom";
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
import { useEffect, useState } from "react";
import "../../styles/CompanyDetail.css";
import { deleteCompany, getCompany } from "../../api/company";
import type { CompanyDetail as CompanyDetailType } from "../../types/company";

function CompanyDetail() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const [company, setCompany] = useState<CompanyDetailType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!companyId) return;

    const loadCompany = async () => {
      try {
        const res = await getCompany(Number(companyId));
        console.log("상세 응답:", res.data);
        setCompany(res.data);
      } catch (e) {
        console.error("상세 조회 실패", e);
      }
    };

    loadCompany();
  }, [companyId]);

  const handleDelete = async () => {
    try {
      await deleteCompany(Number(companyId));
      navigate("/company");
    } catch (e) {
      console.error("삭제 실패", e);
    }
  };

  if (!company) {
    return <div>불러오는 중...</div>;
  }

  const typeName = company.companyType === "SUPPLIER" ? "공급업체" : "건설업체";

  return (
    <div className="company-detail-page">
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">
              <FiTrash2 />
            </div>
            <h3>업체를 삭제하시겠습니까?</h3>
            <p>
              삭제된 업체 정보는 복구할 수 없습니다.
              <br />
              정말 삭제하시겠습니까?
            </p>
            <div className="delete-modal-actions">
              <button
                className="modal-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button className="modal-delete-btn" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="detail-header">
        <div>
          <p className="detail-label">업체 관리</p>
          <h1>업체 상세</h1>
          <p className="detail-desc">등록된 업체 정보를 확인합니다.</p>
        </div>
      </div>

      <section className="company-detail-summary">
        <div className="summary-icon">
          <FiBriefcase />
        </div>

        <div>
          <div className="summary-title">
            <h2>{company.companyName}</h2>
            <span className="type-badge">{typeName}</span>
          </div>

          <p>{company.address}</p>
        </div>
      </section>

      <div className="detail-grid">
        <DetailSection title="업체 기본 정보">
          <InfoRow icon={<FiTag />} label="업체 유형" value={typeName} />

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
            label="사업자번호"
            value={company.businessNumber ?? "-"}
          />
        </DetailSection>

        <DetailSection title="연락 및 주소 정보">
          <InfoRow icon={<FiPhone />} label="연락처" value={company.phone} />

          <InfoRow
            icon={<FiGlobe />}
            label="홈페이지"
            value={company.homepageUrl ?? "-"}
          />

          <InfoRow icon={<FiMapPin />} label="주소" value={company.address} />

          <InfoRow
            icon={<FiCalendar />}
            label="등록일"
            value={company.createdAt?.slice(0, 10) ?? "-"}
          />
        </DetailSection>
      </div>

      <div className="bottom-actions">
        <button className="back-btn" onClick={() => navigate("/company")}>
          <FiArrowLeft />
          목록
        </button>

        <button
          className="edit-btn"
          onClick={() => navigate(`/company/${companyId}/edit`)}
        >
          <FiEdit3 />
          수정
        </button>

        <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>
          <FiTrash2 />
          삭제
        </button>
      </div>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="detail-section">
      <div className="detail-section-title">
        <FiBriefcase />
        <h3>{title}</h3>
      </div>

      <div className="info-list">{children}</div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="info-row">
      <div className="info-label">
        {icon}
        <span>{label}</span>
      </div>

      <div className="info-value">{value ?? "-"}</div>
    </div>
  );
}

export default CompanyDetail;
