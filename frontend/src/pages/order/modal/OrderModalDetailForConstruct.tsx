import { useState, useEffect } from "react";
import type { Material, OrderDetailProps } from "../../../types/OrderDTO";
import { orderListApi, writeOrderApi } from "../../../api/OrderApi";

// 건설업체 발주 상세 화면
export const OrderModalDetailForConstruct = ({
  selectedOrder,
  onClose,
}: OrderDetailProps) => {
  if (!selectedOrder) return null;

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [memo, setMemo] = useState<string>("");
  const [orderItems, setOrderItems] = useState<any[]>([]);

  // 수정 모드 품목 변경 시 선택 가능한 거래처 자재 리스트
  const [availableMaterials, setAvailableMaterials] = useState<Material[]>([]);

  useEffect(() => {
    setMemo(selectedOrder.memo || "");
    setOrderItems(selectedOrder.orderItems || []);
  }, [selectedOrder]);

  useEffect(() => {
    if (isEditMode && selectedOrder.companyId) {
      writeOrderApi
        .getOurCompanyMaterial(selectedOrder.companyId)
        .then((data) => setAvailableMaterials(data))
        .catch(console.error);
    }
  }, [isEditMode, selectedOrder.companyId]);

  const totalAmountSum = orderItems.reduce(
    (sum: number, item: any) => sum + (item.amount || 0),
    0,
  );

  const handleMaterialChange = (idx: number, selectedMaterialId: number) => {
    const targetMaterial = availableMaterials.find(
      (m) => m.materialId === selectedMaterialId,
    );
    if (!targetMaterial) return;

    const updatedItems = [...orderItems];
    updatedItems[idx] = {
      ...updatedItems[idx],
      materialId: targetMaterial.materialId,
      materialName: targetMaterial.materialName,
      unitPrice: targetMaterial.unitPrice,
      unit: targetMaterial.unit,
      amount: (updatedItems[idx].quantity || 1) * targetMaterial.unitPrice,
    };
    setOrderItems(updatedItems);
  };

  const handleQuantityChange = (idx: number, newQty: number) => {
    if (newQty < 1) return;

    const updatedItems = [...orderItems];
    updatedItems[idx] = {
      ...updatedItems[idx],
      quantity: newQty,
      amount: newQty * (updatedItems[idx].unitPrice || 0),
    };
    setOrderItems(updatedItems);
  };

  const handleEditToggle = async () => {
    if (selectedOrder.status !== "PENDING") {
      alert("접수 대기(PENDING) 상태의 발주서만 수정할 수 있습니다.");
      return;
    }

    if (isEditMode) {
      if (!window.confirm("변경 사항을 저장하시겠습니까?")) return;

      try {
        const updatePayload = {
          orderId: selectedOrder.orderId,
          memo: memo,
          totalAmount: totalAmountSum,
          orderItems: orderItems.map((item) => ({
            orderItemId: item.orderItemId,
            materialId: item.materialId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
          })),
        };

        await orderListApi.updateOrderDetail(
          selectedOrder.orderId,
          updatePayload,
        );

        setIsEditMode(false);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error("수정 실패:", error);
        alert("수정 처리 중 서버 에러가 발생했습니다.");
      }
      return;
    }

    setIsEditMode(true);
  };

  const handleStockIn = async () => {
    if (
      !window.confirm(
        "창고에 입고 처리하시겠습니까?\n우리 회사 재고 수량에 반영됩니다.",
      )
    )
      return;
    try {
      await orderListApi.updateStockIn(selectedOrder.orderId);
      alert("성공적으로 입고 처리가 완료되었습니다.");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("입고 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("이 발주서를 정말 취소(삭제)하시겠습니까?")) return;
    try {
      await orderListApi.updateOrderStatus(selectedOrder.orderId, "CANCELED");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("취소 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="order-detail-view construction">
      <div className="order-info top">
        <label className="order-num-label">발주 번호</label>
        <input
          value={String(selectedOrder.orderId).padStart(2, "0")}
          className="order-num-input"
          readOnly
        />
        <label className="order-req-name-label">요청자</label>
        <input
          value={selectedOrder.contactName}
          className="order-req-name-input construction"
          readOnly
        />
      </div>
      <hr />

      <div className="order-info middle">
        <label className="order-num-label">거래처</label>
        <input
          value={selectedOrder.companyName}
          className="company-name-input"
          readOnly
        />
        <label className="order-req-name-label">담당자</label>
        <input
          value={selectedOrder.contactName}
          className="order-req-name-input supplier"
          readOnly
        />
        <label className="order-num-label">담당자 이메일</label>
        <input
          value={selectedOrder.email}
          className="contact-email-input"
          readOnly
        />
        <label className="order-req-name-label">담당자 전화번호</label>
        <input
          value={selectedOrder.phone}
          className="contact-phone-input"
          readOnly
        />
      </div>

      <div className="order-info list-container">
        <table className="item-table">
          <thead>
            <tr>
              <th className="material-th">품목(자재)</th>
              <th className="count-th">수량</th>
              <th className="unit-price-th">단가</th>
              <th className="amount-th">금액</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item: any, idx: number) => (
              <tr key={idx}>
                <td>
                  {isEditMode ? (
                    <select
                      value={item.materialId}
                      onChange={(e) =>
                        handleMaterialChange(idx, Number(e.target.value))
                      }
                    >
                      {availableMaterials.map((mat) => (
                        <option key={mat.materialId} value={mat.materialId}>
                          {mat.materialName} ({mat.specification})
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.materialName
                  )}
                </td>

                <td>
                  {isEditMode ? (
                    <div>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(idx, Number(e.target.value))
                        }
                        min={1}
                      />
                      <span>{item.unit || "-"}</span>
                    </div>
                  ) : (
                    `${item.quantity} ${item.unit || "-"}`
                  )}
                </td>
                <td>{item.unitPrice?.toLocaleString()}원</td>
                <td>{item.amount?.toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="order-info botton">
        <label className="total-label">합계</label>
        <input
          value={`${totalAmountSum.toLocaleString()}원`}
          className="total-input"
          readOnly
        />

        <label className="status-label">상태</label>
        <div className="status-wrapper">
          <input
            value={
              selectedOrder.status === "END"
                ? "발주 완료"
                : selectedOrder.status
            }
            className="status-input"
            readOnly
          />

          {selectedOrder.status === "END" && (
            <button
              type="button"
              className="btn-badge-stockin"
              onClick={handleStockIn}
            >
              입고 처리
            </button>
          )}
        </div>

        <label className="memo-label">기타(메모)</label>
        <textarea
          className="memo-input"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          readOnly={!isEditMode}
          placeholder="추가 전달 사항을 적어주세요."
        />
      </div>

      <div className="btn-area">
        <button
          type="button"
          onClick={handleEditToggle}
          className={`btn-edit ${selectedOrder.status !== "PENDING" ? "disabled" : ""}`}
        >
          {isEditMode ? "수정 완료" : "수정하기"}
        </button>
        {isEditMode ? (
          <button
            type="button"
            className="btn-cancel"
            onClick={() => {
              setIsEditMode(false);
              setMemo(selectedOrder.memo || "");
              setOrderItems(selectedOrder.orderItems || []);
            }}
          >
            수정 취소
          </button>
        ) : (
          <button
            type="button"
            className="btn-delete"
            onClick={handleCancelOrder}
          >
            삭제하기
          </button>
        )}
        <button type="button" onClick={onClose}>
          취소하기
        </button>
      </div>
    </div>
  );
};
