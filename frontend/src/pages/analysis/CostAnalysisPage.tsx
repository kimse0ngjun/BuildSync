import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";

import {
  getCompanyMonthlyPurchase,
  getCompanySiteUsage,
  getSupplierMonthlySales,
  getSupplierSiteCost,
} from "../../api/analysis";

import type {
  MonthlyPurchase,
  SiteUsage,
  MonthlySales,
  SiteCost,
} from "../../types/analysis";

import "../../styles/CostAnalysisPage.css";

function CostAnalysisPage() {
  const { companyType } = useAuth();
  console.log("companyType:", companyType);
  const [selected, setSelected] = useState("monthly");
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <LoginRequired />;
  }

  // 건설업체
  const [monthlyData, setMonthlyData] = useState<MonthlyPurchase[]>([]);

  const [siteData, setSiteData] = useState<SiteUsage[]>([]);

  // 공급업체
  const [salesData, setSalesData] = useState<MonthlySales[]>([]);

  const [costData, setCostData] = useState<SiteCost[]>([]);

  useEffect(() => {
    if (!companyType) return;

    loadAnalysis();
  }, [companyType]);

  const loadAnalysis = async () => {
    try {
      // 건설업체
      if (companyType === "CONSTRUCTION") {
        const [monthly, site] = await Promise.all([
          getCompanyMonthlyPurchase(),

          getCompanySiteUsage(),
        ]);

        setMonthlyData(monthly);

        setSiteData(site);
      }

      // 공급업체
      if (companyType === "SUPPLIER") {
        const [sales, cost] = await Promise.all([
          getSupplierMonthlySales(),

          getSupplierSiteCost(),
        ]);

        setSalesData(sales);

        setCostData(cost);
      }
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
          {companyType === "SUPPLIER"
            ? "월별 자재 판매 비용"
            : "월별 자재 구매 비용"}
        </div>

        <div
          onClick={() => setSelected("site")}
          className={`analysis-tab ${selected === "site" ? "active" : ""}`}
        >
          {companyType === "SUPPLIER"
            ? "현장별 자재 비용"
            : "현장별 자재 사용 합계"}
        </div>
      </div>

      {companyType === "CONSTRUCTION" && selected === "monthly" && (
        <div className="analysis-card">
          <h2>월별 자재 구매 비용 분석</h2>

          <table>
            <thead>
              <tr>
                <th>월</th>
                <th>총 구매 비용</th>
              </tr>
            </thead>

            <tbody>
              {monthlyData.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>

                  <td>{(item.totalCost ?? 0).toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {companyType === "CONSTRUCTION" && selected === "site" && (
        <div className="analysis-card">
          <h2>현장별 자재 사용 합계</h2>

          <table>
            <thead>
              <tr>
                <th>현장명</th>
                <th>사용량</th>
              </tr>
            </thead>

            <tbody>
              {siteData.map((item) => (
                <tr key={item.siteName}>
                  <td>{item.siteName}</td>

                  <td>{(item.totalQuantity ?? 0).toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {companyType === "SUPPLIER" && selected === "monthly" && (
        <div className="analysis-card">
          <h2>월별 자재 판매 비용 분석</h2>

          <table>
            <thead>
              <tr>
                <th>월</th>
                <th>총 판매 비용</th>
              </tr>
            </thead>

            <tbody>
              {salesData.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>

                  <td>{(item.totalSales ?? 0).toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {companyType === "SUPPLIER" && selected === "site" && (
        <div className="analysis-card">
          <h2>현장별 자재 비용 사용</h2>

          <table>
            <thead>
              <tr>
                <th>현장명</th>
                <th>자재명</th>
                <th>출고량</th>
                <th>단가</th>
                <th>총액</th>
              </tr>
            </thead>

            <tbody>
              {costData.map((item) => (
                <tr key={`${item.siteName}-${item.materialName}`}>
                  <td>{item.siteName}</td>

                  <td>{item.materialName}</td>

                  <td>{item.quantity}</td>

                  <td>{item.unitPrice.toLocaleString()}원</td>

                  <td>{item.totalPrice.toLocaleString()}원</td>
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
