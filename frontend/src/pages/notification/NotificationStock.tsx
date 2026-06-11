import { useState } from "react";
import { FaBoxes, FaCartPlus, FaExclamationCircle } from "react-icons/fa";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import type { Material } from "../../types/OrderDTO";
import { useNavigate } from "react-router-dom";

export const NotificationStock = () => {
  const [materials] = useState<Material[]>([
    {
      materialId: 1,
      materialCode: "MAT-2026-001",
      materialName: "포틀랜드 시멘트",
      materialCategory: "시멘트/레미콘",
      currentStock: 15,
      minimumStock: 100,
      unit: "포대",
      specification: "40kg",
      unitPrice: 7500,
    },
    {
      materialId: 2,
      materialCode: "MAT-2026-002",
      materialName: "고장력 철근",
      materialCategory: "철강/철근",
      currentStock: 45,
      minimumStock: 50,
      unit: "톤(t)",
      specification: "D13 / 8m",
      unitPrice: 980000,
    },
    {
      materialId: 3,
      materialCode: "MAT-2026-003",
      materialName: "세골재 (모래)",
      materialCategory: "골재/토사",
      currentStock: 0,
      minimumStock: 40,
      unit: "루베(m³)",
      specification: "세척사",
      unitPrice: 28000,
    },
    {
      materialId: 4,
      materialCode: "MAT-2026-004",
      materialName: "일반 레미콘",
      materialCategory: "시멘트/레미콘",
      currentStock: 150,
      minimumStock: 120,
      unit: "루베(m³)",
      specification: "25-24-150",
      unitPrice: 92000,
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const shortageMaterials = materials.filter(
    (m) => m.currentStock < m.minimumStock,
  );

  const filteredMaterials = selectedCategory
    ? shortageMaterials.filter((m) => m.materialCategory === selectedCategory)
    : shortageMaterials;

  const totalShortageCount = shortageMaterials.length;
  const outOfStockCount = shortageMaterials.filter(
    (m) => m.currentStock === 0,
  ).length;

  const nav = useNavigate();

  return (
    <div className="stock-warning-container">
      <div className="page-header">
        <h2>
          <FaBoxes /> 자재 재고 부족 알림 현황
        </h2>
        <p>
          현재고가 설정된 최소 기준 재고량보다 미달된 자재 품목들을 실시간으로
          추출합니다.
        </p>
      </div>

      <div className="summary-cards">
        <div>
          <MdOutlineRemoveShoppingCart />
          <div>
            <h4>당장 투입 불가 (재고 없음 / 품절)</h4>
            <p>{outOfStockCount} 품목</p>
          </div>
        </div>

        <div>
          <FaExclamationCircle />
          <div>
            <h4>안전기준 미달 (재고 부족)</h4>
            <p>{totalShortageCount} 품목</p>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <span>
          기준 미달 자재: 총 <span>{filteredMaterials.length}</span>건
        </span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">전체 카테고리</option>
          <option value="시멘트/레미콘">시멘트/레미콘</option>
          <option value="철강/철근">철강/철근</option>
          <option value="골재/토사">골재/토사</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>구분</th>
              <th>자재 코드</th>
              <th>자재명 / 규격</th>
              <th>현재 재고</th>
              <th>설정 최소 재고</th>
              <th>예상 단가</th>
              <th>조치</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material) => {
                const isOutOfStock = material.currentStock === 0;

                return (
                  <tr key={material.materialId}>
                    <td>
                      <span>{isOutOfStock ? "품절" : "재고부족"}</span>
                    </td>
                    <td>{material.materialCode}</td>
                    <td>
                      <strong>{material.materialName}</strong>
                      <br />
                      <small>
                        {material.specification} | {material.materialCategory}
                      </small>
                    </td>

                    <td>
                      {material.currentStock.toLocaleString()} {material.unit}
                    </td>
                    <td>
                      {material.minimumStock.toLocaleString()} {material.unit}
                    </td>
                    <td>{material.unitPrice.toLocaleString()}원</td>

                    <td>
                      <button onClick={() => nav("/order/write")}>
                        <FaCartPlus /> 즉시 발주
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  현재 최소 재고량 미달로 경고가 발생한 자재가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
