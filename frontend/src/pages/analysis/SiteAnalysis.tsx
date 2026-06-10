import { useState } from "react";
import { TbFileSad } from "react-icons/tb";
import Select from "react-select";
import { SiteAnalysisChart } from "./SiteAnalysisChart";

export const SiteAnalysis = ({ filters }: { filters: any }) => {
  const [data, setData] = useState<any[]>([
    { name: "레미콘 / 시멘트", value: 120000000 },
    { name: "철근 / 철강자재", value: 90000000 },
    { name: "골재 / 모래 / 자갈", value: 45000000 },
    { name: "벽돌 / 블록", value: 30000000 },
    { name: "기타 소모자재", value: 15000000 },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [selectedSite, setSelectedSite] = useState<any>({
    value: "",
    label: "전체 현장 (전체 주소)",
  });

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
    <div className="site-analysis-container">
      <div className="header">
        <h2 className="title">현장별 자재 구매 비용 분석</h2>
      </div>

      <div className="analysis-filter">
        <div className="analysis-filter-sites-area">
          <Select
            options={siteOptions}
            value={selectedSite}
            onChange={(option) => setSelectedSite(option)}
            placeholder="현장명 또는 주소를 입력하세요."
            isClearable={false}
            isSearchable={true}
          />
        </div>

        <button className="btn-search">조회</button>
      </div>

      <div className="">
        <h3 className="activing-site-title">활성 공사 현장 수</h3>
        <p className="activing-site-data">
          현재 자재가 투입 중인 현장은 <span>7곳</span>입니다.
        </p>
        <hr className="line" />

        <h3 className="first-site-title">지출 1위 현장</h3>
        <p className="first-site-data">
          현재 가장 비용 투입이 큰 현장은 <span>강남 아파트 신축</span>입니다.
        </p>
      </div>

      <div className="site-chart-area">
        <SiteAnalysisChart chartData={data} />
      </div>
    </div>
  );
};
