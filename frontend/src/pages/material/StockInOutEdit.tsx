import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiArrowDown,
  FiArrowUp,
  FiTrash2,
} from "react-icons/fi";
import "../../styles/StockInOutWrite.css";
import type {
  InOutRegItemDetail,
  InOutRegRequest,
  MaterialStockDetail,
  SelectOption,
} from "../../types/InOut";
import { inoutApi } from "../../api/inoutApi";
import LoginRequired from "../../components/LoginRequired";
import { useAuth } from "../../context/AuthContext";
import NoAccess from "../../components/NoAccess";

function StockInOutEdit() {
  const navigate = useNavigate();
  const { stockInOutId } = useParams<{ stockInOutId: string }>();
  const inoutId = Number(stockInOutId);
  const myCompanyId = Number(localStorage.getItem("companyId"));
  const { isLogin } = useAuth();
  const companyType = localStorage.getItem("companyType");

  const [materialOptions, setMaterialOptions] = useState<SelectOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [type, setType] = useState<"입고" | "출고">("입고");
  const [processedDate, setProcessedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedOrderId, setSelectedOrderId] = useState<number | "">("");
  const [selectedSiteId, setSelectedSiteId] = useState<number | "">("");
  const [siteNameDisplay, setSiteNameDisplay] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: "-" });
  const [memo, setMemo] = useState<string>("");

  const [gridItems, setGridItems] = useState<
    (InOutRegItemDetail & {
      materialName: string;
      unit: string;
      unitPrice: number;
      currentQuantity: number;
      minimumQuantity: number;
    })[]
  >([]);

  const [originalInoutIds, setOriginalInoutIds] = useState<number[]>([]);

  const [currentSelectedMaterialId, setCurrentSelectedMaterialId] = useState<
    number | ""
  >("");
  const [currentQuantityInput, setCurrentQuantityInput] = useState<string>("");
  const [currentUnitDisplay, setCurrentUnitDisplay] = useState<string>("EA");

  const [activePreviewStock, setActivePreviewStock] =
    useState<MaterialStockDetail | null>(null);

  if (!isLogin) {
    return <LoginRequired />;
  }

  if (companyType !== "SUPPLIER") {
    return <NoAccess targetRoleName="공급업체" />;
  }

  useEffect(() => {
    inoutApi.getMaterials().then(setMaterialOptions).catch(console.error);

    if (inoutId) {
      inoutApi
        .getInoutDetail(inoutId)
        .then((resData) => {
          if (resData) {
            setType(resData.type as "입고" | "출고");
            setProcessedDate(
              resData.processedDate ? resData.processedDate.split("T")[0] : "",
            );
            setSelectedOrderId(resData.orderId || "");
            setSelectedSiteId(resData.siteId || "");
            setSiteNameDisplay(resData.siteName || "본사재고");
            setContactInfo({
              id: resData.contactId,
              name: resData.contactName
                ? `${resData.contactName} (담당자)`
                : "-",
            });
            setMemo(resData.memo || "");

            if (resData.stockInoutId) {
              setOriginalInoutIds([resData.stockInoutId]);
            }

            const mappedItems = resData.items
              ? resData.items.map((item: any) => ({
                  materialId: item.materialId,
                  materialName: item.materialName,
                  quantity: item.quantity,
                  unit: item.unit || "EA",
                  unitPrice: item.unitPrice || 0,
                  currentQuantity: 0,
                  minimumQuantity: 0,
                }))
              : [];
            setGridItems(mappedItems);

            if (mappedItems.length > 0) {
              fetchRightStockDetail(mappedItems[0].materialId);
            }
            console.log("상세 응답", resData);
          }
        })
        .catch((err) => {
          console.error("수정 데이터 로드 실패:", err);
          alert("존재하지 않거나 접근 권한이 없는 이력 전표입니다.");
          navigate("/stock");
        });
    }
  }, [inoutId, navigate, myCompanyId]);

  useEffect(() => {
    if (currentSelectedMaterialId !== "") {
      inoutApi
        .getPureStockInfo(myCompanyId, Number(currentSelectedMaterialId))
        .then((res) => {
          const liveMat = res?.materials?.[0];
          if (liveMat) {
            setCurrentUnitDisplay(liveMat.unit || "EA");
            setActivePreviewStock(liveMat);
          }
        })

        .catch(console.error);
    } else {
      setCurrentUnitDisplay("EA");
    }
  }, [currentSelectedMaterialId, myCompanyId]);

  const fetchRightStockDetail = (materialId: number) => {
    if (!myCompanyId) return;
    inoutApi
      .getPureStockInfo(myCompanyId, materialId)
      .then((res) => {
        if (res && res.materials?.length > 0) {
          setActivePreviewStock(res.materials[0]);
        }
      })
      .catch(console.error);
  };

  // 자재 품목 추가
  const handleAddItemToGrid = () => {
    if (!currentSelectedMaterialId || !currentQuantityInput) return;

    const matId = Number(currentSelectedMaterialId);
    const qty = Number(currentQuantityInput);
    if (qty <= 0) return;

    const matchedOpt = materialOptions.find((o) => o.value === matId);

    inoutApi.getPureStockInfo(myCompanyId, matId).then((res) => {
      const liveMat = res?.materials?.[0];

      setGridItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.materialId === matId,
        );
        if (existingIndex > -1) {
          const next = [...prev];
          next[existingIndex].quantity += qty;
          return next;
        } else {
          return [
            ...prev,
            {
              materialId: matId,
              materialName: matchedOpt?.label || "미지정 자재",
              quantity: qty,
              unit: liveMat?.unit || "EA",
              unitPrice: liveMat?.unitPrice || 0,
              currentQuantity: liveMat?.currentQuantity || 0,
              minimumQuantity: liveMat?.minimumQuantity || 0,
            },
          ];
        }
      });

      fetchRightStockDetail(matId);
      setCurrentQuantityInput("");
      setCurrentSelectedMaterialId("");
    });
  };

  const handleRemoveItem = (index: number) => {
    setGridItems((prev) => prev.filter((_, i) => i !== index));
    if (gridItems.length <= 1) setActivePreviewStock(null);
  };

  // 실시간 합계 지표 계산
  const totalGridAmount = gridItems.reduce(
    (acc, cur) => acc + cur.quantity * cur.unitPrice,
    0,
  );
  const totalGridQuantity = gridItems.reduce(
    (acc, cur) => acc + cur.quantity,
    0,
  );

  const activePreviewExpectedStock = activePreviewStock
    ? type === "입고"
      ? activePreviewStock.currentQuantity +
        (gridItems.find((i) => i.materialId === activePreviewStock.materialId)
          ?.quantity || 0)
      : activePreviewStock.currentQuantity -
        (gridItems.find((i) => i.materialId === activePreviewStock.materialId)
          ?.quantity || 0)
    : 0;

  // 폼 제출
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (gridItems.length === 0) {
      alert("수정 처리할 자재 품목을 최소 1개 이상 유지해 주세요.");
      return;
    }

    setIsSubmitting(true);

    const requestPayload: InOutRegRequest & { deleteInoutIds: number[] } = {
      companyId: myCompanyId,
      siteId: selectedSiteId ? Number(selectedSiteId) : null,
      orderId: selectedOrderId ? Number(selectedOrderId) : null,
      contactId: contactInfo.id,
      type: type,
      memo: memo.trim() || null,
      items: gridItems.map((i) => ({
        materialId: i.materialId,
        quantity: i.quantity,
      })),
      deleteInoutIds: originalInoutIds,
    };

    inoutApi
      .updateStockInout(inoutId, requestPayload)
      .then(() => {
        alert("입출고 이력 전표 수정이 완료되었습니다.");
        navigate("/stock");
      })
      .catch((err) => {
        console.error("입출고 수정 실패:", err);
        alert(
          "수정 처리 중 오류가 발생했습니다. 타입 변경으로 인한 창고 잔량이 부족한지 재차 확인해 주세요.",
        );
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="stock-write-page">
      <div className="stock-write-header">
        <button className="stock-back-btn" onClick={() => navigate("/stock")}>
          <FiArrowLeft />
        </button>

        <div className="stock-write-card">
          <p className="stock-write-label">입출고 관리 시스템</p>
          <h1 className="stock-write-title">입출고 이력 수정 (#{inoutId})</h1>
          <p className="stock-write-desc">
            전표의 구분(입고/출고) 및 내부 자재 품목의 수량을 변경할 수
            있습니다.
          </p>
        </div>
      </div>

      <div className="stock-write-layout">
        <form className="stock-write-main" onSubmit={handleSubmitForm}>
          <div className="stock-write-section">
            <h2 className="basic-info-title">기준 정보</h2>

            <div className="stock-form-grid">
              <FormField label="구분" required>
                <div className="type-toggle">
                  <button
                    type="button"
                    className={type === "입고" ? "active in" : ""}
                    onClick={() => setType("입고")}
                  >
                    <FiArrowDown /> 입고
                  </button>
                  <button
                    type="button"
                    className={type === "출고" ? "active out" : ""}
                    onClick={() => setType("출고")}
                  >
                    <FiArrowUp /> 출고
                  </button>
                </div>
              </FormField>

              <FormField label="처리일">
                <div className="input-icon">
                  <input
                    type="date"
                    value={processedDate}
                    disabled
                    className="date-data"
                  />
                  <FiCalendar />
                </div>
              </FormField>

              {selectedOrderId !== "" && (
                <FormField label="연동 발주서 서류">
                  <input
                    type="text"
                    value={`발주 번호 : ${selectedOrderId}`}
                    disabled
                    className="order-data"
                  />
                </FormField>
              )}

              <FormField label="귀속 공사 현장">
                <input
                  type="text"
                  value={siteNameDisplay}
                  disabled
                  className="site-data"
                />
              </FormField>

              <FormField label="귀속 등록 담당자">
                <input
                  type="text"
                  value={contactInfo.name}
                  disabled
                  className="contact-data"
                />
              </FormField>
            </div>
          </div>

          <div className="stock-write-section">
            <h2 className="table-item-adder-header">
              처리 자재 품목 목록 및 수량 조율 ({gridItems.length}건)
            </h2>

            <div className="table-item-adder-zone">
              <select
                value={currentSelectedMaterialId}
                onChange={(e) =>
                  setCurrentSelectedMaterialId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="material-data"
              >
                <option value="">추가 교체할 자재 품목 선택</option>
                {materialOptions.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="수량"
                value={currentQuantityInput}
                onChange={(e) => setCurrentQuantityInput(e.target.value)}
                className="quantity-data"
                min={1}
              />
              <div className="unit-display-box">{currentUnitDisplay}</div>
              {gridItems.length === 0 && (
                <button
                  onClick={handleAddItemToGrid}
                  className="material-add-btn"
                >
                  추가
                </button>
              )}
            </div>

            <table className="stock-write-table">
              <thead>
                <tr className="material-table-tr">
                  <th>자재명</th>
                  <th>수량 (변경 가능)</th>
                  <th>단위</th>
                  <th>단가</th>
                  <th>합계 금액</th>
                  <th>제거</th>
                </tr>
              </thead>
              <tbody>
                {gridItems.length === 0 ? (
                  <tr className="no-material-data">
                    <td colSpan={6} className="no-data-explain">
                      전표 내 자재 품목이 비어있습니다. 품목을 최소 1개 이상
                      채워 넣어 주세요.
                    </td>
                  </tr>
                ) : (
                  gridItems.map((item, idx) => (
                    <tr
                      key={`${item.materialId}-${idx}`}
                      onClick={() => fetchRightStockDetail(item.materialId)}
                      className="material-data-list"
                      style={{ cursor: "pointer" }}
                    >
                      <td className="material-name">{item.materialName}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setGridItems((prev) =>
                              prev.map((g, i) =>
                                i === idx ? { ...g, quantity: val } : g,
                              ),
                            );
                          }}
                          className="material-quantity"
                          style={{
                            border: "1px solid #2563eb",
                            borderRadius: "4px",
                            padding: "4px 8px",
                          }}
                        />
                      </td>
                      <td className="material-unit">
                        <span className="badge-unit">{item.unit}</span>
                      </td>
                      <td className="material-unitPrice">
                        {item.unitPrice.toLocaleString()} 원
                      </td>
                      <td className="material-amount">
                        {(item.quantity * item.unitPrice).toLocaleString()} 원
                      </td>
                      <td className="action-btn">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveItem(idx);
                          }}
                          className="remove-item-btn"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="stock-write-section">
            <h2 className="memo-title">추가 비고 메모 수정</h2>
            <FormField label="비고/특이사항 내역">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="특이사항 메모 내역을 정정 입력하세요."
                maxLength={200}
                className="memo-data"
              />
              <div className="memo-count">{memo.length} / 200</div>
            </FormField>
          </div>

          <div className="stock-write-actions">
            <button
              type="button"
              className="stock-cancel-btn"
              onClick={() => navigate("/stock")}
            >
              수정 취소
            </button>
            <button
              type="submit"
              className="stock-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "수정 반영 중..." : "수정 확정"}
            </button>
          </div>
        </form>

        <aside className="stock-write-preview">
          <div className="preview-card">
            <div className="preview-title">
              <h3 className="selected-material-data-title">
                선택 자재 실시간 기준정보
              </h3>
            </div>
            {activePreviewStock ? (
              <>
                <div className="preview-material">
                  <div className="preview-thumb">▥</div>
                  <div>
                    <h4 className="preview-materialName">
                      {activePreviewStock.materialName}
                    </h4>
                    <span
                      className={`preview-material-condition ${activePreviewStock.currentQuantity >= activePreviewStock.minimumQuantity ? "" : "insufficient"}`}
                    >
                      {activePreviewStock.currentQuantity >=
                      activePreviewStock.minimumQuantity
                        ? "정상"
                        : "재고부족"}
                    </span>
                    <p className="preview-material-code">
                      {activePreviewStock.materialCode}
                    </p>
                  </div>
                </div>
                <PreviewInfo
                  label="현재 창고 실재고"
                  value={`${activePreviewStock.currentQuantity.toLocaleString()} ${activePreviewStock.unit}`}
                />
                <PreviewInfo
                  label="안전 기준 임계치"
                  value={`${activePreviewStock.minimumQuantity.toLocaleString()} ${activePreviewStock.unit}`}
                />
                <PreviewInfo
                  label="자재 기본 책정 단가"
                  value={`${activePreviewStock.unitPrice?.toLocaleString() || 0} 원`}
                />
              </>
            ) : (
              <p className="material-action-explain">
                품목 행을 클릭하면 정정 대상 자재의 실시간 재고 흐름을
                점검합니다.
              </p>
            )}
          </div>

          <div className="preview-card">
            <h3 className="dashboard-title">정정 전표 실시간 집계 요약</h3>
            <PreviewInfo
              label="변동 구분 연산"
              value={type}
              highlight={type === "입고" ? "in" : "out"}
            />
            <PreviewInfo
              label="총 전표 포함 품목"
              value={`${gridItems.length} 종`}
            />
            <PreviewInfo
              label="총 적재 자재 량"
              value={`${totalGridQuantity.toLocaleString()} 총량`}
            />
            <div className="total-row">
              <span className="total-amount-explain">총 금액 합계</span>
              <strong className="total-amount-data">
                {totalGridAmount.toLocaleString()} 원
              </strong>
            </div>
          </div>

          <div className="preview-card">
            <h3 className="expected-material-title">
              재고 롤백 시뮬레이션 결과
            </h3>
            {activePreviewStock ? (
              <>
                <PreviewInfo
                  label="변동 전 창고재고"
                  value={`${activePreviewStock.currentQuantity.toLocaleString()} ${activePreviewStock.unit}`}
                />
                <PreviewInfo
                  label="트랜잭션 정정량"
                  value={`${type === "입고" ? "+" : "-"}${(gridItems.find((i) => i.materialId === activePreviewStock.materialId)?.quantity || 0).toLocaleString()} ${activePreviewStock.unit}`}
                  highlight={type === "입고" ? "in" : "out"}
                />
                <div className="expected-row">
                  <span className="expected-sub-explain">예측 변동고</span>
                  <strong
                    style={{
                      color:
                        activePreviewExpectedStock >=
                        activePreviewStock.minimumQuantity
                          ? "#10284a"
                          : "#ef4444",
                    }}
                    className="expected-material-stock"
                  >
                    {activePreviewExpectedStock.toLocaleString()}{" "}
                    {activePreviewStock.unit}
                  </strong>
                </div>
              </>
            ) : (
              <p className="expected-material-explain">
                자재 수량을 정정하면 창고에 미칠 예측 시뮬레이션 결과가
                연동됩니다.
              </p>
            )}
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

export default StockInOutEdit;
