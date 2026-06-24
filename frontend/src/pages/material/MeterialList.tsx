import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";
import NoAccess from "../../components/NoAccess";
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
import { materialApi } from "../../api/materialApi";
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
  const { isLogin } = useAuth();

  const companyType = localStorage.getItem("companyType");
  const companyName = localStorage.getItem("companyName") ?? "";

  const isSupplier = companyType === "SUPPLIER" || companyType === "공급업체";
  const isConstruction =
    companyType === "CONSTRUCTION" || companyType === "건설업체";

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
  const size = 10;

  const getSelectedMaterialId = () => selected?.materialId ?? selected?.id;

  const fetchMaterials = async () => {
    if (tab === "my" && !isSupplier) {
      setMaterials([]);
      setSelected(null);
      return;
    }

    try {
      setLoading(true);

      const params = {
        keyword,
        category,
        status,
        page,
        size,
      };

      const data: MaterialListResponse =
        tab === "all"
          ? await materialApi.getAllMaterials(params)
          : await materialApi.getMaterials(params);

      setMaterials(data.materials ?? []);
      setSummary({
        totalMaterialCount: data.totalMaterialCount ?? 0,
        normalStockCount: data.normalStockCount ?? 0,
        shortageStockCount: data.shortageStockCount ?? 0,
        incomingCount: data.incomingCount ?? 0,
      });
      setTotalPages(data.totalPages ?? 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data: CategoryItem[] = await materialApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isLogin) return;
    fetchCategories();
  }, [isLogin]);

  useEffect(() => {
    if (!isLogin) return;

    setSelected(null);
    fetchMaterials();
  }, [isLogin, tab, page, category, status]);

  if (!isLogin) {
    return <LoginRequired />;
  }

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

  const handleDeleteMaterial = async () => {
    if (!selected) return;

    const materialId = getSelectedMaterialId();

    if (!materialId) {
      alert("자재 ID가 없습니다.");
      return;
    }

    if (!window.confirm(`${selected.materialName} 자재를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await materialApi.deleteCompanyMaterial(materialId);
      alert("자재가 삭제되었습니다.");
      setSelected(null);
      fetchMaterials();
    } catch (error) {
      console.error(error);
      alert("자재 삭제에 실패했습니다.");
    }
  };

  const canManageSelected =
    isSupplier && selected !== null && selected.supplierName === companyName;

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

        {isSupplier && (
          <button
            className="material-add-btn"
            onClick={() => navigate("/material/write")}
          >
            <FiPlus />
            자재 등록
          </button>
        )}
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

          {tab === "my" && isConstruction ? (
            <NoAccess targetRoleName="공급업체" />
          ) : (
            <>
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
                  ) : materials.length === 0 ? (
                    <tr>
                      <td colSpan={9}>등록된 자재가 없습니다.</td>
                    </tr>
                  ) : (
                    materials.map((item, index) => (
                      <tr
                        key={`${item.materialCode}-${index}`}
                        onClick={() => setSelected(item)}
                      >
                        <td>{item.materialCode}</td>
                        <td className="material-name">{item.materialName}</td>
                        <td>{item.materialCategory}</td>
                        <td>{item.currentQuantity ?? 0}</td>
                        <td>{item.minimumQuantity ?? 0}</td>
                        <td>{item.unit}</td>
                        <td>{(item.unitPrice ?? 0).toLocaleString()}</td>
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
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
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

                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                >
                  <FiChevronRight />
                </button>
              </div>
            </>
          )}
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
                value={`${selected.currentQuantity ?? 0} ${selected.unit}`}
              />
              <Info
                label="최소 재고"
                value={`${selected.minimumQuantity ?? 0} ${selected.unit}`}
              />
              <Info
                label="단가"
                value={`${(selected.unitPrice ?? 0).toLocaleString()} 원`}
              />
              <Info label="단위" value={selected.unit} />
              <Info label="분류" value={selected.materialCategory} />
              <Info label="공급업체" value={selected.supplierName} />
            </div>

            {canManageSelected && (
              <div className="panel-actions">
                <button
                  onClick={() =>
                    navigate(`/material/edit/${getSelectedMaterialId()}`)
                  }
                >
                  수정
                </button>
                <button onClick={handleDeleteMaterial}>삭제</button>
              </div>
            )}
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
