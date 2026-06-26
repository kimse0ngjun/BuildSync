import { useEffect, useState } from "react";
import { OrderModalDetailForConstruct } from "./OrderModalDetailForConstruct";
import { OrderModalDetailForSupplier } from "./OrderModalDetailForSupplier";
import { orderListApi } from "../../../api/OrderApi";
import type { OrderModalDetailProps } from "../../../types/Modal";
import type { OrderDetailResponse } from "../../../types/Order";

export const OrderModalDetail = ({
  selectedOrder,
  onClose,
  myCompanyType,
}: OrderModalDetailProps) => {
  const [fullOrderDetail, setFullOrderDetail] =
    useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (selectedOrder) {
      setLoading(true);
      orderListApi
        .getOrderDetail(selectedOrder)
        .then((data) => {
          setFullOrderDetail(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("발주서 상세 조회 실패:", err);
          setLoading(false);
        });
    }
  }, [selectedOrder]);

  if (!selectedOrder) return null;
  if (loading)
    return <div className="loading">데이터를 불러오는 중입니다...</div>;
  if (!fullOrderDetail)
    return <div className="modal-error">발주서 정보를 찾을 수 없습니다.</div>;

  return myCompanyType === "CONSTRUCTION" ? (
    <OrderModalDetailForConstruct
      selectedOrder={fullOrderDetail}
      onClose={onClose}
    />
  ) : (
    <OrderModalDetailForSupplier
      selectedOrder={fullOrderDetail}
      onClose={onClose}
    />
  );
};
