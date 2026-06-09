import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "../../styles/SitePage.css";

const sites = [
  {
    id: 1,
    name: "강남 오피스 신축",
    type: "오피스",
    address: "서울특별시 강남구 테헤란로 120",
    cost: "1,250,000,000",
    status: "진행중",
    startDate: "2026-06-01",
    endDate: "2026-12-31",
  },
  {
    id: 2,
    name: "송도 아파트 건설",
    type: "아파트",
    address: "인천광역시 연수구 송도동 88",
    cost: "3,800,000,000",
    status: "진행중",
    startDate: "2026-05-01",
    endDate: "2027-03-31",
  },
  {
    id: 3,
    name: "부산 상가 리모델링",
    type: "상가",
    address: "부산광역시 부산진구 중앙대로 708",
    cost: "420,000,000",
    status: "예정",
    startDate: "2026-07-10",
    endDate: "2026-10-20",
  },
  {
    id: 4,
    name: "판교 오피스 건설",
    type: "오피스",
    address: "경기도 성남시 분당구 판교로 255",
    cost: "2,100,000,000",
    status: "완료",
    startDate: "2025-11-01",
    endDate: "2026-05-30",
  },
];

function SitePage() {
  const [keyword, setKeyword] = useState("");
  const selected = sites[0];
  const navigate = useNavigate();

  const filteredSites = sites.filter(
    (site) =>
      site.name.includes(keyword) ||
      site.address.includes(keyword) ||
      site.type.includes(keyword),
  );

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
        <StatCard icon={<FiMapPin />} title="전체 현장" value="24" unit="개" />
        <StatCard icon={<FiClock />} title="진행중" value="12" unit="개" />
        <StatCard icon={<FiCalendar />} title="예정" value="7" unit="개" />
        <StatCard icon={<FiCheckCircle />} title="완료" value="5" unit="개" />
      </div>

      <div className="site-layout">
        <section className="site-main">
          <div className="site-toolbar">
            <div className="site-search">
              <input
                placeholder="현장명, 주소, 공사 유형 검색..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <FiSearch />
            </div>

            <select>
              <option>전체 유형</option>
              <option>오피스</option>
              <option>아파트</option>
              <option>상가</option>
            </select>

            <select>
              <option>전체 상태</option>
              <option>예정</option>
              <option>진행중</option>
              <option>완료</option>
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
              {filteredSites.map((site) => (
                <tr key={site.id}>
                  <td className="site-name">{site.name}</td>
                  <td>{site.type}</td>
                  <td>{site.address}</td>
                  <td>{site.cost}원</td>
                  <td>{site.startDate}</td>
                  <td>{site.endDate}</td>
                  <td>
                    <span
                      className={
                        site.status === "진행중"
                          ? "site-status progress"
                          : site.status === "완료"
                            ? "site-status done"
                            : "site-status ready"
                      }
                    >
                      {site.status}
                    </span>
                  </td>
                  <td>
                    <div className="site-actions">
                      <button
                        className="edit"
                        onClick={() =>
                          navigate(`/site/edit/${site.id}`, {
                            state: site,
                          })
                        }
                      >
                        <FiEdit3 />
                      </button>
                      <button className="delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="site-pagination">
            <button>
              <FiChevronLeft />
            </button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>
              <FiChevronRight />
            </button>
          </div>
        </section>

        <aside className="site-detail-panel">
          <h3>현장 상세 정보</h3>

          <div className="site-detail-top">
            <div className="site-detail-icon">
              <FiMapPin />
            </div>
            <div>
              <h2>{selected.name}</h2>
              <span className="site-status progress">{selected.status}</span>
              <p>{selected.type}</p>
            </div>
          </div>

          <div className="site-detail-list">
            <Info label="현장 주소" value={selected.address} />
            <Info label="공사 비용" value={`${selected.cost}원`} />
            <Info label="착공일" value={selected.startDate} />
            <Info label="준공 예정일" value={selected.endDate} />
            <Info label="공사 상태" value={selected.status} />
          </div>

          <div className="site-progress-box">
            <div className="progress-title">
              <span>공정 진행률</span>
              <strong>62%</strong>
            </div>
            <div className="progress-bar">
              <div></div>
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
