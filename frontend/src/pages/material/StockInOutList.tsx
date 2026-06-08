import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiArchive,
  FiArrowDown,
  FiArrowUp,
  FiBox,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "../../styles/StockInOutList.css";

const stockItems = [
  {
    id: 1248,
    type: "입고",
    materialName: "철근 D13",
    siteName: "강남 아파트 신축",
    orderNo: "PO-2024-128",
    quantity: 120,
    unit: "EA",
    date: "2024-06-10",
    contactName: "김철수",
    memo: "-",
  },
  {
    id: 1247,
    type: "출고",
    materialName: "시멘트 40kg",
    siteName: "부산 상가 리모델링",
    orderNo: "PO-2024-127",
    quantity: 50,
    unit: "포",
    date: "2024-06-10",
    contactName: "이영희",
    memo: "1층 타설용",
  },
  {
    id: 1246,
    type: "입고",
    materialName: "유리 5T",
    siteName: "판교 오피스 건설",
    orderNo: "PO-2024-126",
    quantity: 80,
    unit: "EA",
    date: "2024-06-09",
    contactName: "김철수",
    memo: "2차 입고",
  },
  {
    id: 1245,
    type: "출고",
    materialName: "벽돌",
    siteName: "강남 아파트 신축",
    orderNo: "PO-2024-125",
    quantity: 300,
    unit: "EA",
    date: "2024-06-09",
    contactName: "박민수",
    memo: "외벽 시공",
  },
  {
    id: 1244,
    type: "입고",
    materialName: "전선 2.5sq",
    siteName: "인천 공장 신축",
    orderNo: "PO-2024-124",
    quantity: 100,
    unit: "롤",
    date: "2024-06-08",
    contactName: "이영희",
    memo: "전기 자재",
  },
  {
    id: 1243,
    type: "출고",
    materialName: "목재 2x4",
    siteName: "부산 상가 리모델링",
    orderNo: "PO-2024-123",
    quantity: 60,
    unit: "EA",
    date: "2024-06-08",
    contactName: "최현우",
    memo: "천장 작업",
  },
  {
    id: 1242,
    type: "입고",
    materialName: "페인트 18L",
    siteName: "강남 아파트 신축",
    orderNo: "PO-2024-122",
    quantity: 35,
    unit: "통",
    date: "2024-06-07",
    contactName: "김철수",
    memo: "도장 작업",
  },
  {
    id: 1241,
    type: "출고",
    materialName: "배관 PVC 50A",
    siteName: "판교 오피스 건설",
    orderNo: "PO-2024-121",
    quantity: 25,
    unit: "EA",
    date: "2024-06-07",
    contactName: "박민수",
    memo: "급수 배관",
  },
];

