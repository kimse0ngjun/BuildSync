import { writeOrderApi } from "../../../api/orderApi";
import type { ForCompanyProps } from "../../../types/Modal";
import { STATUS_MAP } from "../../../constants/status";
import { useNavigate } from "react-router-dom";
import "../../../styles/OrderModalDetail.css";
import NoAccess from "../../../components/NoAccess";
import { useAuth } from "../../../context/AuthContext";
import LoginRequired from "../../../components/LoginRequired";

// 건설업체 발주 상세 화면
export const OrderModalDetailForConstruct = ({
  selectedOrder,
  onClose,
}: ForCompanyProps) => {
  const nav = useNavigate();
  const isLogin = useAuth();
  const myCompanyType = localStorage.getItem("companyType");

  if (!isLogin) {
    return <LoginRequired />;
  }

  if (myCompanyType !== "CONSTRUCTION") {
    return <NoAccess targetRoleName="건설업체" />;
  }

  // 수정
  const handleEditClick = () => {
    onClose();
    nav(`/order/edit/${selectedOrder.orderId}`, {
      state: {
        orderData: selectedOrder,
      },
    });
  };

  // 취소
  const handleCancelOrder = async () => {
    if (
      window.confirm(
        `발주 번호 #${selectedOrder.orderId} 건을 정말 취소하시겠습니까?`,
      )
    ) {
      try {
        await writeOrderApi.cancelOrderByConstruction(selectedOrder.orderId);
        alert("발주서가 성공적으로 취소되었습니다.");
        onClose();
        window.location.reload();
      } catch (err: any) {
        alert(err.response?.data || "취소 처리 중 오류가 발생했습니다.");
      }
    }
  };

  const siteData = selectedOrder.siteName
    ? selectedOrder.siteName.split("|")
    : [];
  const displaySiteName = siteData[0] || "미지정";
  const displaySiteAddress = siteData[1] || "";

  return (
    <div className="order-modal-detail-container">
      <div className="detail-info-section">
        <div className="detail-row">
          <span className="detail-label">발주 번호</span>
          <span className="detail-value font-bold">
            {selectedOrder.orderId}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">요청자</span>
          <span className="detail-value">
            {selectedOrder.orderManagerName || "미지정"}
          </span>
        </div>
        <hr className="inner-divider" />

        <div className="detail-row">
          <span className="detail-label">거래처</span>
          <span className="detail-value font-bold">
            {selectedOrder.companyName}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">담당자</span>
          <span className="detail-value">
            {selectedOrder.contactName || "-"}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">담당자 이메일</span>
          <span className="detail-value">
            {selectedOrder.contactEmail || "-"}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">담당자 전화번호</span>
          <span className="detail-value">
            {selectedOrder.contactPhone || "-"}
          </span>
        </div>
        <hr className="inner-divider" />

        <div className="detail-row">
          <span className="detail-label">공사 현장</span>
          <span className="detail-value font-bold">{displaySiteName}</span>
        </div>

        {displaySiteAddress && (
          <div className="detail-row">
            <span className="detail-label">현장 주소</span>
            <span className="detail-value">{displaySiteAddress}</span>
          </div>
        )}
        <hr className="inner-divider" />

        <div className="detail-label-title">발주 품목 목록</div>
        <div className="material-items-scroll-area">
          {selectedOrder.items && selectedOrder.items.length > 0 ? (
            selectedOrder.items.map((item, idx) => (
              <div className="material-item-box" key={item.materialId || idx}>
                <div className="detail-row">
                  <span className="item-inner-label">품목명</span>
                  <span className="detail-value font-bold">
                    {item.materialName}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="item-inner-label">수량</span>
                  <span className="detail-value">
                    {item.quantity.toLocaleString()} {item.unit || "kg"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="item-inner-label">단가</span>
                  <span className="detail-value">
                    {item.unitPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="item-empty-text">선택된 발주 품목이 없습니다.</div>
          )}
        </div>

        <hr className="inner-divider" />
        <div className="detail-row">
          <span className="detail-label">합계</span>
          <span className="detail-value total-amount-text">
            {selectedOrder.totalAmount.toLocaleString()}원
          </span>
        </div>
        <div className="detail-row align-center">
          <span className="detail-label">상태</span>
          <span className="detail-value">
            <span className={`status-tag ${selectedOrder.status}`}>
              {STATUS_MAP[selectedOrder.status] || selectedOrder.status}
            </span>
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">발주일</span>
          <span className="detail-value">{selectedOrder.orderDate || "-"}</span>
        </div>
        <div className="detail-row flex-col">
          <span className="detail-label">기타</span>
          <textarea
            className="detail-textarea"
            readOnly
            value={selectedOrder.memo || "내용이 없습니다."}
          />
        </div>
      </div>

      <div className="modal-action-buttons">
        <button
          className="btn-modify"
          disabled={selectedOrder.status !== "PENDING"}
          onClick={handleEditClick}
        >
          수정하기
        </button>
        <button
          className="btn-cancel"
          onClick={handleCancelOrder}
          disabled={selectedOrder.status !== "PENDING"}
        >
          취소하기
        </button>
      </div>
    </div>
  );
};
