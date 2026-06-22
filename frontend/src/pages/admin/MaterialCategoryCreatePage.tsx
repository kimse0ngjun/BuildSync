import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiSave } from "react-icons/fi";
import adminApi from "../../api/adminApi";
import "../../styles/SiteCreatePage.css";

function MaterialCategoryCreatePage() {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      alert("카테고리명을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      await adminApi.createMaterialCategory({
        categoryName: categoryName.trim(),
      });

      alert("카테고리가 등록되었습니다.");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("카테고리 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-create-page">
      <div className="site-create-header">
        <button
          type="button"
          className="site-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <p className="site-create-label">운영자 관리</p>
          <h1>자재 카테고리 등록</h1>
          <p className="site-create-desc">
            자재 등록 시 사용할 카테고리를 등록하세요.
          </p>
        </div>
      </div>

      <div className="site-create-form">
        <section className="site-form-section">
          <div className="site-section-title">
            <FiPackage />
            <div>
              <h2>카테고리 정보</h2>
              <p>카테고리명을 입력하세요.</p>
            </div>
          </div>

          <div className="site-form-grid">
            <label className="site-form-field full">
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

        <div className="site-form-actions">
          <button
            type="button"
            className="site-cancel-btn"
            onClick={() => navigate("/dashboard")}
          >
            취소
          </button>

          <button
            type="button"
            className="site-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            <FiSave />
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaterialCategoryCreatePage;