function StockInOutList() {
  const navigate = useNavigate();

  return (
    <div className="stock-page">
      <div className="stock-header">
        <div>
          <p className="stock-page-label">입출고 관리</p>
          <h1>입출고 관리</h1>
          <p className="stock-page-desc">
            자재의 입출고 내역을 조회하고 관리하세요.
          </p>
        </div>

        <button
          className="stock-add-btn"
          onClick={() => navigate("/stock/write")}
        >
          <FiPlus />
          입출고 등록
        </button>
      </div>

      <div className="stock-stat-grid">
        <StatCard
          icon={<FiArchive />}
          title="전체 내역"
          value="1,248"
          unit="건"
        />
        <StatCard icon={<FiArrowDown />} title="입고" value="752" unit="건" />
        <StatCard icon={<FiArrowUp />} title="출고" value="496" unit="건" out />
        <StatCard icon={<FiBox />} title="금일 처리" value="8" unit="건" />
      </div>

      <div className="stock-layout">
        <section className="stock-main">
          <div className="stock-toolbar">
            <div className="stock-search">
              <input placeholder="자재명, 현장명, 발주번호 검색..." />
              <FiSearch />
            </div>

            <select>
              <option>전체 구분</option>
              <option>입고</option>
              <option>출고</option>
            </select>

            <select>
              <option>전체 자재</option>
              <option>철근 D13</option>
              <option>시멘트 40kg</option>
            </select>

            <select>
              <option>전체 현장</option>
              <option>강남 아파트 신축</option>
              <option>부산 상가 리모델링</option>
            </select>

            <button className="date-btn">
              기간 선택
              <FiCalendar />
            </button>
          </div>

          <table className="stock-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>구분</th>
                <th>자재명</th>
                <th>공사현장</th>
                <th>발주번호</th>
                <th>수량</th>
                <th>처리일</th>
                <th>담당자</th>
                <th>메모</th>
              </tr>
            </thead>

            <tbody>
              {stockItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <span
                      className={
                        item.type === "입고"
                          ? "stock-badge in"
                          : "stock-badge out"
                      }
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="stock-material-name">{item.materialName}</td>
                  <td>{item.siteName}</td>
                  <td>{item.orderNo}</td>
                  <td>
                    <strong
                      className={item.type === "입고" ? "qty-in" : "qty-out"}
                    >
                      {item.type === "입고" ? "+" : "-"}
                      {item.quantity} {item.unit}
                    </strong>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.contactName}</td>
                  <td>{item.memo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button>
              <FiChevronLeft />
            </button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <button>
              <FiChevronRight />
            </button>
          </div>

          <div className="stock-bottom">
            <div className="stock-summary">
              <h3>입출고 요약</h3>
              <div className="summary-grid">
                <SummaryItem label="입고 수량" value="1,250" unit="EA" in />
                <SummaryItem label="출고 수량" value="980" unit="EA" out />
                <SummaryItem label="순 입출고" value="+270" unit="EA" />
                <SummaryItem label="총 처리 건수" value="128" unit="건" />
              </div>
            </div>

            <div className="stock-flow">
              <div className="flow-header">
                <h3>입출고 흐름</h3>
                <div>
                  <span className="legend in"></span> 입고
                  <span className="legend out"></span> 출고
                </div>
              </div>

              <div className="flow-chart">
                <div className="chart-line green"></div>
                <div className="chart-line orange"></div>
                <div className="chart-dates">
                  <span>06-04</span>
                  <span>06-05</span>
                  <span>06-06</span>
                  <span>06-07</span>
                  <span>06-08</span>
                  <span>06-09</span>
                  <span>06-10</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="stock-filter-panel">
          <div className="filter-card">
            <div className="filter-title">
              <h3>필터</h3>
              <button>초기화</button>
            </div>

            <FilterSelect label="구분" options={["전체", "입고", "출고"]} />
            <FilterSelect
              label="자재"
              options={["전체 자재", "철근 D13", "시멘트 40kg"]}
            />
            <FilterSelect
              label="공사현장"
              options={["전체 현장", "강남 아파트 신축", "부산 상가 리모델링"]}
            />
            <FilterSelect
              label="발주번호"
              options={["발주번호 선택", "PO-2024-128", "PO-2024-127"]}
            />

            <label className="filter-group">
              <span>처리일</span>
              <div className="date-range">
                <input placeholder="시작일" />
                <input placeholder="종료일" />
              </div>
            </label>

            <button className="filter-search-btn">
              <FiSearch />
              검색
            </button>
          </div>

          <div className="quick-filter-card">
            <h3>빠른 필터</h3>
            <div className="quick-grid">
              <button>오늘</button>
              <button>최근 7일</button>
              <button>최근 30일</button>
              <button>이번 달</button>
              <button>지난 달</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  unit,
  out,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  out?: boolean;
}) {
  return (
    <div className="stock-stat-card">
      <div className={out ? "stock-stat-icon out" : "stock-stat-icon"}>
        {icon}
      </div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="filter-group">
      <span>{label}</span>
      <select>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function SummaryItem({
  label,
  value,
  unit,
  in: isIn,
  out,
}: {
  label: string;
  value: string;
  unit: string;
  in?: boolean;
  out?: boolean;
}) {
  return (
    <div className="summary-item">
      <p>{label}</p>
      <strong className={isIn ? "summary-in" : out ? "summary-out" : ""}>
        {value}
      </strong>
      <span>{unit}</span>
    </div>
  );
}

export default StockInOutList;
