import { useEffect, useState } from "react";
import { orderListApi } from "../../api/OrderApi";

import { FaRegCircleCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import BaseModal from "./modal/BaseModal";
import { OrderModalDetail } from "./modal/OrderModalDetail";

export const OrderList = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const pageSize = 7; // 한 페이지에 보여줄 게시글 수

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const myCompanyType = localStorage.getItem("companyType") as
    | "CONSTRUCTION"
    | "SUPPLIER";

  useEffect(() => {
    const filterParams = {
      status: selectedStatus || undefined,
      search: keyword || undefined,
      currentPage: page,
      size: pageSize,
    };

    orderListApi
      .getOrderList(filterParams)
      .then((res: any) => {
        if (res.content) {
          setOrders(res.content);
          setTotalCount(res.totalElements);
        } else if (Array.isArray(res)) {
          setOrders(res);
          setTotalCount(res.length);
        }
      })
      .catch((err) => {
        console.error("발주 리스트 로드 실패: ", err);
      });
  }, [selectedStatus, keyword, page]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleModalClick = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSearchSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if ("preventDefault" in e) {
      e.preventDefault();
    }

    setKeyword(keyword);
    setPage(1);
  };

  const icon = <FaRegCircleCheck />;
  const deleteIcon = <IoIosClose onClick={() => setIsModalOpen(false)} />;

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">발주 목록</h2>
        <hr className="line" />
      </div>

      <div className="sub-header">
        <p className="explain">
          총 {orders.length}개의 발주서가 등록되어 있습니다.
        </p>
        <div className="search-filter-wrapper">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              className="search"
              placeholder="검색어를 입력하세요."
              value={keyword}
              onChange={handleSearchChange}
            />
            <button type="submit" className="btn-search">
              검색
            </button>
          </form>

          <select
            className="select-status"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option className="default-option" value="">
              전체
            </option>
            <option className="PENDING" value="PENDING">
              접수 대기
            </option>
            <option className="CANCELED" value="CANCELED">
              취소
            </option>
            <option className="ACCEPTED" value="ACCEPTED">
              접수 완료
            </option>
            <option className="END" value="END">
              발주 완료
            </option>
          </select>
        </div>
      </div>

      <div className="table-area">
        <table className="order-table">
          <thead className="order-thead">
            <tr className="order-thead-tr">
              <th className="order-num">발주 번호</th>
              <th className="company-name">거래처</th>
              <th className="contact">담당자</th>
              <th className="material">자재</th>
              <th className="status">상태</th>
              <th className="date">등록일</th>
            </tr>
          </thead>

          <tbody className="order-tbody">
            {orders && orders.length > 0 ? (
              orders.map((order) => {
                const items = order.orderItems || [];
                const representativeItem =
                  items.length > 0 ? items[0].materialName : "품목 없음";
                const itemCount = items.length;

                return (
                  <tr
                    className="order-tbody-tr"
                    key={order.orderId}
                    onClick={() => handleModalClick(order)}
                  >
                    <td className="order-num-data">{order.orderId}</td>
                    <td className="order-company-name-data">
                      {order.companyName}
                    </td>
                    <td className="order-contact-name-data">
                      {order.contactName}
                    </td>
                    <td className="order-material-name-data">
                      <strong>{representativeItem}</strong>
                      {itemCount > 1 && <span> 외 {itemCount - 1}건</span>}
                    </td>
                    <td className="order-status-data-container">
                      <div className={`status-badge ${order.status}`}>
                        {order.status === "PENDING"
                          ? "접수 대기"
                          : order.status === "ACCEPTED"
                            ? "접수 완료"
                            : order.status === "END"
                              ? "발주 완료"
                              : "취소"}
                      </div>
                    </td>
                    <td className="order-date-data">
                      {order.orderDate
                        ? String(order.orderDate).split("T")[0]
                        : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="tr-no-data">
                <td className="no-data-message" colSpan={6}>
                  등록된 발주 목록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="paging-area">
          <button
            className="paging-btn-prev"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            &lt;
          </button>

          {pageNums.map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`paging-num ${page === num ? "active" : ""}`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="paging-btn-next"
          >
            &gt;
          </button>
        </div>
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
