import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBox, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import "../../styles/MaterialWrite.css";

function MaterialWrite() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    materialCode: "",
    materialName: "",
    materialCategory: "",
    unit: "",
    currentStock: "",
    minimumStock: "",
    price: "",
    specification: "",
    memo: "",
  });

  const isEnough =
    Number(form.currentStock || 0) >= Number(form.minimumStock || 0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="material-write-page">
      <div className="write-header">
        <button className="back-icon-btn" onClick={() => navigate("/material")}>
          <FiArrowLeft />
        </button>

        <div>
          <p className="page-label">자재 관리</p>
          <h1>자재 등록</h1>
          <p className="page-desc">새로운 자재 정보를 등록하세요.</p>
        </div>
      </div>

      <div className="write-layout">
        <section className="write-main">
          <div className="write-section">
            <h2>기본 정보</h2>

            <div className="form-grid">
              <FormField label="자재 코드" required>
                <input
                  name="materialCode"
                  value={form.materialCode}
                  onChange={handleChange}
                  placeholder="자재 코드를 입력하세요"
                />
                <small>예) MAT-001</small>
              </FormField>

              <FormField label="자재명" required>
                <input
                  name="materialName"
                  value={form.materialName}
                  onChange={handleChange}
                  placeholder="자재명을 입력하세요"
                />
                <small>예) 철근 D13</small>
              </FormField>

              <FormField label="자재 분류" required>
                <select
                  name="materialCategory"
                  value={form.materialCategory}
                  onChange={handleChange}
                >
                  <option value="">자재 분류를 선택하세요</option>
                  <option value="철강">철강</option>
                  <option value="시멘트">시멘트</option>
                  <option value="유리">유리</option>
                  <option value="목재">목재</option>
                  <option value="배관자재">배관자재</option>
                  <option value="전기자재">전기자재</option>
                </select>
              </FormField>

              <FormField label="단위" required>
                <select name="unit" value={form.unit} onChange={handleChange}>
                  <option value="">단위를 선택하세요</option>
                  <option value="EA">EA</option>
                  <option value="포">포</option>
                  <option value="롤">롤</option>
                  <option value="통">통</option>
                  <option value="장">장</option>
                </select>
                <small>예) EA, KG, 롤, 장, 통</small>
              </FormField>

              <FormField label="현재 재고 수량" required>
                <div className="input-with-unit">
                  <input
                    name="currentStock"
                    value={form.currentStock}
                    onChange={handleChange}
                    placeholder="현재 재고 수량을 입력하세요"
                  />
                  <span>{form.unit || "EA"}</span>
                </div>
                <small>0 이상의 숫자를 입력하세요</small>
              </FormField>

              <FormField label="최소 재고 수량" required>
                <div className="input-with-unit">
                  <input
                    name="minimumStock"
                    value={form.minimumStock}
                    onChange={handleChange}
                    placeholder="최소 재고 수량을 입력하세요"
                  />
                  <span>{form.unit || "EA"}</span>
                </div>
                <small>재고 부족 판단 기준이 됩니다</small>
              </FormField>

              <FormField label="가격(단가)" required>
                <div className="input-with-unit">
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="단가를 입력하세요"
                  />
                  <span>원</span>
                </div>
                <small>부가세 포함 여부를 확인해주세요</small>
              </FormField>

              <FormField label="규격">
                <input
                  name="specification"
                  value={form.specification}
                  onChange={handleChange}
                  placeholder="규격을 입력하세요"
                />
                <small>예) D13, 40kg, 5T</small>
              </FormField>
            </div>
          </div>

          <div className="write-section">
            <h2>추가 정보</h2>

            <FormField label="메모">
              <textarea
                name="memo"
                value={form.memo}
                onChange={handleChange}
                placeholder="메모를 입력하세요. (선택사항)"
                maxLength={200}
              />
              <div className="text-count">{form.memo.length} / 200</div>
            </FormField>
          </div>

          <div className="write-actions">
            <button
              className="cancel-btn"
              onClick={() => navigate("/material")}
            >
              취소
            </button>
            <button className="submit-btn">등록하기</button>
          </div>
        </section>

        <aside className="write-preview">
          <div className="preview-card">
            <div className="preview-title">
              <h3>자재 미리보기</h3>
              <button>
                <FiRefreshCw />
                초기화
              </button>
            </div>

            <div className="preview-material">
              <div className="preview-thumb">
                <FiBox />
              </div>

              <div>
                <h4>{form.materialName || "자재명이 입력됩니다"}</h4>
                <span>{form.materialCategory || "분류명"}</span>
              </div>
            </div>

            <PreviewInfo label="자재 코드" value={form.materialCode || "-"} />
            <PreviewInfo
              label="현재 재고"
              value={
                form.currentStock
                  ? `${form.currentStock} ${form.unit || ""}`
                  : "-"
              }
            />
            <PreviewInfo
              label="최소 재고"
              value={
                form.minimumStock
                  ? `${form.minimumStock} ${form.unit || ""}`
                  : "-"
              }
            />
            <PreviewInfo label="단위" value={form.unit || "-"} />
            <PreviewInfo
              label="단가"
              value={form.price ? `${form.price} 원` : "-"}
            />
            <PreviewInfo label="규격" value={form.specification || "-"} />
          </div>

          <div className="preview-card">
            <h3>재고 상태 미리보기</h3>
            <p className="preview-desc">
              현재 재고와 최소 재고를 입력하면 상태가 표시됩니다.
            </p>

            <div
              className={
                isEnough ? "stock-status normal" : "stock-status warning"
              }
            >
              <FiCheckCircle />
              <div>
                <strong>{isEnough ? "정상" : "부족"}</strong>
                <p>
                  {isEnough
                    ? "재고가 충분합니다."
                    : "최소 재고보다 부족합니다."}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="form-field">
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

function PreviewInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="preview-info">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default MaterialWrite;
