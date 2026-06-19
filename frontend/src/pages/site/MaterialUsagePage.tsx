import { useEffect, useState } from "react";
import {
  FiSearch,
  FiBox,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import "../../styles/MaterialUsagePage.css";

type Usage = {
  stockInoutId: number;
  siteId: number;
  siteName: string;
  materialId: number;
  materialCode: string;
  materialName: string;
  materialCategory: string;
  unit: string;
  quantity: number;
  contactId: number;
  contactName: string;
  processedDate: string;
  memo: string;
};

type UsageResponse = {
  totalUsageCount: number;
  usedMaterialCount: number;
  usedSiteCount: number;
  contactCount: number;
  currentPage?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  usages: Usage[];
};

function MaterialUsagePage() {
  const [search, setSearch] = useState("");
  const [siteId, setSiteId] = useState("");
  const [materialId, setMaterialId] = useState("");

  const [usages, setUsages] = useState<Usage[]>([]);
  const [allUsages, setAllUsages] = useState<Usage[]>([]);
  const [selected, setSelected] = useState<Usage | null>(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalUsageCount: 0,
    usedMaterialCount: 0,
    usedSiteCount: 0,
    contactCount: 0,
  });

  const size = 10;

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("토큰이 없습니다. localStorage에 token을 저장해주세요.");
      return null;
    }

    return token;
  };

  const fetchAllOptions = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        "http://localhost:8080/api/site-material-usages?page=0&size=1000",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("전체 옵션 조회 실패");
      }

      const data: UsageResponse = await response.json();
      setAllUsages(data.usages ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsages = async () => {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) return;

      const params = new URLSearchParams({
        keyword: search,
        page: String(page),
        size: String(size),
      });

      if (siteId) {
        params.append("siteId", siteId);
      }

      if (materialId) {
        params.append("materialId", materialId);
      }

      const response = await fetch(
        `http://localhost:8080/api/site-material-usages?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("자재 사용내역 조회 실패");
      }

      const data: UsageResponse = await response.json();

      setUsages(data.usages ?? []);
      setSummary({
        totalUsageCount: data.totalUsageCount,
        usedMaterialCount: data.usedMaterialCount,
        usedSiteCount: data.usedSiteCount,
        contactCount: data.contactCount,
      });
      setTotalPages(data.totalPages ?? 1);
      setSelected(null);
    } catch (error) {
      console.error(error);
      alert("자재 사용내역을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOptions();
  }, []);

  useEffect(() => {
    fetchUsages();
  }, [page, siteId, materialId]);

  const handleSearch = () => {
    setPage(0);
    setSelected(null);
    fetchUsages();
  };

  const siteOptions = Array.from(
    new Map(allUsages.map((item) => [item.siteId, item.siteName])),
  );

  const materialOptions = Array.from(
    new Map(allUsages.map((item) => [item.materialId, item.materialName])),
  );

  return (
    <div className="material-usage-page">
      <div className="usage-header">
        <div>
          <p className="usage-page-label">현장 관리</p>
          <h1>자재 사용 현황</h1>
          <p className="usage-page-desc">
            공사 현장별 자재 사용 내역과 담당자를 조회하고 관리하세요.
          </p>
        </div>
      </div>

      <div className="usage-stat-grid">
        <StatCard
          icon={<FiBox />}
          title="전체 사용 내역"
          value={String(summary.totalUsageCount)}
          unit="건"
        />
        <StatCard
          icon={<FiPackage />}
          title="사용 자재"
          value={String(summary.usedMaterialCount)}
          unit="종"
        />
        <StatCard
          icon={<FiMapPin />}
          title="사용 현장"
          value={String(summary.usedSiteCount)}
          unit="개"
        />
        <StatCard
          icon={<FiUser />}
          title="담당자"
          value={String(summary.contactCount)}
          unit="명"
        />
      </div>

      <div className="usage-layout">
        <section className="usage-main">
          <div className="usage-toolbar">
            <div className="usage-search">
              <input
                placeholder="현장명, 자재명, 담당자 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <FiSearch onClick={handleSearch} />
            </div>

            <select
              value={siteId}
              onChange={(e) => {
                setSiteId(e.target.value);
                setPage(0);
                setSelected(null);
              }}
            >
              <option value="">전체 현장</option>
              {siteOptions.map(([id, name]) => (
                <option key={id} value={String(id)}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={materialId}
              onChange={(e) => {
                setMaterialId(e.target.value);
                setPage(0);
                setSelected(null);
              }}
            >
              <option value="">전체 자재</option>
              {materialOptions.map(([id, name]) => (
                <option key={id} value={String(id)}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <table className="usage-table">
            <thead>
              <tr>
                <th>사용일</th>
                <th>현장명</th>
                <th>자재명</th>
                <th>수량</th>
                <th>단위</th>
                <th>담당자</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>자재 사용내역을 불러오는 중입니다.</td>
                </tr>
              ) : usages.length === 0 ? (
                <tr>
                  <td colSpan={6}>등록된 사용내역이 없습니다.</td>
                </tr>
              ) : (
                usages.map((item) => (
                  <tr key={item.stockInoutId} onClick={() => setSelected(item)}>
                    <td>{item.processedDate}</td>
                    <td className="usage-site-name">{item.siteName}</td>
                    <td className="usage-material-name">{item.materialName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.contactName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="usage-pagination">
            <button
              onClick={() => page > 0 && setPage(page - 1)}
              disabled={page === 0}
            >
              <FiChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={page === index ? "active" : ""}
                onClick={() => {
                  setPage(index);
                  setSelected(null);
                }}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => page < totalPages - 1 && setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              <FiChevronRight />
            </button>
          </div>
        </section>

        {selected && (
          <aside className="usage-detail-panel">
            <div className="usage-detail-header">
              <h3>사용 상세 정보</h3>
              <button type="button" onClick={() => setSelected(null)}>
                <FiX />
              </button>
            </div>

            <div className="usage-detail-top">
              <div className="usage-detail-icon">
                <FiBox />
              </div>
              <div>
                <h2>{selected.materialName}</h2>
                <p>{selected.siteName}</p>
              </div>
            </div>

            <div className="usage-detail-list">
              <Info label="사용일" value={selected.processedDate} />
              <Info label="사용 현장" value={selected.siteName} />
              <Info label="자재 코드" value={selected.materialCode} />
              <Info label="자재명" value={selected.materialName} />
              <Info label="분류" value={selected.materialCategory} />
              <Info
                label="사용 수량"
                value={`${selected.quantity} ${selected.unit}`}
              />
              <Info label="담당자" value={selected.contactName} />
              <Info label="메모" value={selected.memo || "-"} />
            </div>

            <div className="usage-mini-card">
              <div>
                <FiCalendar />
                <span>최근 사용일</span>
              </div>
              <strong>{selected.processedDate}</strong>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  unit,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="usage-stat-card">
      <div className="usage-stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="usage-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default MaterialUsagePage;
