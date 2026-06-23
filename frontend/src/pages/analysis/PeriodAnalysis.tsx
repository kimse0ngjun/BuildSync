import { useEffect, useState } from "react";
import { TbFileSad } from "react-icons/tb";
import { PeriodAnalysisChart } from "./PeriodAnalysisChart";

export const PeriodAnalysis = ({ filters }: { filters: any }) => {
  const [data, setData] = useState<any[]>([
    { month: "01월", totalAmount: 45000000, projectCount: 5 },
    { month: "02월", totalAmount: 52000000, projectCount: 6 },
    { month: "03월", totalAmount: 31000000, projectCount: 3 },
    { month: "04월", totalAmount: 64000000, projectCount: 8 },
    { month: "05월", totalAmount: 58000000, projectCount: 7 },
    { month: "06월", totalAmount: 50000000, projectCount: 4 }, // 2026년 6월 현재 달 기준
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFuture, setIsFuture] = useState<boolean>(false);

  useEffect(() => {
    if (!filters) return;

    const currentYear = 2026;
    const currentMonth = 6;
    const selectedYear = Number(filters.year);
    const selectedMonth = Number(filters.month);

    if (
      selectedYear > currentYear ||
      (selectedYear === currentYear && selectedMonth > currentMonth)
    ) {
      setIsFuture(true);
    } else {
      setIsFuture(false);
    }
  }, [filters]);

  if (isFuture) {
    return (
      <div className="if-future">
        <TbFileSad />
        <p className="if-future-message">
          선택하신 기간의 발주 및 비용 데이터가 존재하지 않습니다.
        </p>
      </div>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <div className="if-no-data">
        <TbFileSad />
        <p className="if-no-data-message">조회된 데이터가 없습니다.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="status-loading">
        <p className="loading-message">데이터를 가져오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="period-analysis-container">
      <div className="header">
        <h2 className="title">기간별 자재 구매 비용 분석</h2>
      </div>

      <div className="period-filter-wrapper">
        <select className="analysis-filter-year" name="year">
          <option>2026년</option>
        </select>

        <select className="analysis-filter-month" name="month">
          <option>n월</option>
        </select>

        <button className="btn-search">조회</button>
      </div>

      <div className="total-view-area">
        <h3>올해 누적 총 발주 금액</h3>
        <br />
        <small>당해 연도 총 지출액</small>
        <p>300,000,000원</p>
      </div>

      <div className="analysis-view-area">
        <h3 className="compare-to-prev">전월 대비 총 지출 증감률</h3>
        <p>🔻4.5%</p>
        <br />
        <h4>올해 최고 지출 월</h4>
        <p>1월</p>
        <span>50,000,000원</span>
      </div>

      <div className="period-chart-area">
        <PeriodAnalysisChart chartData={data} />
      </div>
    </div>
  );
};
