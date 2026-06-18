import { useEffect, useState } from "react";
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

type MaterialItem = {
  id?: number;
  materialId?: number;
  supMaterialId?: number;
  materialCode: string;
  materialName: string;
  materialCategory: string;
  currentQuantity: number;
  minimumQuantity: number;
  unit: string;
  unitPrice: number;
  status: string;
  supplierName: string;
  specification: string;
  createdAt: string;
};

type MaterialListResponse = {
  totalMaterialCount: number;
  normalStockCount: number;
  shortageStockCount: number;
  incomingCount: number;
  currentPage?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  materials: MaterialItem[];
};

type CategoryItem = {
  categoryId: number;
  categoryName: string;
  createdAt: string;
};

function MaterialList() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"all" | "my">("all");
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selected, setSelected] = useState<MaterialItem | null>(null);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [summary, setSummary] = useState({
    totalMaterialCount: 0,
    normalStockCount: 0,
    shortageStockCount: 0,
    incomingCount: 0,
  });

  const [loading, setLoading] = useState(false);

  const filteredMaterials = materials;
  const size = 10;

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert(
        "토큰이 없습니다. Postman에서 받은 토큰을 localStorage에 저장해주세요.",
      );
      return null;
    }

    return token;
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) return;

      const baseUrl =
        tab === "all"
          ? "http://localhost:8080/api/materials"
          : "http://localhost:8080/api/company-materials";

      const params = new URLSearchParams({
        keyword,
        category,
        status,
        page: String(page),
        size: String(size),
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("자재 목록 조회 실패");
      }

      const data: MaterialListResponse = await response.json();

      setMaterials(data.materials);
      setSummary({
        totalMaterialCount: data.totalMaterialCount,
        normalStockCount: data.normalStockCount,
        shortageStockCount: data.shortageStockCount,
        incomingCount: data.incomingCount,
      });
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      console.error(error);
      alert("자재 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        "http://localhost:8080/api/material-categories",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("카테고리 목록 조회 실패");
      }

      const data: CategoryItem[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelected(null);
    fetchMaterials();
  }, [tab, page, category, status]);

  const handleSearch = () => {
    setSelected(null);
    setPage(0);
    fetchMaterials();
  };

  const handleTabChange = (nextTab: "all" | "my") => {
    setTab(nextTab);
    setPage(0);
    setSelected(null);
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

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
        <StatCard
          icon={<FiBox />}
          title="전체 자재"
          value={summary.totalMaterialCount}
          unit="개"
        />
        <StatCard
          icon={<FiCheckCircle />}
          title="정상 재고"
          value={summary.normalStockCount}
          unit="개"
        />
        <StatCard
          icon={<FiAlertTriangle />}
          title="부족 재고"
          value={summary.shortageStockCount}
          unit="개"
          warning
        />
        <StatCard
          icon={<FiTruck />}
          title="입고 예정"
          value={summary.incomingCount}
          unit="건"
        />
      </div>

      <div className="material-layout">
        <section className="material-main">
          <div className="material-tabs">
            <button
              className={tab === "all" ? "active" : ""}
              onClick={() => handleTabChange("all")}
            >
              전체 자재
            </button>
            <button
              className={tab === "my" ? "active" : ""}
              onClick={() => handleTabChange("my")}
            >
              내 회사 자재
            </button>
          </div>

          <div className="material-toolbar">
            <div className="material-search">
              <input
                placeholder="자재명, 코드, 규격 검색..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <FiSearch onClick={handleSearch} />
            </div>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(0);
              }}
            >
              <option value="">전체 분류</option>
              {categories.map((item) => (
                <option key={item.categoryId} value={item.categoryName}>
                  {item.categoryName}
                </option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
            >
              <option value="">전체 상태</option>
              <option value="정상">정상</option>
              <option value="부족">부족</option>
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
              {loading ? (
                <tr>
                  <td colSpan={9}>자재 목록을 불러오는 중입니다.</td>
                </tr>
              ) : filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={9}>등록된 자재가 없습니다.</td>
                </tr>
              ) : (
                filteredMaterials.map((item, index) => (
                  <tr
                    key={`${item.materialCode}-${index}`}
                    onClick={() => setSelected(item)}
                    className={
                      selected?.materialId === item.materialId &&
                      selected?.materialCode === item.materialCode
                        ? "selected-row"
                        : ""
                    }
                  >
                    <td>{item.materialCode}</td>
                    <td className="material-name">{item.materialName}</td>
                    <td>{item.materialCategory}</td>
                    <td>{item.currentQuantity}</td>
                    <td>{item.minimumQuantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.unitPrice.toLocaleString()}</td>
                    <td>
                      <span
                        className={
                          item.status === "정상"
                            ? "status normal"
                            : "status low"
                        }
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.supplierName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={handlePrevPage} disabled={page === 0}>
              <FiChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={page === index ? "active" : ""}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </button>
            ))}

            <button onClick={handleNextPage} disabled={page >= totalPages - 1}>
              <FiChevronRight />
            </button>
          </div>
        </section>

        {selected && (
          <aside className="material-detail-panel">
            <div className="panel-header">
              <h3>자재 상세 정보</h3>
              <button onClick={() => setSelected(null)}>
                <FiX />
              </button>
            </div>

            <div className="selected-material">
              <div className="material-thumb">▥</div>
              <div>
                <h2>{selected.materialName}</h2>
                <span
                  className={
                    selected.status === "정상" ? "status normal" : "status low"
                  }
                >
                  {selected.status}
                </span>
                <p>
                  {selected.materialCode} · {selected.materialCategory}
                </p>
              </div>
            </div>

            <div className="detail-list">
              <Info
                label="현재 재고"
                value={`${selected.currentQuantity} ${selected.unit}`}
              />
              <Info
                label="최소 재고"
                value={`${selected.minimumQuantity} ${selected.unit}`}
              />
              <Info
                label="단가"
                value={`${selected.unitPrice.toLocaleString()} 원`}
              />
              <Info label="단위" value={selected.unit} />
              <Info label="분류" value={selected.materialCategory} />
              <Info label="공급업체" value={selected.supplierName} />
            </div>

            <div className="panel-actions">
              <button>수정</button>
            </div>
          </aside>
        )}
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

export default MaterialList;
