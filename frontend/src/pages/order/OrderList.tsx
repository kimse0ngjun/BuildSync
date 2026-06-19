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

import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import BaseModal from "./modal/BaseModal";
import { OrderModalDetail } from "./modal/OrderModalDetail";
import { orderListApi } from "../../api/orderApi";
import { STATUS_MAP } from "../../constants/status";

export const OrderList = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    end: 0,
    canceled: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const pageSize = 10;

  // const myCompanyType = localStorage.getItem("companyType") as
  //   | "CONSTRUCTION"
  //   | "SUPPLIER";
  // const myCompanyId = Number(localStorage.getItem("companyId") || 1);
  const myCompanyId = 1;
  const myCompanyType = "CONSTRUCTION";

  const fetchOrderList = () => {
    const filters = {
      companyId: myCompanyId,
      status: selectedStatus || undefined,
      keyword: keyword.trim() || undefined,
      page: page - 1,
      size: pageSize,
    };

    orderListApi
      .getOrderListConstruction(filters)
      .then((data) => {
        if (data && (data.content || data.list)) {
          const contentList = data.content || data.list || [];
          setOrders(contentList);

          const totalElements =
            data.totalElements || data.totalCount || contentList.length;
          setTotalCount(totalElements);

          const calculatedTotalPages =
            data.totalPages || Math.ceil(totalElements / pageSize) || 1;
          setTotalPages(calculatedTotalPages);

          setStats({
            total: totalElements,
            pending:
              data.pendingCount ||
              contentList.filter((o: any) => o.status === "PENDING").length,
            accepted:
              data.acceptedCount ||
              contentList.filter((o: any) => o.status === "ACCEPTED").length,
            end:
              data.endCount ||
              contentList.filter((o: any) => o.status === "END").length,
            canceled:
              data.canceledCount ||
              contentList.filter((o: any) => o.status === "CANCELED").length,
          });
        }
      })
      .catch((err) => {
        console.error("발주 목록 로드 실패:", err);
        setOrders([]);
      });
  };

  // 필터 및 페이지 번호 체인 시 재조회
  useEffect(() => {
    fetchOrderList();
  }, [selectedStatus, keyword, page]);

  // 페이지네이션 번호 가방 계산
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(1);
  };

  const handleRowClick = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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
          value={stats.total}
          unit="건"
        />
        <StatCard
          icon={<FiClock />}
          title="접수 대기"
          value={stats.pending}
          unit="건"
        />
        <StatCard
          icon={<FiCheckCircle />}
          title="발주 완료"
          value={stats.end}
          unit="건"
        />
        <StatCard
          icon={<FiXCircle />}
          title="취소"
          value={stats.canceled}
          unit="건"
          danger
        />
      </div>

      <div className="order-toolbar">
        <form className="order-search" onSubmit={handleSearchSubmit}>
          <input
            placeholder="발주번호, 거래처, 담당자, 자재 검색..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
              orders.map((order, index) => {
                const items = order.orderItems || [];
                const representativeItem =
                  items.length > 0 ? items[0].materialName : "품목 없음";
                const itemCount = items.length;

                return (
                  <tr
                    key={`${order.orderId ?? "order"}-${index}`}
                    onClick={() => handleRowClick(order)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="order-number">{order.orderId}</td>
                    <td className="order-company">{order.companyName}</td>
                    <td>{order.contactName || "-"}</td>
                    <td className="order-material">
                      {representativeItem}
                      {itemCount > 1 && <span> 외 {itemCount - 1}건</span>}
                    </td>
                    <td>
                      <span className={`order-status ${order.status}`}>
                        {STATUS_MAP[order.status] ?? order.status}
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
