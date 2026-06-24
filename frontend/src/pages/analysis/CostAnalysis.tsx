import { useState } from "react";
import { PeriodAnalysis } from "./PeriodAnalysis";
import { SiteAnalysis } from "./SiteAnalysis";

export const CostAnalysis = () => {
  const [tab, setTab] = useState<"monthly" | "site">("monthly");
  const [filterData, setFilterData] = useState({
    year: "2026",
    month: "06",
  });

  const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<any>({
    value: "",
    label: "전체 현장 (전체 주소)",
  });

  const finalPayload = {
    year: filterData.year,
    month: filterData.month,
    siteId: selectedSite?.value || "",
  };

  return (
    <div className="cost-analysis-container">
      <div className="analysis-header">
        <h2 className="title">통합 비용 분석</h2>
        <hr className="line" />
      </div>

      <div className="tap-btn-area">
        <button
          className={`tab-btn ${tab === "monthly" ? "active" : ""}`}
          onClick={() => setTab("monthly")}
        >
          기간별 자재 구매 비용 분석
        </button>
        <button
          className={`tab-btn ${tab === "site" ? "active" : ""}`}
          onClick={() => setTab("site")}
        >
          현장별 자재 사용 비용
        </button>
      </div>

      <div className="tab-content-area">
        {tab === "monthly" ? (
          <PeriodAnalysis filters={finalPayload} />
        ) : (
          <SiteAnalysis filters={finalPayload} />
        )}
      </div>
    </div>
  );
};
