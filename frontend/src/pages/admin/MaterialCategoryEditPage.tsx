import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiSave } from "react-icons/fi";
import adminApi from "../../api/adminApi";
import "../../styles/SiteEditPage.css";

type MaterialCategory = {
  categoryId: number;
  categoryName: string;
  createdAt: string;
};

function MaterialCategoryEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams();

  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stateData = location.state as MaterialCategory | undefined;

    if (stateData) {
      setCategoryName(stateData.categoryName);
      return;
    }

    const fetchCategory = async () => {
      try {
        const data: MaterialCategory[] = await adminApi.getMaterialCategories();
        const found = data.find(
          (item) => String(item.categoryId) === String(categoryId),
        );

        if (!found) {
          alert("카테고리 정보를 찾을 수 없습니다.");
          navigate("/dashboard");
          return;
        }

        setCategoryName(found.categoryName);
      } catch (error) {
        console.error(error);
        alert("카테고리 정보를 불러오지 못했습니다.");
        navigate("/dashboard");
      }
    };

    fetchCategory();
  }, [categoryId, location.state, navigate]);

  const handleSubmit = async () => {
    if (!categoryId) {
      alert("카테고리 ID가 없습니다.");
      return;
    }

    if (!categoryName.trim()) {
      alert("카테고리명을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      await adminApi.updateMaterialCategory(categoryId, {
        categoryName: categoryName.trim(),
      });

      alert("카테고리가 수정되었습니다.");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("카테고리 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-edit-page">
      <div className="site-edit-header">
        <button
          type="button"
          className="site-edit-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <p className="site-edit-label">운영자 관리</p>
          <h1>자재 카테고리 수정</h1>
          <p className="site-edit-desc">등록된 자재 카테고리명을 수정하세요.</p>
        </div>
      </div>

      <div className="site-edit-form">
        <section className="site-edit-section">
          <div className="site-edit-section-title">
            <FiPackage />
            <div>
              <h2>카테고리 정보</h2>
              <p>카테고리명을 수정하세요.</p>
            </div>
          </div>

          <div className="site-edit-grid">
            <label className="site-edit-field full">
              <span>
                <FiPackage />
                카테고리명
                <em>*</em>
              </span>
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="예) 단열재"
              />
            </label>
          </div>
        </section>

        <div className="site-edit-actions">
          <button
            type="button"
            className="site-edit-cancel-btn"
            onClick={() => navigate("/dashboard")}
          >
            취소
          </button>

          <button
            type="button"
            className="site-edit-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            <FiSave />
            {loading ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaterialCategoryEditPage;
