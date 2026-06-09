import { useState } from "react";

function CostAnalysisPage() {
  const [selected, setSelected] = useState("monthly");

  return (
    <div>
      <h1>통합 분석</h1>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
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
          차트 들어갈 영역
        </div>
      )}

      {selected === "site" && (
        <div>
          <h2>현장별 자재 사용 비용 분석</h2>
          차트 들어갈 영역
        </div>
      )}
    </div>
  );
}

export default CostAnalysisPage;
