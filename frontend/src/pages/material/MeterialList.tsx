import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiBox,
  FiCheckCircle,
  FiAlertTriangle,
  FiTruck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "../../styles/MaterialList.css";

const materials = [
  {
    code: "MAT-001",
    name: "철근 D13",
    category: "철강",
    stock: 120,
    min: 50,
    unit: "EA",
    price: "30,000",
    status: "정상",
    supplier: "대한자재",
    isMyCompany: true,
  },
  {
    code: "MAT-002",
    name: "시멘트 40kg",
    category: "시멘트",
    stock: 20,
    min: 50,
    unit: "포",
    price: "12,000",
    status: "부족",
    supplier: "쌍용양회",
    isMyCompany: false,
  },
  {
    code: "MAT-003",
    name: "유리 5T",
    category: "유리",
    stock: 80,
    min: 30,
    unit: "EA",
    price: "25,000",
    status: "정상",
    supplier: "대한자재",
    isMyCompany: true,
  },
  {
    code: "MAT-004",
    name: "벽돌",
    category: "건축자재",
    stock: 15,
    min: 30,
    unit: "EA",
    price: "5,000",
    status: "부족",
    supplier: "벽돌마트",
    isMyCompany: false,
  },
  {
    code: "MAT-005",
    name: "목재 2x4",
    category: "목재",
    stock: 60,
    min: 40,
    unit: "EA",
    price: "8,500",
    status: "정상",
    supplier: "대한자재",
    isMyCompany: true,
  },
  {
    code: "MAT-006",
    name: "페인트 18L",
    category: "도장재",
    stock: 35,
    min: 20,
    unit: "통",
    price: "45,000",
    status: "정상",
    supplier: "삼화페인트",
    isMyCompany: false,
  },
  {
    code: "MAT-007",
    name: "전선 2.5sq",
    category: "전기자재",
    stock: 100,
    min: 50,
    unit: "롤",
    price: "70,000",
    status: "정상",
    supplier: "대한전선",
    isMyCompany: false,
  },
  {
    code: "MAT-008",
    name: "배관 PVC 50A",
    category: "배관자재",
    stock: 25,
    min: 30,
    unit: "EA",
    price: "3,500",
    status: "부족",
    supplier: "대한자재",
    isMyCompany: true,
  },
];

function MaterialList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | "my">("all");

  const filteredMaterials =
    tab === "all" ? materials : materials.filter((item) => item.isMyCompany);

  const selected = filteredMaterials[0] ?? materials[0];

  return (
    <div className="material-page">
      <div className="material-header">
        <div>
          <p className="material-page-label">자재 관리</p>
          <h1>자재 목록</h1>
          <p className="material-page-desc">
            보유 자재 현황 및 재고를 관리하세요.
          </p>
        </div>

        <button
          className="material-add-btn"
          onClick={() => navigate("/material/write")}
        >
          <FiPlus />
          자재 등록
        </button>
      </div>

      <div className="material-stat-grid">
        <StatCard icon={<FiBox />} title="전체 자재" value="152" unit="개" />
        <StatCard
          icon={<FiCheckCircle />}
          title="정상 재고"
          value="128"
          unit="개"
        />
        <StatCard
          icon={<FiAlertTriangle />}
          title="부족 재고"
          value="12"
          unit="개"
          warning
        />
        <StatCard icon={<FiTruck />} title="입고 예정" value="8" unit="건" />
      </div>

      <div className="material-layout">
        <section className="material-main">
          <div className="material-tabs">
            <button
              className={tab === "all" ? "active" : ""}
              onClick={() => setTab("all")}
            >
              전체 자재
            </button>
            <button
              className={tab === "my" ? "active" : ""}
              onClick={() => setTab("my")}
            >
              내 회사 자재
            </button>
          </div>

          <div className="material-toolbar">
            <div className="material-search">
              <input placeholder="자재명, 코드, 규격 검색..." />
              <FiSearch />
            </div>

            <select>
              <option>전체 분류</option>
              <option>철강</option>
              <option>시멘트</option>
              <option>유리</option>
            </select>

            <select>
              <option>전체 상태</option>
              <option>정상</option>
              <option>부족</option>
            </select>
          </div>

          <table className="material-table">
            <thead>
              <tr>
                <th>자재 코드</th>
                <th>자재명</th>
                <th>분류</th>
                <th>현재 재고</th>
                <th>최소 재고</th>
                <th>단위</th>
                <th>단가</th>
                <th>상태</th>
                <th>{tab === "all" ? "공급업체" : "관리 업체"}</th>
              </tr>
            </thead>

            <tbody>
              {filteredMaterials.map((item) => (
                <tr key={item.code}>
                  <td>{item.code}</td>
                  <td className="material-name">{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.stock}</td>
                  <td>{item.min}</td>
                  <td>{item.unit}</td>
                  <td>{item.price}</td>
                  <td>
                    <span
                      className={
                        item.status === "정상" ? "status normal" : "status low"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.supplier}</td>
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
        </section>

        <aside className="material-detail-panel">
          <div className="panel-header">
            <h3>자재 상세 정보</h3>
            <button>
              <FiX />
            </button>
          </div>

          <div className="selected-material">
            <div className="material-thumb">▥</div>
            <div>
              <h2>{selected.name}</h2>
              <span
                className={
                  selected.status === "정상" ? "status normal" : "status low"
                }
              >
                {selected.status}
              </span>
              <p>
                {selected.code} · {selected.category}
              </p>
            </div>
          </div>

          <div className="detail-list">
            <Info
              label="현재 재고"
              value={`${selected.stock} ${selected.unit}`}
            />
            <Info
              label="최소 재고"
              value={`${selected.min} ${selected.unit}`}
            />
            <Info label="단가" value={`${selected.price} 원`} />
            <Info label="단위" value={selected.unit} />
            <Info label="분류" value={selected.category} />
            <Info label="공급업체" value={selected.supplier} />
          </div>

          <div className="stock-history">
            <div className="history-title">
              <h4>최근 입출고 내역</h4>
              <button>더보기</button>
            </div>

            <History date="2024-06-10" type="입고" amount="+50 EA" positive />
            <History date="2024-06-08" type="출고" amount="-30 EA" />
            <History date="2024-06-05" type="입고" amount="+100 EA" positive />
          </div>

          <div className="panel-actions">
            <button className="primary">입고 처리</button>
            <button>출고 처리</button>
            <button>수정</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, unit, warning }: any) {
  return (
    <div className="stat-card">
      <div className={warning ? "stat-icon warning" : "stat-icon"}>{icon}</div>
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
    <div className="detail-info-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function History({ date, type, amount, positive }: any) {
  return (
    <div className="history-row">
      <span>{date}</span>
      <span>{type}</span>
      <strong className={positive ? "positive" : "negative"}>{amount}</strong>
    </div>
  );
}

export default MaterialList;
