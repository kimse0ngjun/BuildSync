import { useEffect, useState } from "react";
import {
  getMonthlyMaterialCost,
  getSiteMaterialUsage,
} from "../../api/analysis";

import type {
  MonthlyMaterialCostResponse,
  SiteMaterialUsageAnalysisResponse,
} from "../../types/analysis";

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

      setMonthlyData(monthly.data);
      setSiteData(site.data);
    } catch (e) {
      console.error("분석 조회 실패", e);
    }
  };

  return (
    <div>
      <h1>통합 분석</h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          onClick={() => setSelected("monthly")}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            cursor: "pointer",
          }}
        >
          월별 자재 구매 비용
        </div>

        <div
          onClick={() => setSelected("site")}
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            cursor: "pointer",
          }}
        >
          현장별 자재 사용 비용
        </div>
      </div>

      {selected === "monthly" && (
        <div>
          <h2>월별 자재 구매 비용 분석</h2>

          <table>
            <thead>
              <tr>
                <th>월</th>
                <th>발주금액</th>
                <th>자재비</th>
              </tr>
            </thead>

            <tbody>
              {monthlyData.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>

                  <td>{item.totalOrderAmount.toLocaleString()}</td>

                  <td>{item.totalMaterialCost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected === "site" && (
        <div>
          <h2>현장별 자재 사용 비용 분석</h2>

          <table>
            <thead>
              <tr>
                <th>현장</th>
                <th>자재</th>
                <th>입고</th>
                <th>출고</th>
                <th>재고</th>
              </tr>
            </thead>

            <tbody>
              {siteData.map((item, index) => (
                <tr key={index}>
                  <td>{item.siteName}</td>

                  <td>{item.materialName}</td>

                  <td>
                    {item.inboundQuantity}
                    {item.unit}
                  </td>

                  <td>
                    {item.outboundQuantity}
                    {item.unit}
                  </td>

                  <td>
                    {item.currentStock}
                    {item.unit}
                  </td>
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
