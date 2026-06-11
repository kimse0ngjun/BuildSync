import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "../../styles/OrderList.css";

const sampleOrders = [
  {
    orderId: "PO-2026-001",
    companyName: "대한자재",
    contactName: "김철수",
    status: "END",
    orderDate: "2026-06-09",
    orderItems: [{ materialName: "철근 D13" }, { materialName: "시멘트 40kg" }],
  },
  {
    orderId: "PO-2026-002",
    companyName: "쌍용양회",
    contactName: "이영희",
    status: "PENDING",
    orderDate: "2026-06-08",
    orderItems: [{ materialName: "시멘트 40kg" }],
  },
  {
    orderId: "PO-2026-003",
    companyName: "우드코리아",
    contactName: "박민수",
    status: "ACCEPTED",
    orderDate: "2026-06-07",
    orderItems: [
      { materialName: "목재 2x4" },
      { materialName: "합판 12T" },
      { materialName: "각재" },
    ],
  },
  {
    orderId: "PO-2026-004",
    companyName: "대한전선",
    contactName: "최현우",
    status: "END",
    orderDate: "2026-06-06",
    orderItems: [{ materialName: "전선 2.5sq" }],
  },
  {
    orderId: "PO-2026-005",
    companyName: "삼화페인트",
    contactName: "강민수",
    status: "CANCELED",
    orderDate: "2026-06-05",
    orderItems: [{ materialName: "페인트 18L" }],
  },
  {
    orderId: "PO-2026-006",
    companyName: "금강PVC",
    contactName: "정하늘",
    status: "PENDING",
    orderDate: "2026-06-04",
    orderItems: [
      { materialName: "배관 PVC 50A" },
      { materialName: "PVC 엘보" },
    ],
  },
  {
    orderId: "PO-2026-007",
    companyName: "벽돌마트",
    contactName: "홍길동",
    status: "ACCEPTED",
    orderDate: "2026-06-03",
    orderItems: [{ materialName: "벽돌" }],
  },
];

import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import BaseModal from "./modal/BaseModal";
import { OrderModalDetail } from "./modal/OrderModalDetail";

export const OrderList = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const pageSize = 7;

  const myCompanyType = localStorage.getItem("companyType") as
    | "CONSTRUCTION"
    | "SUPPLIER";

  useEffect(() => {
    let filtered = sampleOrders;

    if (selectedStatus) {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    if (keyword.trim()) {
      filtered = filtered.filter((order) => {
        const itemNames = order.orderItems
          .map((item: any) => item.materialName)
          .join(" ");

        return (
          order.orderId.includes(keyword) ||
          order.companyName.includes(keyword) ||
          order.contactName.includes(keyword) ||
          itemNames.includes(keyword)
        );
      });
    }

    setOrders(filtered);
    setTotalCount(filtered.length);
  }, [selectedStatus, keyword, page]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const icon = <FaRegCircleCheck />;
  const deleteIcon = <IoIosClose onClick={() => setIsModalOpen(false)} />;

  return (
    <div className="order-list-page">
      <div className="order-list-header">
        <div>
          <p className="order-list-label">발주 관리</p>
          <h1>발주 내역</h1>
          <p className="order-list-desc">
            등록된 발주 요청과 처리 상태를 조회하고 관리하세요.
          </p>
        </div>

        <button
          className="order-write-btn"
          onClick={() => navigate("/order/write")}
        >
          <FiPlus />
          발주 요청
        </button>
      </div>

      <div className="order-stat-grid">
        <StatCard
          icon={<FiFileText />}
          title="전체 발주"
          value={sampleOrders.length}
          unit="건"
        />
        <StatCard
          icon={<FiClock />}
          title="접수 대기"
          value={
            sampleOrders.filter((order) => order.status === "PENDING").length
          }
          unit="건"
        />
        <StatCard
          icon={<FiCheckCircle />}
          title="발주 완료"
          value={sampleOrders.filter((order) => order.status === "END").length}
          unit="건"
        />
        <StatCard
          icon={<FiXCircle />}
          title="취소"
          value={
            sampleOrders.filter((order) => order.status === "CANCELED").length
          }
          unit="건"
          danger
        />
      </div>

      <div className="order-toolbar">
        <form className="order-search" onSubmit={handleSearchSubmit}>
          <input
            placeholder="발주번호, 거래처, 담당자, 자재 검색..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">
            <FiSearch />
          </button>
        </form>

        <select value={selectedStatus} onChange={handleStatusChange}>
          <option value="">전체 상태</option>
          <option value="PENDING">접수 대기</option>
          <option value="ACCEPTED">접수 완료</option>
          <option value="END">발주 완료</option>
          <option value="CANCELED">취소</option>
        </select>
      </div>

      <div className="order-table-wrap">
        <table className="order-list-table">
          <thead>
            <tr>
              <th>발주 번호</th>
              <th>거래처</th>
              <th>담당자</th>
              <th>품목</th>
              <th>상태</th>
              <th>등록일</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => {
                const items = order.orderItems || [];
                const representativeItem =
                  items.length > 0 ? items[0].materialName : "품목 없음";
                const itemCount = items.length;

                return (
                  <tr key={order.orderId}>
                    <td className="order-number">{order.orderId}</td>
                    <td className="order-company">{order.companyName}</td>
                    <td>{order.contactName}</td>
                    <td className="order-material">
                      {representativeItem}
                      {itemCount > 1 && <span> 외 {itemCount - 1}건</span>}
                    </td>
                    <td>
                      <span className={`order-status ${order.status}`}>
                        {order.status === "PENDING"
                          ? "접수 대기"
                          : order.status === "ACCEPTED"
                            ? "접수 완료"
                            : order.status === "END"
                              ? "발주 완료"
                              : "취소"}
                      </span>
                    </td>

                    <td>
                      {order.orderDate
                        ? String(order.orderDate).split("T")[0]
                        : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="order-empty" colSpan={6}>
                  등록된 발주 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="order-pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          <FiChevronLeft />
        </button>

        {pageNums.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={page === num ? "active" : ""}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          <FiChevronRight />
        </button>
      </div>
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="발주서 상세 정보 확인"
        subtitle="제출한 발주서의 상세 정보를 확인할 수 있습니다."
        content={
          <OrderModalDetail
            selectedOrder={selectedOrder}
            onClose={() => setIsModalOpen(false)}
            myCompanyType={myCompanyType}
          />
        }
        icon={icon}
        deleteIcon={deleteIcon}
      />
    </div>
  );
};

function StatCard({
  icon,
  title,
  value,
  unit,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  danger?: boolean;
}) {
  return (
    <div className="order-stat-card">
      <div className={danger ? "order-stat-icon danger" : "order-stat-icon"}>
        {icon}
      </div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
    </div>
  );
}

function getStatusText(status: string) {
  switch (status) {
    case "PENDING":
      return "접수 대기";
    case "ACCEPTED":
      return "접수 완료";
    case "END":
      return "발주 완료";
    case "CANCELED":
      return "취소";
    default:
      return status || "-";
  }
}
