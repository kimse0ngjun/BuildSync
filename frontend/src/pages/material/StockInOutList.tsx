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
import type {
  InOutFilterParams,
  InOutResponse,
  SelectOption,
} from "../../types/InOut";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { inoutApi } from "../../api/inoutApi";
import StockInOutDetailModal from "./StockInOutDetailModal";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";
import NoAccess from "../../components/NoAccess";

function StockInOutList() {
  const navigate = useNavigate();
  const { isLogin } = useAuth();
  const companyType = localStorage.getItem("companyType");

  const myCompanyId = Number(localStorage.getItem("companyId"));

  const [inoutList, setInoutList] = useState<InOutResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [stats, setStats] = useState<{
    totalCount: number;
    inCount: number;
    outCount: number;
    todayCount: number;
    totalInQty: number;
    totalOutQty: number;
    netInOutQty: number;
    totalProcessedCount: number;
    chartData: any[];
  }>({
    totalCount: 0,
    inCount: 0,
    outCount: 0,
    todayCount: 0,
    totalInQty: 0,
    totalOutQty: 0,
    netInOutQty: 0,
    totalProcessedCount: 0,
    chartData: [],
  });

  const [filters, setFilters] = useState<
    Omit<InOutFilterParams, "companyId" | "page" | "size">
  >({
    type: "",
    materialId: undefined,
    siteId: undefined,
    orderId: undefined,
    startDate: "",
    endDate: "",
    keyword: "",
  });
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageSize = 10;

  const [materialOptions, setMaterialOptions] = useState<SelectOption[]>([]);
  const [siteOptions, setSiteOptions] = useState<SelectOption[]>([]);
  const [orderOptions, setOrderOptions] = useState<SelectOption[]>([]);

  const startDateRef = useRef<HTMLInputElement>(null);

  // 모달
  const [selectedInout, setSelectedInout] = useState<InOutResponse | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  if (!isLogin) {
    return <LoginRequired />;
  }

  if (companyType !== "SUPPLIER") {
    return <NoAccess targetRoleName="공급업체" />;
  }

  useEffect(() => {
    Promise.all([inoutApi.getMaterials(), inoutApi.getSites()])
      .then(([mats, sites]) => {
        setMaterialOptions(mats);
        setSiteOptions(sites);
      })
      .catch((err) => console.error("자재/현장 옵션 로딩 실패:", err));
  }, []);

  useEffect(() => {
    if (myCompanyId) {
      inoutApi
        .getOrders(myCompanyId)
        .then((orders) => {
          setOrderOptions(orders);
        })
        .catch((err) => console.error("발주서 옵션 로딩 실패:", err));
    }
  }, [myCompanyId]);

  const fetchInoutDashboard = useCallback(() => {
    setIsLoading(true);
    const apiParams: InOutFilterParams = {
      companyId: myCompanyId,
      type: filters.type || undefined,
      materialId: filters.materialId || undefined,
      siteId: filters.siteId || undefined,
      orderId: filters.orderId || undefined,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined,
      keyword: filters.keyword || undefined,
      page: page,
      size: pageSize,
    };

    inoutApi
      .getInoutDashboard(apiParams)
      .then((res) => {
        if (res) {
          console.log("백엔드 수신 차트 데이터 구조 검증:", res.chartData);
          console.log("백엔드 리스트 확인", res.inOutList.list);
          const rawGroupList = res.inOutList?.list || [];
          const flattenedList: InOutResponse[] = [];

          rawGroupList.forEach((group: InOutResponse) => {
            if (group.items && group.items.length > 0) {
              group.items.forEach((item, index) => {
                flattenedList.push({
                  ...group,
                  stockInoutId: group.stockInoutId,
                  displayKey: `${group.stockInoutId}-${index}`,
                  items: [item],
                } as InOutResponse & { displayKey: string });
              });
            } else {
              flattenedList.push({
                ...group,
                displayKey: `${group.stockInoutId}-default`,
              } as InOutResponse & { displayKey: string });
            }
          });
          flattenedList.sort((a, b) => b.stockInoutId - a.stockInoutId);

          setInoutList(flattenedList);
          setTotalPages(res.inOutList?.totalPages || 1);

          setStats({
            totalCount: res.totalCount,
            inCount: res.inCount,
            outCount: res.outCount,
            todayCount: res.todayCount,
            totalInQty: res.totalInQty,
            totalOutQty: res.totalOutQty,
            netInOutQty: res.netInOutQty,
            totalProcessedCount: res.totalProcessedCount,
            chartData: res.chartData || [],
          });
        }
      })
      .catch((err) => console.error("입출고 대시보드 조회 실패:", err))
      .finally(() => setIsLoading(false));
  }, [myCompanyId, filters, page]);

  useEffect(() => {
    if (myCompanyId) fetchInoutDashboard();
  }, [fetchInoutDashboard, myCompanyId]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
    setPage(0);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, keyword: searchInput.trim() }));
    setPage(0);
  };

  const handleQuickFilter = (days: number | string) => {
    const end = new Date();
    const start = new Date();

    if (typeof days === "number") {
      start.setDate(end.getDate() - days);
    } else if (days === "today") {
      start.setHours(0, 0, 0, 0);
    } else if (days === "thisMonth") {
      start.setDate(1);
    } else if (days === "lastMonth") {
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      end.setDate(0);
    }

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    setFilters((prev) => ({
      ...prev,
      startDate: formatDate(start),
      endDate: formatDate(end),
    }));
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      type: "",
      materialId: undefined,
      siteId: undefined,
      startDate: "",
      endDate: "",
      keyword: "",
    });
    setSearchInput("");
    setPage(0);
  };

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
          title="전체 처리 내역"
          value={stats.totalCount.toLocaleString()}
          unit="건"
        />
        <StatCard
          icon={<FiArrowDown />}
          title="총 입고 건수"
          value={stats.inCount.toLocaleString()}
          unit="건"
        />
        <StatCard
          icon={<FiArrowUp />}
          title="총 출고 건수"
          value={stats.outCount.toLocaleString()}
          unit="건"
          out
        />
        <StatCard
          icon={<FiBox />}
          title="금일 실시간 처리"
          value={stats.todayCount.toLocaleString()}
          unit="건"
        />
      </div>

      <div className="stock-layout">
        <section className="stock-main">
          <div className="stock-toolbar">
            <form className="stock-search" onSubmit={handleSearchSubmit}>
              <input
                placeholder="자재명, 현장명, 메모 키워드 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="stock-search-submit-btn">
                <FiSearch />
              </button>
            </form>

            <select
              value={filters.type || ""}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">전체 구분</option>
              <option value="입고">입고</option>
              <option value="출고">출고</option>
            </select>

            <select
              value={filters.materialId || ""}
              onChange={(e) =>
                handleFilterChange("materialId", Number(e.target.value))
              }
            >
              <option value="">전체 자재</option>
              {materialOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={filters.siteId || ""}
              onChange={(e) =>
                handleFilterChange("siteId", Number(e.target.value))
              }
            >
              <option value="">전체 현장</option>
              {siteOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              className="date-btn"
              onClick={() => startDateRef.current?.showPicker()}
            >
              {filters.startDate ? `${filters.startDate} ~` : "기간 선택"}
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
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="stock-table-status-msg loading">
                    데이터를 실시간 로드 중입니다...
                  </td>
                </tr>
              ) : inoutList.length > 0 ? (
                inoutList.map((item) => {
                  const mainMaterial =
                    item.items?.[0]?.materialName || "품목 지정 없음";
                  const extraCount = (item.items?.length || 0) - 1;
                  const totalQty =
                    item.items?.reduce((acc, cur) => acc + cur.quantity, 0) ||
                    0;
                  const itemUnit = item.items?.[0]?.unit || "EA";

                  return (
                    <tr
                      key={(item as any).displayKey || item.stockInoutId}
                      onClick={() => {
                        setSelectedInout(item);
                        setIsDetailOpen(true);
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                      className="stock-table-row"
                    >
                      <td>{item.stockInoutId}</td>
                      <td>
                        <span
                          className={`stock-badge ${item.type === "입고" ? "in" : "out"}`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="stock-material-name">
                        {mainMaterial}{" "}
                        {extraCount > 0 && (
                          <span className="stock-material-extra-count">
                            외 {extraCount}건
                          </span>
                        )}
                      </td>
                      <td>{item.siteName || "-"}</td>
                      <td>{item.orderId ? `${item.orderId}` : "-"}</td>
                      <td>
                        <strong
                          className={
                            item.type === "입고" ? "qty-in" : "qty-out"
                          }
                        >
                          {item.type === "입고" ? "+" : "-"}
                          {totalQty.toLocaleString()} {itemUnit}
                        </strong>
                      </td>
                      <td>
                        {item.processedDate
                          ? item.processedDate.split("T")[0]
                          : "-"}
                      </td>
                      <td>{item.contactName || "-"}</td>
                      <td className="stock-table-memo-cell">
                        {item.memo || "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="stock-table-status-msg empty">
                    조회 조건에 부합하는 입출고 내역이 존재하지 않습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <FiChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={page === i ? "active" : ""}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
            >
              <FiChevronRight />
            </button>
          </div>

          <div className="stock-bottom">
            <div className="stock-summary">
              <h3>총 누적 자재 요약</h3>
              <div className="summary-grid">
                <SummaryItem
                  label="누적 입고량"
                  value={stats.totalInQty.toLocaleString()}
                  unit="EA"
                  in
                />
                <SummaryItem
                  label="누적 출고량"
                  value={stats.totalOutQty.toLocaleString()}
                  unit="EA"
                  out
                />
                <SummaryItem
                  label="순 재고 변동"
                  value={
                    (stats.netInOutQty >= 0 ? "+" : "") +
                    stats.netInOutQty.toLocaleString()
                  }
                  unit="EA"
                />
                <SummaryItem
                  label="총 처리건"
                  value={stats.totalProcessedCount.toLocaleString()}
                  unit="건"
                />
              </div>
            </div>

            <div className="stock-flow">
              <div className="flow-header">
                <h3>입출고 밸런스 흐름</h3>
                <div>
                  <span className="legend in"></span> 입고 흐름
                  <span className="legend out"></span> 출고 흐름
                </div>
              </div>

              <div className="flow-chart">
                {stats.chartData && stats.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart
                      data={stats.chartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#eef2f7"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        tickFormatter={(value) => {
                          if (!value) return "";
                          const parts = value.split("-");
                          return parts.length >= 3
                            ? `${parts[1]}/${parts[2]}`
                            : value;
                        }}
                      />
                      <YAxis hide={true} />
                      <Tooltip wrapperClassName="stock-chart-tooltip" />
                      <Line
                        type="monotone"
                        dataKey="inQuantity"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name="입고 수량"
                      />
                      <Line
                        type="monotone"
                        dataKey="outQuantity"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name="출고 수량"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="stock-flow-empty">
                    누적된 입출고 흐름 데이터가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="stock-filter-panel">
          <div className="filter-card">
            <div className="filter-title">
              <h3>정밀 필터</h3>
              <button onClick={handleResetFilters}>필터 초기화</button>
            </div>

            <FilterSelect
              label="구분 필터"
              value={filters.type || ""}
              options={[
                { value: "", label: "전체" },
                { value: "입고", label: "입고" },
                { value: "출고", label: "출고" },
              ]}
              onChange={(val) => handleFilterChange("type", val)}
            />
            <FilterSelect
              label="자재 타겟"
              value={filters.materialId || ""}
              options={[{ value: "", label: "전체 자재" }, ...materialOptions]}
              onChange={(val) =>
                handleFilterChange("materialId", val ? Number(val) : undefined)
              }
            />
            <FilterSelect
              label="발주서 선택"
              value={filters.orderId || ""}
              options={[{ value: "", label: "전체 발주서" }, ...orderOptions]}
              onChange={(val) =>
                handleFilterChange("orderId", val ? Number(val) : undefined)
              }
            />
            <FilterSelect
              label="공사 현장"
              value={filters.siteId || ""}
              options={[{ value: "", label: "전체 현장" }, ...siteOptions]}
              onChange={(val) =>
                handleFilterChange("siteId", val ? Number(val) : undefined)
              }
            />

            <label className="filter-group">
              <span>정밀 기간 검색</span>
              <div className="date-range">
                <input
                  ref={startDateRef}
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                />
              </div>
            </label>
          </div>

          <div className="quick-filter-card">
            <h3>빠른 기간 필터</h3>
            <div className="quick-grid">
              <button onClick={() => handleQuickFilter("today")}>오늘</button>
              <button onClick={() => handleQuickFilter(7)}>최근 7일</button>
              <button onClick={() => handleQuickFilter(30)}>최근 30일</button>
              <button onClick={() => handleQuickFilter("thisMonth")}>
                이번 달
              </button>
              <button onClick={() => handleQuickFilter("lastMonth")}>
                지난 달
              </button>
            </div>
          </div>
        </aside>
      </div>

      <StockInOutDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedInout(null);
        }}
        data={selectedInout}
      />
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
  value,
  options,
  onChange,
}: {
  label: string;
  value: any;
  options: any[];
  onChange: (val: string) => void;
}) {
  return (
    <label className="filter-group">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt, index) => {
          const optValue =
            typeof opt === "object" && opt !== null ? opt.value : opt;
          const optLabel =
            typeof opt === "object" && opt !== null ? opt.label : opt;

          return (
            <option key={`${optValue}-${index}`} value={optValue}>
              {optLabel}{" "}
            </option>
          );
        })}
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
