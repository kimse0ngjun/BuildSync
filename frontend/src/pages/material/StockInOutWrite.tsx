import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiArrowDown,
  FiArrowUp,
  FiTrash2,
} from "react-icons/fi";
import "../../styles/StockInOutWrite.css";
import type {
  AutoFillItem,
  InOutRegItemDetail,
  InOutRegRequest,
  MaterialStockDetail,
  SelectOption,
} from "../../types/InOut";
import { inoutApi } from "../../api/inoutApi";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";
import NoAccess from "../../components/NoAccess";

function StockInOutWrite() {
  const navigate = useNavigate();
  const myCompanyId = Number(localStorage.getItem("companyId"));
  const { isLogin } = useAuth();
  const companyType = localStorage.getItem("companyType");

  // 셀렉트 옵션
  const [orderOptions, setOrderOptions] = useState<SelectOption[]>([]);
  const [siteOptions, setSiteOptions] = useState<SelectOption[]>([]);
  const [materialOptions, setMaterialOptions] = useState<SelectOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 상태
  const [type, setType] = useState<"입고" | "출고">("입고");
  const [processedDate, setProcessedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedOrderId, setSelectedOrderId] = useState<number | "">("");
  const [selectedSiteId, setSelectedSiteId] = useState<number | "">("");
  const [contactInfo, setContactInfo] = useState<{
    id: number | null;
    name: string;
  }>({ id: null, name: "-" });
  const [memo, setMemo] = useState<string>("");

  // 복수 품목
  const [gridItems, setGridItems] = useState<
    (InOutRegItemDetail & {
      materialName: string;
      unit: string;
      unitPrice: number;
      currentQuantity: number;
      minimumQuantity: number;
    })[]
  >([]);

  // 자재 선택
  const [currentSelectedMaterialId, setCurrentSelectedMaterialId] = useState<
    number | ""
  >("");
  const [currentQuantityInput, setCurrentQuantityInput] = useState<string>("");

  // 단위 자동
  const [currentUnitDisplay, setCurrentUnitDisplay] = useState<string>("EA");

  // 화면 우측 프리뷰
  const [activePreviewStock, setActivePreviewStock] =
    useState<MaterialStockDetail | null>(null);

  if (!isLogin) {
    return <LoginRequired />;
  }

  if (companyType !== "SUPPLIER") {
    return <NoAccess targetRoleName="공급업체" />;
  }

  useEffect(() => {
    // 공통 셀렉트
    inoutApi.getMaterials().then(setMaterialOptions).catch(console.error);
    inoutApi.getSites().then(setSiteOptions).catch(console.error);
  }, []);

  useEffect(() => {
    if (myCompanyId) {
      inoutApi
        .getOrders(myCompanyId)
        .then((res) => {
          setOrderOptions(res);
        })
        .catch(console.error);
    }
  }, [myCompanyId]);

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

  useEffect(() => {
    if (type === "출고" && selectedOrderId !== "") {
      inoutApi
        .getAutoFillData(Number(selectedOrderId))
        .then((res) => {
          if (res) {
            setSelectedSiteId(res.siteId ? res.siteId : "");

            setContactInfo({
              id: res.contactId || null,
              name: res.contactName ? `${res.contactName} (담당자)` : "-",
            });

            const mappedItems = res.items
              ? res.items.map((item: AutoFillItem) => ({
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
          }
        })
        .catch((err) => {
          console.error("발주 정보 자동완성 실패:", err);
          setContactInfo({ id: null, name: "-" });
          setSelectedSiteId("");
        });
    } else if (selectedOrderId === "") {
      setContactInfo({ id: null, name: "-" });
      setSelectedSiteId("");
      setGridItems([]);
      setActivePreviewStock(null);
    }
  }, [selectedOrderId, type]);

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

  // 입고 시 수동 품목 자재 추가
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

  // 합계 연산
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

  // 제출
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (gridItems.length === 0) {
      alert("입출고 처리할 자재 품목을 최소 1개 이상 추가해 주세요.");
      return;
    }

    setIsSubmitting(true);

    const myContactId = Number(localStorage.getItem("contactId"));

    const requestPayload: InOutRegRequest = {
      companyId: myCompanyId,
      siteId: type === "출고" && selectedSiteId ? Number(selectedSiteId) : null,
      orderId:
        type === "출고" && selectedOrderId ? Number(selectedOrderId) : null,
      contactId: type === "출고" ? contactInfo.id : myContactId || null,
      type: type,
      memo: memo.trim() || null,
      items: gridItems.map((i) => ({
        materialId: i.materialId,
        quantity: i.quantity,
      })),
    };

    inoutApi
      .registerStockInout(requestPayload)
      .then(() => {
        navigate(
          type === "입고" ? "/stock/success-input" : "/stock/success-output",
        );
      })
      .catch((err) => {
        console.error("입출고 등록 실패:", err);
        alert(
          "처리 중 요류가 발생했습니다. 권한 또는 원천 제고 수량을 확인하세요.",
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
          <p className="stock-write-label">입출고 관리</p>
          <h1 className="stock-write-title">
            입출고 등록 ({type === "입고" ? "공급사 입고" : "공급사 출고"})
          </h1>
          <p className="stock-write-desc">
            자재의 입고 또는 출고 내역을 등록하세요.
          </p>
        </div>
      </div>

      <div className="stock-write-layout">
        <form className="stock-write-main" onSubmit={handleSubmitForm}>
          <div className="stock-write-section">
            <h2 className="basic-info-title">기본 정보</h2>

            <div className="stock-form-grid">
              <FormField label="구분" required>
                <div className="type-toggle">
                  <button
                    type="button"
                    className={type === "입고" ? "active in" : ""}
                    onClick={() => {
                      setType("입고");
                      setSelectedOrderId("");
                      setGridItems([]);
                    }}
                  >
                    <FiArrowDown /> 입고
                  </button>
                  <button
                    type="button"
                    className={type === "출고" ? "active out" : ""}
                    onClick={() => {
                      setType("출고");
                      setGridItems([]);
                    }}
                  >
                    <FiArrowUp /> 출고
                  </button>
                </div>
              </FormField>

              <FormField label="처리일" required>
                <div className="input-icon">
                  <input
                    type="date"
                    value={processedDate}
                    onChange={(e) => setProcessedDate(e.target.value)}
                    className="date-data"
                  />
                  <FiCalendar />
                </div>
              </FormField>

              {type === "출고" && (
                <FormField label="발주서">
                  <select
                    value={selectedOrderId}
                    onChange={(e) =>
                      setSelectedOrderId(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    className="order-data"
                  >
                    <option value="">발주서 선택 (자동완성)</option>
                    {orderOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <small className="order-explain">
                    발주서 연동 시 현장정보와 자재목록이 자동으로 채워집니다.
                  </small>
                </FormField>
              )}

              {type === "출고" && (
                <FormField label="공사 현장" required>
                  <select
                    value={selectedSiteId}
                    onChange={(e) =>
                      setSelectedSiteId(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    disabled={selectedOrderId !== ""}
                    className="site-data"
                  >
                    <option value="">
                      {selectedSiteId === "" ? "-" : "대상 공사 현장"}
                    </option>
                    {siteOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </FormField>
              )}

              {type === "출고" && (
                <FormField label="우리 회사 담당자">
                  <input
                    type="text"
                    value={contactInfo.name}
                    disabled
                    className="contact-data"
                  />
                </FormField>
              )}
            </div>
          </div>

          <div className="stock-write-section">
            <h2 className="table-item-adder-header">
              처리 자재 품목 내역 ({gridItems.length}건)
            </h2>
            {(type === "입고" || selectedOrderId === "") && (
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
                  <option value="">추가할 자재 품목</option>
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
                  min={0}
                />
                <div className="unit-display-box">{currentUnitDisplay}</div>
                <button
                  type="button"
                  onClick={handleAddItemToGrid}
                  className="material-add-btn"
                >
                  추가
                </button>
              </div>
            )}

            <table className="stock-write-table">
              <thead>
                <tr className="material-table-tr">
                  <th>자재명</th>
                  <th>수량</th>
                  <th>단위</th>
                  <th>단가</th>
                  <th>합계 금액</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {gridItems.length === 0 ? (
                  <tr className="no-material-data">
                    <td colSpan={6} className="no-data-explain">
                      등록된 자재 품목 내역이 없습니다. 위에서 자재를 선택하여
                      추가해 주세요.
                    </td>
                  </tr>
                ) : (
                  gridItems.map((item, idx) => (
                    <tr
                      key={`${item.materialId}-${idx}`}
                      onClick={() => fetchRightStockDetail(item.materialId)}
                      className="material-data-list"
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
                          disabled={type === "출고" && selectedOrderId !== ""}
                          className="material-quantity"
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
                          disabled={type === "출고" && selectedOrderId !== ""}
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
            <h2 className="memo-title">추가 메모</h2>
            <FormField label="비고/특이사항 내역 입력">
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="물류 배송 차량 크기 지정 또는 현장 적재 구역 등의 특이사항을 적어주세요."
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
              등록 취소
            </button>
            <button
              type="submit"
              className="stock-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "처리 중..." : "등록"}
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
                    <span className="preview-material-condition">
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
                왼쪽 테이블 품목 행을 클릭하면 실시간 재고 정보가 연동됩니다.
              </p>
            )}
          </div>

          <div className="preview-card">
            <h3 className="dashboard-title">대시보드 실시간 집계 요약</h3>
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
              자재 예상 예측 시뮬레이션
            </h3>
            {activePreviewStock ? (
              <>
                <PreviewInfo
                  label="변동 전 창고재고"
                  value={`${activePreviewStock.currentQuantity.toLocaleString()} ${activePreviewStock.unit}`}
                />
                <PreviewInfo
                  label="트랜잭션 변동량"
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
                자재가 추가되거나 선택되면 입출고 분석 결과가 표출됩니다.
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

export default StockInOutWrite;
