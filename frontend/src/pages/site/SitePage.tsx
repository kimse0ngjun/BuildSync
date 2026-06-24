import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";
import {
  FiPlus,
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { siteApi } from "../../api/siteApi";
import "../../styles/SitePage.css";

type Site = {
  id: number;
  siteName: string;
  constructionType: string;
  address: string;
  cost: number;
  status: string;
  startDate: string;
  expectedEndDate: string;
};

type SiteResponse = {
  totalSiteCount: number;
  progressCount: number;
  plannedCount: number;
  completedCount: number;
  currentPage?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  sites: Site[];
};

function SitePage() {
  const [keyword, setKeyword] = useState("");
  const [constructionType, setConstructionType] = useState("");
  const [status, setStatus] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [selected, setSelected] = useState<Site | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { isLogin } = useAuth();

  const [summary, setSummary] = useState({
    totalSiteCount: 0,
    progressCount: 0,
    plannedCount: 0,
    completedCount: 0,
  });

  const navigate = useNavigate();

  const getProgress = (site: Site) => {
    if (site.status === "완료") return 100;

    const today = new Date();
    const start = new Date(site.startDate);
    const end = new Date(site.expectedEndDate);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (today < start) return 0;
    if (today >= end) return 100;

    const total = end.getTime() - start.getTime();
    const passed = today.getTime() - start.getTime();

    return Math.round((passed / total) * 100);
  };

  const getDisplayStatus = (site: Site) => {
    const progress = getProgress(site);

    if (site.status === "완료" || progress === 100) return "완료";
    if (progress === 0) return "예정";
    return "진행중";
  };

  const getStatusClass = (site: Site) => {
    const displayStatus = getDisplayStatus(site);

    return displayStatus === "진행중"
      ? "site-status progress"
      : displayStatus === "완료"
        ? "site-status done"
        : "site-status ready";
  };

  const fetchSites = async () => {
    try {
      const data: SiteResponse = await siteApi.getSites({
        keyword,
        constructionType,
        status,
        page,
        size: 10,
      });

      setSites(data.sites ?? []);
      setSummary({
        totalSiteCount: data.totalSiteCount,
        progressCount: data.progressCount,
        plannedCount: data.plannedCount,
        completedCount: data.completedCount,
      });
      setTotalPages(data.totalPages ?? 1);
      setSelected(null);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isLogin) return;

    fetchSites();
  }, [isLogin, page, constructionType, status]);

  if (!isLogin) {
    return <LoginRequired />;
  }

  const handleSearch = () => {
    setPage(0);
    setSelected(null);
    fetchSites();
  };

  const handleDelete = async (siteId: number) => {
    if (!window.confirm("공사 현장을 삭제하시겠습니까?")) return;

    try {
      await siteApi.deleteSite(siteId);

      alert("공사 현장이 삭제되었습니다.");
      setSelected(null);
      fetchSites();
    } catch (error) {
      console.error(error);
      alert("공사 현장 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="site-page">
      <div className="site-header">
        <div>
          <p className="site-page-label">현장 관리</p>
          <h1>공사 현장 관리</h1>
          <p className="site-page-desc">
            공사 현장 정보와 진행 상태를 조회하고 관리하세요.
          </p>
        </div>

        <button
          className="site-add-btn"
          onClick={() => navigate("/site/create")}
        >
          <FiPlus />
          현장 등록
        </button>
      </div>

      <div className="site-stat-grid">
        <StatCard
          icon={<FiMapPin />}
          title="전체 현장"
          value={String(summary.totalSiteCount)}
          unit="개"
        />
        <StatCard
          icon={<FiClock />}
          title="진행중"
          value={String(summary.progressCount)}
          unit="개"
        />
        <StatCard
          icon={<FiCalendar />}
          title="예정"
          value={String(summary.plannedCount)}
          unit="개"
        />
        <StatCard
          icon={<FiCheckCircle />}
          title="완료"
          value={String(summary.completedCount)}
          unit="개"
        />
      </div>

      <div className="site-layout">
        <section className="site-main">
          <div className="site-toolbar">
            <div className="site-search">
              <input
                placeholder="현장명, 주소, 공사 유형 검색..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <FiSearch onClick={handleSearch} />
            </div>

            <select
              value={constructionType}
              onChange={(e) => {
                setConstructionType(e.target.value);
                setPage(0);
                setSelected(null);
              }}
            >
              <option value="">전체 공사 유형</option>
              <option value="건축">건축</option>
              <option value="토목">토목</option>
              <option value="플랜트">플랜트</option>
              <option value="전기">전기</option>
              <option value="통신">통신</option>
              <option value="조경">조경</option>
              <option value="리모델링">리모델링</option>
              <option value="증축">증축</option>
              <option value="철거">철거</option>
              <option value="기타">기타</option>
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
                setSelected(null);
              }}
            >
              <option value="">전체 상태</option>
              <option value="예정">예정</option>
              <option value="진행중">진행중</option>
              <option value="완료">완료</option>
            </select>
          </div>

          <table className="site-table">
            <thead>
              <tr>
                <th>현장명</th>
                <th>공사 유형</th>
                <th>주소</th>
                <th>비용</th>
                <th>착공일</th>
                <th>준공 예정일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {sites.map((site) => (
                <tr key={site.id} onClick={() => setSelected(site)}>
                  <td className="site-name">{site.siteName}</td>
                  <td>{site.constructionType}</td>
                  <td>{site.address}</td>
                  <td>{site.cost.toLocaleString()}원</td>
                  <td>{site.startDate}</td>
                  <td>{site.expectedEndDate}</td>
                  <td>
                    <span className={getStatusClass(site)}>
                      {getDisplayStatus(site)}
                    </span>
                  </td>
                  <td>
                    <div className="site-actions">
                      <button
                        className="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/site/edit/${site.id}`, {
                            state: site,
                          });
                        }}
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        className="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(site.id);
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="site-pagination">
            <button
              onClick={() => {
                if (page > 0) {
                  setPage(page - 1);
                  setSelected(null);
                }
              }}
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
              onClick={() => {
                if (page < totalPages - 1) {
                  setPage(page + 1);
                  setSelected(null);
                }
              }}
              disabled={page >= totalPages - 1}
            >
              <FiChevronRight />
            </button>
          </div>
        </section>

        {selected && (
          <aside className="site-detail-panel">
            <div className="site-detail-header">
              <h3>현장 상세 정보</h3>
              <button type="button" onClick={() => setSelected(null)}>
                <FiX />
              </button>
            </div>

            <div className="site-detail-top">
              <div className="site-detail-icon">
                <FiMapPin />
              </div>
              <div>
                <h2>{selected.siteName}</h2>
                <span className={getStatusClass(selected)}>
                  {getDisplayStatus(selected)}
                </span>
                <p>{selected.constructionType}</p>
              </div>
            </div>

            <div className="site-detail-list">
              <Info label="현장 주소" value={selected.address} />
              <Info
                label="공사 비용"
                value={`${selected.cost.toLocaleString()}원`}
              />
              <Info label="착공일" value={selected.startDate} />
              <Info label="준공 예정일" value={selected.expectedEndDate} />
              <Info label="공사 상태" value={getDisplayStatus(selected)} />
            </div>

            <div className="site-progress-box">
              <div className="progress-title">
                <span>공정 진행률</span>
                <strong>{getProgress(selected)}%</strong>
              </div>
              <div className="progress-bar">
                <div style={{ width: `${getProgress(selected)}%` }}></div>
              </div>
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
    <div className="site-stat-card">
      <div className="site-stat-icon">{icon}</div>
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
    <div className="site-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default SitePage;
