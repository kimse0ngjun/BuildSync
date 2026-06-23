import { useNavigate } from "react-router-dom";
import { FiX, FiInfo, FiEdit3 } from "react-icons/fi";
import BaseModal from "../order/modal/BaseModal";
import "../../styles/StockInOutDetailModal.css";
import type { InOutDetailModalProps } from "../../types/InOut";

export default function StockInOutDetailModal({
  isOpen,
  onClose,
  data,
}: InOutDetailModalProps) {
  const navigate = useNavigate();

  if (!isOpen || !data) return null;

  // 수정 페이지 이동
  const handleGoToEdit = () => {
    onClose();

    navigate(`/stock/edit/${data.stockInoutId}`);
  };

  const modalContent = (
    <div className="stock-detail-modal-body">
      <div className="modal-summary-card">
        <div className="summary-info-item">
          <span className="summary-label">전표 번호</span>
          <strong className="summary-value">#{data.stockInoutId}</strong>
        </div>
        <div className="summary-info-item">
          <span className="summary-label">변동 구분</span>
          <span
            className={`modal-badge ${data.type === "입고" ? "in" : "out"}`}
          >
            {data.type}
          </span>
        </div>
        <div className="summary-info-item">
          <span className="summary-label">처리 일자</span>
          <strong className="summary-value">
            {data.processedDate ? data.processedDate.split("T")[0] : "-"}
          </strong>
        </div>
      </div>

      <div className="modal-meta-grid">
        <div className="meta-row">
          <span className="meta-label">공사 현장</span>
          <span className="meta-value">{data.siteName || "본사재고"}</span>
        </div>
        <div className="meta-row">
          <span className="meta-label">발주 번호</span>
          <span className="meta-value">
            {data.orderId ? `PO-${data.orderId}` : "-"}
          </span>
        </div>
        <div className="meta-row">
          <span className="meta-label">등록 담당자</span>
          <span className="meta-value">{data.contactName || "-"}</span>
        </div>
      </div>

      <div className="modal-material-section">
        <h3 className="section-subtitle">처리 자재 상세 품목</h3>
        <table className="modal-material-table">
          <thead>
            <tr>
              <th>자재명</th>
              <th style={{ textAlign: "right" }}>수량</th>
              <th>단위</th>
            </tr>
          </thead>
          <tbody>
            {data.items && data.items.length > 0 ? (
              data.items.map((item, idx) => (
                <tr key={`${item.materialId}-${idx}`}>
                  <td className="mat-name">{item.materialName}</td>
                  <td className="mat-qty" style={{ textAlign: "right" }}>
                    <strong
                      className={data.type === "입고" ? "qty-in" : "qty-out"}
                    >
                      {data.type === "입고" ? "+" : "-"}
                      {item.quantity.toLocaleString()}
                    </strong>
                  </td>
                  <td className="mat-unit">
                    <span className="unit-badge">{item.unit || "EA"}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="no-mat-msg">
                  등록된 상세 자재 품목 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="modal-memo-section">
        <h3 className="section-subtitle">추가 메모 (비고)</h3>
        <div className="memo-box">
          {data.memo ? data.memo : "등록된 특이사항 또는 메모 내역이 없습니다."}
        </div>
      </div>

      <div className="modal-action-footer">
        <button type="button" className="btn-modal-close" onClick={onClose}>
          닫기
        </button>
        <button
          type="button"
          className="btn-modal-edit"
          onClick={handleGoToEdit}
        >
          <FiEdit3 /> 수정하러 가기
        </button>
      </div>
    </div>
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<FiInfo />}
      title="입출고 이력 상세 조회"
      subtitle="선택된 자재 전표의 원천 확정 데이터를 확인합니다."
      content={modalContent}
      deleteIcon={<FiX onClick={onClose} />}
    />
  );
}
