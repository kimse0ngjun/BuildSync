import { orderListApi } from "../../../api/OrderApi";

export const OrderModalDetailForSupplier = ({
  selectedOrder,
  onClose,
}: {
  selectedOrder: any;
  onClose: () => void;
}) => {
  const items = selectedOrder.orderItems || [];

  const totalAmountSum = items.reduce(
    (sum: number, item: any) => sum + (item.amount || 0),
    0,
  );

  const handleAcceptOrder = async () => {
    if (!window.confirm("이 발주 요청을 접수하시겠습니까?")) {
      return;
    }

    try {
      await orderListApi.updateOrderStatus(selectedOrder.orderId, "ACCEPTED");
      alert("발주가 접수되었습니다.");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("접수 처리 중 오류가 발생했습니다.");
    }
  };

  const handleRejectOrder = async () => {
    if (!window.confirm("이 발주 요청을 거절하시겠습니까?")) return;

    try {
      await orderListApi.updateOrderStatus(selectedOrder.orderId, "CANCELED");
      alert("발주가 거절되었습니다.");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("거절 처리 중 오류가 발생했습니다.");
    }
  };

  const isRejected =
    selectedOrder.status === "CANCELED" || selectedOrder.status === "REJECTED";
  const isAccepted = selectedOrder.status === "ACCEPTED";

  return (
    <div className="order-detail-view supplier">
      <div className="order-info top">
        <label className="order-num-label">발주 번호</label>
        <input
          value={String(selectedOrder.orderId).padStart(2, "0")}
          className="order-num-input"
          readOnly
        />

        <label className="order-req-name-label">주문자</label>
        <input
          value={selectedOrder.contactName}
          className="order-req-name-input"
          readOnly
        />

        <label className="order-num-label">건설사</label>
        <input
          value={selectedOrder.companyName}
          className="company-name-input"
          readOnly
        />

        <label className="order-num-label">이메일</label>
        <input
          value={selectedOrder.email || "미등록"}
          className="company-name-input"
          readOnly
        />

        <label className="order-num-label">전화번호</label>
        <input
          value={selectedOrder.phone || "미등록"}
          className="company-name-input"
          readOnly
        />
      </div>
      <hr />

      <div className="order-info middle">
        <label className="status-label">상태</label>
        <input value={selectedOrder.status} className="status-input" readOnly />

        <label className="address-label">주소</label>
        <input
          value={selectedOrder.address || "본사 주소 대체"}
          className="address-label"
          readOnly
        />
      </div>

      <div className="order-info botton">
        <label className="total-label">합계</label>
        <input
          value={`${totalAmountSum.toLocaleString()}원`}
          className="total-input"
          readOnly
        />

        <label className="memo-label">기타(메모)</label>
        <div>
          <textarea
            className="memo-input"
            value={selectedOrder.memo || "전달된 특이사항이 없습니다."}
            readOnly
            placeholder="추가 전달 사항을 적어주세요."
          />
        </div>
      </div>

      <div className="btn-area">
        <button
          onClick={handleAcceptOrder}
          type="button"
          className="btn-accept"
          disabled={isAccepted || isRejected}
        >
          접수
        </button>
        <button
          onClick={handleRejectOrder}
          type="button"
          className="btn-reject"
          disabled={isRejected}
        >
          거절
        </button>
      </div>
    </div>
  );
};
