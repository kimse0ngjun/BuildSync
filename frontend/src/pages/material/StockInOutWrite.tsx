import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiChevronDown,
  FiRefreshCw,
  FiPackage,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";
import "../../styles/StockInOutWrite.css";

const material = {
  id: 1,
  code: "MAT-001",
  name: "철근 D13",
  category: "철강",
  currentStock: 120,
  minStock: 50,
  unit: "EA",
  price: 30000,
};

function StockInOutWrite() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "입고",
    date: "2024-06-10",
    materialId: "MAT-001",
    siteId: "SITE-001",
    orderId: "PO-2024-128",
    contactId: "김철수",
    quantity: "120",
    memo: "1차 철근 입고\n현장 보관 장소 : 자재 창고 A",
  });

  const quantity = Number(form.quantity || 0);
  const totalPrice = quantity * material.price;
  const expectedStock =
    form.type === "입고"
      ? material.currentStock + quantity
      : material.currentStock - quantity;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="stock-write-page">
      <div className="stock-write-header">
        <button className="stock-back-btn" onClick={() => navigate("/stock")}>
          <FiArrowLeft />
        </button>

        <div>
          <p className="stock-write-label">입출고 관리</p>
          <h1>입출고 등록</h1>
          <p className="stock-write-desc">
            자재의 입고 또는 출고 내역을 등록하세요.
          </p>
        </div>
      </div>

      <div className="stock-write-layout">
        <section className="stock-write-main">
          <div className="stock-write-section">
            <h2>기본 정보</h2>

            <div className="stock-form-grid">
              <FormField label="구분" required>
                <div className="type-toggle">
                  <button
                    type="button"
                    className={form.type === "입고" ? "active in" : ""}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, type: "입고" }))
                    }
                  >
                    <FiArrowDown />
                    입고
                  </button>

                  <button
                    type="button"
                    className={form.type === "출고" ? "active out" : ""}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, type: "출고" }))
                    }
                  >
                    <FiArrowUp />
                    출고
                  </button>
                </div>
              </FormField>

              <FormField label="처리일" required>
                <div className="input-icon">
                  <input
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    placeholder="처리일을 선택하세요"
                  />
                  <FiCalendar />
                </div>
              </FormField>

              <FormField label="자재" required>
                <div className="select-with-thumb">
                  <div className="material-mini-thumb">▥</div>
                  <select
                    name="materialId"
                    value={form.materialId}
                    onChange={handleChange}
                  >
                    <option value="MAT-001">철근 D13 (MAT-001)</option>
                    <option value="MAT-002">시멘트 40kg (MAT-002)</option>
                    <option value="MAT-003">유리 5T (MAT-003)</option>
                  </select>
                </div>
              </FormField>

              <FormField label="수량" required>
                <div className="quantity-input">
                  <input
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    placeholder="수량을 입력하세요"
                  />
                  <select>
                    <option>EA</option>
                    <option>포</option>
                    <option>롤</option>
                    <option>통</option>
                  </select>
                </div>
                <small>0 이상의 숫자를 입력하세요</small>
              </FormField>

              <FormField label="공사현장" required>
                <select
                  name="siteId"
                  value={form.siteId}
                  onChange={handleChange}
                >
                  <option value="SITE-001">강남 아파트 신축 (SITE-001)</option>
                  <option value="SITE-002">
                    부산 상가 리모델링 (SITE-002)
                  </option>
                  <option value="SITE-003">판교 오피스 건설 (SITE-003)</option>
                </select>
              </FormField>

              <FormField label="발주번호">
                <select
                  name="orderId"
                  value={form.orderId}
                  onChange={handleChange}
                >
                  <option value="PO-2024-128">PO-2024-128</option>
                  <option value="PO-2024-127">PO-2024-127</option>
                  <option value="">발주번호 없음</option>
                </select>
                <small>발주가 없는 경우 선택하지 않아도 됩니다.</small>
              </FormField>

              <FormField label="담당자" required>
                <select
                  name="contactId"
                  value={form.contactId}
                  onChange={handleChange}
                >
                  <option value="김철수">김철수 (대한건설)</option>
                  <option value="이영희">이영희 (대한건설)</option>
                  <option value="박민수">박민수 (대한건설)</option>
                </select>
              </FormField>
            </div>
          </div>

          <div className="stock-write-section">
            <h2>추가 정보</h2>

            <FormField label="메모">
              <textarea
                name="memo"
                value={form.memo}
                onChange={handleChange}
                placeholder="메모를 입력하세요. (선택사항)"
                maxLength={200}
              />
              <div className="memo-count">{form.memo.length} / 200</div>
            </FormField>
          </div>

          <div className="stock-write-actions">
            <button
              className="stock-cancel-btn"
              onClick={() => navigate("/stock")}
            >
              취소
            </button>
            <button className="stock-submit-btn">등록하기</button>
          </div>
        </section>

        <aside className="stock-write-preview">
          <div className="preview-card">
            <div className="preview-title">
              <h3>선택한 자재 정보</h3>
              <button>
                <FiRefreshCw />
                초기화
              </button>
            </div>

            <div className="preview-material">
              <div className="preview-thumb">▥</div>
              <div>
                <h4>{material.name}</h4>
                <span>정상</span>
                <p>
                  {material.code} · {material.category}
                </p>
              </div>
            </div>

            <PreviewInfo
              label="현재 재고"
              value={`${material.currentStock} ${material.unit}`}
            />
            <PreviewInfo
              label="최소 재고"
              value={`${material.minStock} ${material.unit}`}
            />
            <PreviewInfo label="단위" value={material.unit} />
            <PreviewInfo
              label="단가"
              value={`${material.price.toLocaleString()} 원`}
            />
          </div>

          <div className="preview-card">
            <h3>입출고 미리보기</h3>

            <PreviewInfo
              label="구분"
              value={form.type}
              highlight={form.type === "입고" ? "in" : "out"}
            />
            <PreviewInfo
              label="수량"
              value={`${quantity || 0} ${material.unit}`}
            />
            <PreviewInfo
              label="단가"
              value={`${material.price.toLocaleString()} 원`}
            />

            <div className="total-row">
              <span>총 금액</span>
              <strong>{totalPrice.toLocaleString()} 원</strong>
            </div>
          </div>

          <div className="preview-card">
            <h3>입출고 후 재고 예상</h3>

            <PreviewInfo
              label="현재 재고"
              value={`${material.currentStock} ${material.unit}`}
            />
            <PreviewInfo
              label="입출고 수량"
              value={`${form.type === "입고" ? "+" : "-"}${quantity || 0} ${material.unit}`}
              highlight={form.type === "입고" ? "in" : "out"}
            />

            <div className="expected-row">
              <span>예상 재고</span>
              <strong>
                {expectedStock} {material.unit}
              </strong>
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
    <label className="stock-form-field">
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

function PreviewInfo({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "in" | "out";
}) {
  return (
    <div className="preview-info-row">
      <span>{label}</span>
      <strong
        className={
          highlight === "in"
            ? "preview-in"
            : highlight === "out"
              ? "preview-out"
              : ""
        }
      >
        {value}
      </strong>
    </div>
  );
}

export default StockInOutWrite;
