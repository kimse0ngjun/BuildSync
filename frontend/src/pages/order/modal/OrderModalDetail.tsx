import { useEffect, useState } from "react";
import { OrderModalDetailForConstruct } from "./OrderModalDetailForConstruct";
import { OrderModalDetailForSupplier } from "./OrderModalDetailForSupplier";
import { orderListApi } from "../../../api/orderApi";

interface OrderModalDetailProps {
  selectedOrder: any;
  onClose: () => void;
  myCompanyType: "CONSTRUCTION" | "SUPPLIER";
}

export const OrderModalDetail = ({
  selectedOrder,
  onClose,
  myCompanyType,
}: OrderModalDetailProps) => {
  const [fullOrderDetail, setFullOrderDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (selectedOrder?.orderId) {
      setLoading(true);
      orderListApi
        .getOrderDetail(selectedOrder.orderId)
        .then((data) => {
          setFullOrderDetail(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedOrder]);

  if (!selectedOrder) return null;
  if (loading)
    return <div className="loading">데이터를 불러오는 중입니다...</div>;

  const combinedOrder = { ...selectedOrder, ...fullOrderDetail };

  return myCompanyType === "CONSTRUCTION" ? (
    <OrderModalDetailForConstruct
      selectedOrder={combinedOrder}
      onClose={onClose}
    />
  ) : (
    <OrderModalDetailForSupplier
      selectedOrder={combinedOrder}
      onClose={onClose}
    />
  );
};
