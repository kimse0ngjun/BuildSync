import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBox,
  FiMapPin,
  FiUser,
  FiEdit3,
  FiTrash2,
  FiCalendar,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "../../styles/MaterialUsagePage.css";

type Usage = {
  id: number;
  date: string;
  siteName: string;
  materialName: string;
  quantity: number;
  unit: string;
  manager: string;
  memo: string;
};

const initialUsages: Usage[] = [
  {
    id: 1,
    date: "2026-06-01",
    siteName: "강남 오피스 신축",
    materialName: "시멘트",
    quantity: 120,
    unit: "포대",
    manager: "홍길동",
    memo: "1차 타설용",
  },
  {
    id: 2,
    date: "2026-06-02",
    siteName: "송도 아파트 건설",
    materialName: "철근",
    quantity: 50,
    unit: "톤",
    manager: "김철수",
    memo: "기초 골조 작업",
  },
  {
    id: 3,
    date: "2026-06-04",
    siteName: "부산 상가 리모델링",
    materialName: "벽돌",
    quantity: 300,
    unit: "EA",
    manager: "이민호",
    memo: "외벽 보수",
  },
  {
    id: 4,
    date: "2026-06-05",
    siteName: "판교 오피스 건설",
    materialName: "페인트 18L",
    quantity: 12,
    unit: "통",
    manager: "박지훈",
    memo: "내부 도장",
  },
];

function MaterialUsagePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [usages, setUsages] = useState<Usage[]>(initialUsages);

  const filtered = usages.filter(
    (item) =>
      item.siteName.includes(search) ||
      item.materialName.includes(search) ||
      item.manager.includes(search),
  );

  const selected = filtered[0] || usages[0];

  const handleDelete = (id: number) => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;

    setUsages((prev) => prev.filter((item) => item.id !== id));
  };

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
          value="48"
          unit="건"
        />
        <StatCard icon={<FiPackage />} title="사용 자재" value="18" unit="종" />
        <StatCard icon={<FiMapPin />} title="사용 현장" value="7" unit="개" />
        <StatCard icon={<FiUser />} title="담당자" value="6" unit="명" />
      </div>

      <div className="usage-layout">
        <section className="usage-main">
          <div className="usage-toolbar">
            <div className="usage-search">
              <input
                placeholder="현장명, 자재명, 담당자 검색..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FiSearch />
            </div>

            <select>
              <option>전체 현장</option>
              <option>강남 오피스 신축</option>
              <option>송도 아파트 건설</option>
              <option>부산 상가 리모델링</option>
            </select>

            <select>
              <option>전체 자재</option>
              <option>시멘트</option>
              <option>철근</option>
              <option>벽돌</option>
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
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td className="usage-site-name">{item.siteName}</td>
                  <td className="usage-material-name">{item.materialName}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.manager}</td>
                  <td>
                    <div className="usage-actions">
                      <button
                        className="edit"
                        onClick={() =>
                          navigate(`/site/material/edit/${item.id}`)
                        }
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="usage-pagination">
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

        <aside className="usage-detail-panel">
          <h3>사용 상세 정보</h3>

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
            <Info label="사용일" value={selected.date} />
            <Info label="사용 현장" value={selected.siteName} />
            <Info
              label="사용 수량"
              value={`${selected.quantity} ${selected.unit}`}
            />
            <Info label="담당자" value={selected.manager} />
            <Info label="메모" value={selected.memo} />
          </div>

          <div className="usage-mini-card">
            <div>
              <FiCalendar />
              <span>최근 사용일</span>
            </div>
            <strong>{selected.date}</strong>
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
