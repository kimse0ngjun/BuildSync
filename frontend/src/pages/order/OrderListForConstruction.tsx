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
import { IoMdExit } from "react-icons/io";

import BaseModal from "./modal/BaseModal";
import { OrderModalDetail } from "./modal/OrderModalDetail";
import { orderListApi } from "../../api/orderApi";
import { STATUS_MAP } from "../../constants/status";
import "../../styles/OrderList.css";

export const OrderListForConstruction = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    end: 0,
    canceled: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<any>(null);

  const pageSize = 10;

  const myCompanyType = localStorage.getItem("companyType") as
    | "CONSTRUCTION"
    | "SUPPLIER";
  const myCompanyId = Number(localStorage.getItem("companyId"));

  const fetchCountsData = async () => {
    try {
      const counts =
        myCompanyType === "CONSTRUCTION"
          ? await orderListApi.getConstructionCounts(myCompanyId)
          : await orderListApi.getSupplierCounts(myCompanyId);

      setStats({
        total: counts.totalCount,
        pending: counts.pendingCount,
        accepted: counts.acceptedCount,
        end: counts.endCount,
        canceled: counts.cancelCount,
      });
    } catch (err) {
      console.error("통계 카드 로드 실패:", err);
    }
  };

  const fetchOrderList = async () => {
    setIsLoading(true);
    try {
      const data = await orderListApi.getOrderList(
        myCompanyId,
        myCompanyType,
        page - 1,
        pageSize,
      );

      if (data && data.list) {
        let filtered = data.list;

        if (selectedStatus) {
          filtered = filtered.filter((o) => o.status === selectedStatus);
        }
        if (keyword) {
          filtered = filtered.filter(
            (o) =>
              o.orderId.toString().includes(keyword) ||
              o.partnerName.includes(keyword) ||
              o.managerName.includes(keyword) ||
              o.mainItemName.includes(keyword),
          );
        }

        setOrders(filtered);
        setTotalCount(data.totalElements);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("발주 목록 로드 실패:", err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 통계 카드 고정
  useEffect(() => {
    fetchCountsData();
  }, []);

  // 필터 및 페이지 번호 체인 시 재조회
  useEffect(() => {
    fetchOrderList();
  }, [selectedStatus, keyword, page]);

  // 페이지네이션 계산
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

  const handleRowClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const icon = <FaRegCircleCheck />;
  const exitIcon = (
    <IoMdExit
      onClick={() => setIsModalOpen(false)}
      style={{ cursor: "pointer" }}
    />
  );

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
          value={stats.pending || 0}
          unit="건"
        />
        <StatCard
          icon={<FiCheckCircle />}
          title="발주 완료"
          value={stats.end || 0}
          unit="건"
        />
        <StatCard
          icon={<FiXCircle />}
          title="취소"
          value={stats.canceled || 0}
          unit="건"
          danger
        />
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "#64748b",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        검색 결과 : 총 <span style={{ color: "#2563eb" }}>{totalCount}</span>건
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
            {isLoading ? (
              <tr>
                <td className="order-empty" colSpan={6}>
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order, index) => {
                const representativeItem = order.mainItemName || "품목 없음";
                const extraCount = order.extraItemCount || 0;

                return (
                  <tr
                    key={`${order.orderId ?? "order"}-${index}`}
                    onClick={() => handleRowClick(order.orderId)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="order-number">{order.orderId}</td>
                    <td className="order-company">{order.partnerName}</td>
                    <td>{order.managerName || "-"}</td>
                    <td className="order-material">
                      {representativeItem}
                      {extraCount > 0 && <span> 외 {extraCount}건</span>}
                    </td>
                    <td>
                      <span className={`order-status ${order.status}`}>
                        {STATUS_MAP[order.status] ??
                          getStatusText(order.status)}
                      </span>
                    </td>
                    <td>
                      {order.orderDate ? order.orderDate.split("T")[0] : "-"}
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
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1 || isLoading}
        >
          <FiChevronLeft />
        </button>

        {pageNums.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={page === num ? "active" : ""}
            disabled={isLoading}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || isLoading}
        >
          <FiChevronRight />
        </button>
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "24px",
              width: "100%",
              maxWidth: "650px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <BaseModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="발주서 상세 정보 확인"
              subtitle="제출한 발주서의 상세 정보를 확인할 수 있습니다."
              content={
                <OrderModalDetail
                  selectedOrder={selectedOrderId}
                  onClose={() => setIsModalOpen(false)}
                  myCompanyType={myCompanyType}
                />
              }
              icon={icon}
              deleteIcon={exitIcon}
            />
          </div>
        </div>
      )}
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
