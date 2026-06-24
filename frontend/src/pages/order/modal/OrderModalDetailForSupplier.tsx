import { writeOrderApi } from "../../../api/orderApi";
import LoginRequired from "../../../components/LoginRequired";
import NoAccess from "../../../components/NoAccess";
import { STATUS_MAP } from "../../../constants/status";
import { useAuth } from "../../../context/AuthContext";
import type { ForCompanyProps } from "../../../types/Modal";

export const OrderModalDetailForSupplier = ({
  selectedOrder,
  onClose,
}: ForCompanyProps) => {
  const handleStatusUpdate = async (
    targetStatus: "ACCEPTED" | "END" | "CANCELED",
  ) => {
    let confirmMsg = "";
    if (targetStatus === "ACCEPTED")
      confirmMsg = "이 발주 요청을 접수(수락)하시겠습니까?";
    if (targetStatus === "END")
      confirmMsg = "자재 배송을 완료 처리하시겠습니까?";
    if (targetStatus === "CANCELED")
      confirmMsg = "이 발주 요청을 거절(취소)하시겠습니까?";

    if (window.confirm(confirmMsg)) {
      try {
        await writeOrderApi.updateStatusBySupplier(
          selectedOrder.orderId,
          targetStatus,
        );
        alert(`발주서 상태가 성공적으로 변경되었습니다.`);
        onClose();
        window.location.reload();
      } catch (err: any) {
        alert(err.response?.data || "상태 변경 중 오류가 발생했습니다.");
      }
    }
  };

  const isLogin = useAuth();
  const myCompanyType = localStorage.getItem("companyType");

  if (!isLogin) {
    return <LoginRequired />;
  }

  if (myCompanyType !== "SUPPLIER") {
    return <NoAccess targetRoleName="공급업체" />;
  }

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
          <span className="detail-label">요청자(건설사 담당)</span>
          <span className="detail-value">
            {selectedOrder.orderManagerName || "미지정"}
          </span>
        </div>
        <hr className="inner-divider" />

        <div className="detail-row">
          <span className="detail-label">발주 건설사</span>
          <span className="detail-value font-bold">
            {selectedOrder.companyName}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">수신 담당자 (나)</span>
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
          <span className="detail-label">배송 공사현장</span>
          <span className="detail-value font-bold">{displaySiteName}</span>
        </div>

        {displaySiteAddress && (
          <div className="detail-row">
            <span className="detail-label">배송지 주소</span>
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
            <div className="item-empty-text">발주 품목이 없습니다.</div>
          )}
        </div>
        <hr className="inner-divider" />

        <div className="detail-row">
          <span className="detail-label">합계 금액</span>
          <span className="detail-value total-amount-text">
            {selectedOrder.totalAmount.toLocaleString()}원
          </span>
        </div>
        <div className="detail-row align-center">
          <span className="detail-label">현재 상태</span>
          <span className="detail-value">
            <span className={`status-tag ${selectedOrder.status}`}>
              {STATUS_MAP[selectedOrder.status] || selectedOrder.status}
            </span>
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">발주 요청일</span>
          <span className="detail-value">{selectedOrder.orderDate || "-"}</span>
        </div>
        <div className="detail-row flex-col">
          <span className="detail-label">건설사 전달 메모</span>
          <textarea
            className="detail-textarea"
            readOnly
            value={selectedOrder.memo || "내용이 없습니다."}
          />
        </div>
      </div>

      <div className="modal-action-buttons supplier-buttons">
        {selectedOrder.status === "PENDING" && (
          <>
            <button
              className="btn-supplier-accept"
              onClick={() => handleStatusUpdate("ACCEPTED")}
            >
              발주 접수
            </button>
            <button
              className="btn-supplier-reject"
              onClick={() => handleStatusUpdate("CANCELED")}
            >
              거절하기
            </button>
          </>
        )}

        {selectedOrder.status === "ACCEPTED" && (
          <>
            <button
              className="btn-supplier-end"
              onClick={() => handleStatusUpdate("END")}
            >
              배송 완료 (출고)
            </button>
            <button
              className="btn-supplier-reject"
              onClick={() => handleStatusUpdate("CANCELED")}
            >
              접수 취소
            </button>
          </>
        )}

        {(selectedOrder.status === "END" ||
          selectedOrder.status === "CANCELED") && (
          <button className="btn-supplier-close" onClick={onClose}>
            확인 (닫기)
          </button>
        )}
      </div>
    </div>
  );
};
