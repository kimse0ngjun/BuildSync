import { useEffect, useState } from "react";
import {
  getMonthlyMaterialCost,
  getSiteMaterialUsage,
} from "../../api/analysis";

import type {
  MonthlyMaterialCostResponse,
  SiteMaterialUsageAnalysisResponse,
} from "../../types/analysis";

import "../../styles/CostAnalysisPage.css";

function CostAnalysisPage() {
  const [selected, setSelected] = useState("monthly");

  const [monthlyData, setMonthlyData] = useState<MonthlyMaterialCostResponse[]>(
    [],
  );

  const [siteData, setSiteData] = useState<SiteMaterialUsageAnalysisResponse[]>(
    [],
  );

  const companyId = Number(localStorage.getItem("companyId"));

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    try {
      const [monthly, site] = await Promise.all([
        getMonthlyMaterialCost(companyId),
        getSiteMaterialUsage(companyId),
      ]);

      console.log(site.data);

      setMonthlyData(monthly.data);
      setSiteData(site.data);
    } catch (e) {
      console.error("분석 조회 실패", e);
    }
  };

  return (
    <div className="analysis-page">
      <h1 className="analysis-title">통합 분석</h1>

      <div className="analysis-tabs">
        <div
          onClick={() => setSelected("monthly")}
          className={`analysis-tab ${selected === "monthly" ? "active" : ""}`}
        >
          월별 자재 구매 비용
        </div>

        <div
          onClick={() => setSelected("site")}
          className={`analysis-tab ${selected === "site" ? "active" : ""}`}
        >
          현장별 자재 사용 비용
        </div>
      </div>

      {selected === "monthly" && (
        <div className="analysis-card">
          <h2>월별 자재 구매 비용 분석</h2>

          <table>
            <thead>
              <tr>
                <th>월</th>
                <th>총 발주량</th>
                <th>총 자재 비용</th>
              </tr>
            </thead>

            <tbody>
              {monthlyData.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>

                  <td>{item.totalOrderAmount.toLocaleString()}</td>

                  <td>{item.totalMaterialCost.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected === "site" && (
        <div className="analysis-card">
          <h2>현장별 자재 사용 비용 분석</h2>

          <table>
            <thead>
              <tr>
                <th>현장명</th>
                <th>자재명</th>
                <th>입고량</th>
                <th>출고량</th>
                <th>현재재고</th>
                <th>단가</th>
              </tr>
            </thead>

            <tbody>
              {siteData.map((item) => (
                <tr key={`${item.siteId}-${item.materialName}`}>
                  <td>{item.siteName}</td>

                  <td>{item.materialName}</td>

                  <td>
                    {item.inboundQuantity.toLocaleString()}
                    {item.unit}
                  </td>

                  <td>
                    {item.outboundQuantity.toLocaleString()}
                    {item.unit}
                  </td>

                  <td>
                    {item.currentStock.toLocaleString()}
                    {item.unit}
                  </td>

                  <td>{item.unitPrice.toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CostAnalysisPage;
