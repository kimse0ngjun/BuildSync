import { useEffect, useState } from "react";
import { FaBoxes, FaCartPlus, FaExclamationCircle } from "react-icons/fa";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import type {
  MaterialShortageResponse,
  StockShortageResponse,
} from "../../types/Notification";
import { stockShortageApi } from "../../api/stockStortageApi";
import "../../styles/Notifications.css";

export const NotificationStock = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const companyId = Number(localStorage.getItem("companyId"));

  // 데이터
  const [boardData, setBoardData] = useState<StockShortageResponse | null>(
    null,
  );
  const [materials, setMaterials] = useState<MaterialShortageResponse[]>([]);

  // 페이징
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  const handleFetchStockData = (page: number = 0) => {
    setLoading(true);
    return Promise.all([
      stockShortageApi.getShortageCard(companyId), // 회사 ID
      stockShortageApi.getShortageList(companyId, page),
    ])
      .then(([boardRes, listRes]) => {
        setBoardData(boardRes);

        setMaterials(listRes.list || []);
        setTotalPages(listRes.totalPages || 1);
        setTotalElements(listRes.totalElements || 0);
        setCurrentPage(page);

        return { boardRes, listRes };
      })
      .catch((err) => console.error("재고 부족 데이터 로딩 실패", err))
      .finally(() => setLoading(false));
  };

  const handlePageChange = (newPage: number) => {
    handleFetchStockData(newPage);
  };

  useEffect(() => {
    handleFetchStockData(0);
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h2 className="title">
          <FaBoxes className="title-icon" /> 자재 재고 부족 알림 현황
        </h2>
        <p className="explain">
          현재고가 설정된 최소 기준 재고량보다 미달된 자재 품목들을 실시간으로
          추출합니다.
        </p>
      </div>

      <div className="critical-area">
        <div className="critical-card">
          <MdOutlineRemoveShoppingCart className="critical-icon" />
          <div className="critical-material-area">
            <h4 className="critical-title">심각 유의 자재 (위험 등급)</h4>
            <p className="critical-data">
              {boardData ? boardData.criticalCount : 0} 품목
            </p>
          </div>
        </div>

        <div className="warning-area">
          <FaExclamationCircle className="warning-icon" />
          <div className="warning-material-area">
            <h4 className="warning-title">안전기준 미달 자재 (전체 주의건)</h4>
            <p className="warning-data">
              {boardData ? boardData.warningCount : 0} 품목
            </p>
          </div>
        </div>

        <div className="ordering-area">
          <FaBoxes className="ordering-icon" />
          <div className="ordering-material-area">
            <h4 className="ordering-title">주문 집중으로 인한 부족 자재</h4>
            <p className="ordering-data">
              {boardData ? boardData.onOrderCount : 0} 품목
            </p>
          </div>
        </div>

        <div className="deficit-area">
          <div className="deficit-material-area">
            <h4 className="deficit-title">예상 부족 재고 확보 비용</h4>
            <p className="deficit-data">
              {boardData ? boardData.estimatedRequiredCost.toLocaleString() : 0}{" "}
              원
            </p>
          </div>
        </div>
      </div>

      <hr className="line" />

      <div className="shortage-material-area">
        <span className="shortage-material-data">
          기준 미달 자재: 총 <strong>{totalElements}</strong> 건
        </span>
      </div>

      {loading ? (
        <p>재고 현황 데이터를 분석 중입니다.</p>
      ) : (
        <div className="shortage-list-area">
          <table className="shortage-table">
            <thead>
              <tr>
                <th className="th-status">상태</th>
                <th className="th-materialId">자재 코드</th>
                <th className="th-materialName">자재명</th>
                <th className="th-currentStock">현재 재고</th>
                <th className="th-safeStock">설정 최소 재고</th>
                <th className="th-deficitQuantity">부족 수량</th>
                <th className="th-unitPrice">예상 단가</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? (
                materials.map((material) => (
                  <tr key={material.materialId}>
                    <td className="status-data">
                      <span>{material.statusMessage}</span>
                    </td>

                    <td className="materialId-data">{material.materialId}</td>

                    <td className="materialName-data">
                      <strong>{material.materialName}</strong>
                    </td>

                    <td className="currentStock-data">
                      {material.currentStock.toLocaleString() ?? "데이터 없음"}{" "}
                      개
                    </td>
                    <td className="safetyStock-data">
                      {material.safetyStock.toLocaleString() ?? "데이터 없음"}{" "}
                      개
                    </td>

                    <td className="deficitQuantity-data">
                      {material.deficitQuantity.toLocaleString() ??
                        "데이터 없음"}{" "}
                      개
                    </td>

                    <td className="unitPrice-data">
                      {material.unitPrice.toLocaleString() ?? "데이터 없음"} 원
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-data">
                  <td colSpan={8} className="no-data-message">
                    현재 최소 재고량 미달로 경고가 발생한 자재가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-area">
            <button
              className="prev-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                className="current-page-btn"
                key={index}
                onClick={() => handlePageChange(index)}
                disabled={currentPage === index}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="next-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || totalPages === 0}
            >
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
