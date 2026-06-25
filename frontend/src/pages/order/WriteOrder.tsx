import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiBriefcase,
  FiPhone,
  FiMail,
  FiPackage,
  FiPlus,
  FiTrash2,
  FiFileText,
  FiSave,
} from "react-icons/fi";
import { writeOrderApi } from "../../api/OrderApi";
import type {
  ContactInfo,
  MaterialSelectResponse,
  OrderItemDto,
  OrderItemRequest,
  OrderRequest,
  SelectResponse,
} from "../../types/Order";

import "../../styles/WriteOrder.css";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";
import NoAccess from "../../components/NoAccess";

export const WriteOrder = () => {
  const navigate = useNavigate();
  const orderDate = new Date().toISOString().split("T")[0];
  const { isLogin } = useAuth();
  const myCompanyType = localStorage.getItem("companyType");

  const [supplierList, setSupplierList] = useState<SelectResponse[]>([]);
  const [siteList, setSiteList] = useState<SelectResponse[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [selectedSiteId, setSelectedSiteId] = useState<string>("");

  const [materialOptions, setMaterialOptions] = useState<
    MaterialSelectResponse[]
  >([]);
  const [inputMaterialId, setInputMaterialId] = useState<number>(0);
  const [inputQuantity, setInputQuantity] = useState<number>(0);
  const [basketList, setBasketList] = useState<OrderItemDto[]>([]);

  const [contactList, setContactList] = useState<ContactInfo[]>([]);
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [orderManagerName, setOrderManagerName] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  if (!isLogin) {
    return <LoginRequired />;
  }

  if (myCompanyType !== "CONSTRUCTION") {
    return <NoAccess targetRoleName="건설업체" />;
  }

  useEffect(() => {
    writeOrderApi
      .getPartnerSelectOptions("SUPPLIER")
      .then((data: any[]) => {
        if (data) {
          const formattedSuppliers = data.map((item) => ({
            value: item.id,
            label: item.companyName,
          }));
          setSupplierList(formattedSuppliers);
        }
      })
      .catch(console.error);

    writeOrderApi
      .getSiteSelectOptions()
      .then((data: any[]) => {
        if (data) {
          const formattedSites = data.map((item) => ({
            value: item.value,
            label: item.label || `현장 [ID: ${item.value}]`,
          }));
          setSiteList(formattedSites);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedSupplierId) {
      setMaterialOptions([]);
      setContactList([]);
      setSelectedContactId("");
      return;
    }

    const companyId = Number(selectedSupplierId);

    writeOrderApi
      .getMaterialSelectOptions(companyId)
      .then((data) => {
        setMaterialOptions(data || []);
      })
      .catch(console.error);

    writeOrderApi
      .getContactOptions(companyId)
      .then((data) => {
        setContactList(data || []);

        if (data && data.length > 0) {
          setSelectedContactId(String(data[0].contactId));
        } else {
          setSelectedContactId("");
        }
      })
      .catch((err) => console.error("담당자 연동 실패:", err));
  }, [selectedSupplierId]);

  const currentSelectedMaterialInfo = materialOptions.find(
    (m) => m.value === inputMaterialId,
  );

  const currentContactInfo = contactList.find(
    (c) => String(c.contactId) === selectedContactId,
  );

  const totalAmountSum = basketList.reduce((sum, item) => sum + item.amount, 0);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyIdStr = e.target.value;
    setSelectedSupplierId(companyIdStr);
    setInputMaterialId(0);
    setBasketList([]);
  };

  const handleAddMaterial = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (inputMaterialId === 0 || !currentSelectedMaterialInfo) {
      alert("자재를 선택해 주세요.");
      return;
    }

    if (inputQuantity <= 0) {
      alert("발주 수량을 1개 이상 입력해 주세요.");
      return;
    }

    const isExist = basketList.some(
      (item) => item.materialId === currentSelectedMaterialInfo.value,
    );

    if (isExist) {
      alert("이미 목록에 추가된 자재입니다.");
      return;
    }

    const price = currentSelectedMaterialInfo.unitPrice || 0;

    const newItem: OrderItemDto = {
      materialId: currentSelectedMaterialInfo.value,
      materialName: currentSelectedMaterialInfo.label,
      specification: currentSelectedMaterialInfo.specification,
      unit: currentSelectedMaterialInfo.unit,
      unitPrice: currentSelectedMaterialInfo.unitPrice,
      quantity: inputQuantity,
      amount: price * inputQuantity,
    };

    setBasketList([...basketList, newItem]);
    setInputQuantity(0);
    setInputMaterialId(0);
  };

  const handleRemoveItem = (id: number) => {
    setBasketList(basketList.filter((item) => item.materialId !== id));
  };

  const handleUploadOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const myCompanyId = Number(localStorage.getItem("companyId"));

    if (!selectedSupplierId) {
      alert("거래처를 선택해 주세요.");
      return;
    }

    if (!orderManagerName.trim()) {
      alert("주문 담당자명을 입력해 주세요.");
      return;
    }

    if (basketList.length === 0) {
      alert("발주할 품목을 최소 1개 이상 추가해 주세요.");
      return;
    }

    try {
      const orderItemsPayload: OrderItemRequest[] = basketList.map((item) => ({
        materialId: item.materialId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));

      const cleanMemo = memo ? memo.trim() : "";
      const formattedMemo = `[담당자: ${orderManagerName.trim()}] ${cleanMemo}`;

      const orderPayload: OrderRequest = {
        companyId: myCompanyId,
        siteId: selectedSiteId ? Number(selectedSiteId) : null,
        contactId: selectedContactId ? Number(selectedContactId) : null,
        memo: formattedMemo,
        orderManagerName: orderManagerName.trim(),
        items: orderItemsPayload,
      };

      await writeOrderApi.registOrder(orderPayload);
      alert("발주서 전송이 완료되었습니다.");
      navigate("/order/list");
    } catch (error) {
      console.error("발주서 전송 실패:", error);
      alert("서버 오류로 발주서 전송에 실패했습니다.");
    }
  };

  return (
    <div className="order-write-page">
      <div className="order-write-header">
        <button className="order-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft className="go-back-icon" />
        </button>

        <div>
          <p className="order-page-label">발주 관리</p>
          <h1>발주 요청</h1>
          <p className="order-page-desc">
            공급업체와 자재 품목을 선택하여 발주서를 작성하세요.
          </p>
        </div>
      </div>

      <form className="order-write-form" onSubmit={handleUploadOrder}>
        <section className="order-section">
          <div className="order-section-title">
            <FiFileText />
            <div>
              <h2>기본 정보</h2>
              <p>발주 담당자와 발주일을 확인하세요.</p>
            </div>
          </div>

          <div className="order-form-grid">
            <FormField label="담당자" required icon={<FiUser />}>
              <input
                placeholder="주문자명"
                required
                value={orderManagerName}
                onChange={(e) => setOrderManagerName(e.target.value)}
              />
            </FormField>

            <FormField label="발주일" required icon={<FiCalendar />}>
              <input type="date" defaultValue={orderDate} readOnly />
            </FormField>

            <FormField label="공사 현장" icon={<FiBriefcase />}>
              <select
                value={selectedSiteId}
                onChange={(e) => setSelectedSiteId(e.target.value)}
              >
                <option value="">본사 수령 (현장 없음)</option>
                {siteList.map((site, index) => (
                  <option key={`${site.value}-${index}`} value={site.value}>
                    {site.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </section>

        <section className="order-section">
          <div className="order-section-title">
            <FiBriefcase />
            <div>
              <h2>거래처 정보</h2>
              <p>발주를 요청할 공급업체를 선택하세요.</p>
            </div>
          </div>

          <div className="order-form-grid">
            <FormField label="거래처 선택" required icon={<FiBriefcase />}>
              <select onChange={handleCompanyChange} value={selectedSupplierId}>
                <option value="">거래처를 선택하세요</option>
                {supplierList.map((item, index) => (
                  <option key={`${item.value}-${index}`} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="담당자명" icon={<FiUser />}>
              <input value={currentContactInfo?.contactName ?? "-"} readOnly />
            </FormField>

            <FormField label="연락처" icon={<FiPhone />}>
              <input value={currentContactInfo?.phone ?? "-"} readOnly />
            </FormField>

            <FormField label="이메일" icon={<FiMail />}>
              <input value={currentContactInfo?.email ?? "-"} readOnly />
            </FormField>
          </div>
        </section>

        <section className="order-section">
          <div className="order-section-title">
            <FiPackage />
            <div>
              <h2>발주 품목</h2>
              <p>발주할 자재와 수량을 선택하세요.</p>
            </div>
          </div>

          <div className="order-item-add">
            <select
              value={inputMaterialId}
              onChange={(e) => setInputMaterialId(Number(e.target.value))}
            >
              <option value={0} key="default-material">
                자재 선택
              </option>
              {materialOptions.length > 0 ? (
                materialOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))
              ) : (
                <option key="no-material" disabled>
                  등록된 자재가 없습니다
                </option>
              )}
            </select>

            <input
              type="number"
              min={1}
              value={inputQuantity === 0 ? "" : inputQuantity}
              onChange={(e) => setInputQuantity(Number(e.target.value))}
              placeholder="수량을 입력하세요"
            />

            <span className="order-unit">
              {currentSelectedMaterialInfo
                ? currentSelectedMaterialInfo.unit
                : "-"}
            </span>

            <button type="button" onClick={handleAddMaterial}>
              <FiPlus />
              추가
            </button>
          </div>

          <p className="order-table-help">
            선택한 공급업체의 취급 자재와 재고 정보가 표시됩니다.
          </p>

          <div className="order-table-box">
            <table className="order-item-table">
              <thead>
                <tr>
                  <th>자재명</th>
                  <th>발주 수량</th>
                  <th>규격</th>
                  <th>단가</th>
                  <th>금액</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {basketList.length > 0 ? (
                  basketList.map((item) => (
                    <tr key={item.materialId}>
                      <td className="order-material-name">
                        {item.materialName}
                      </td>

                      <td>
                        {item.quantity} {item.unit}
                      </td>
                      <td>{item.specification || "-"}</td>
                      <td>{(item.unitPrice || 0).toLocaleString()}원</td>
                      <td>총 {(item.amount || 0).toLocaleString()}원</td>
                      <td>
                        <button
                          type="button"
                          className="delete-item-btn"
                          onClick={() => handleRemoveItem(item.materialId)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="empty-table" colSpan={6}>
                      표시할 목록이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="order-total">
              <span>총 금액</span>
              <strong>{totalAmountSum.toLocaleString()} 원</strong>
            </div>
          </div>
        </section>

        <section className="order-section">
          <div className="order-section-title">
            <FiFileText />
            <div>
              <h2>기타</h2>
              <p>발주 요청 관련 추가 사항을 작성하세요.</p>
            </div>
          </div>

          <textarea
            className="order-memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="메모를 입력하세요. (선택사항)"
            maxLength={300}
          />
        </section>

        <div className="order-write-actions">
          <button
            type="button"
            className="order-cancel-btn"
            onClick={() => navigate(-1)}
          >
            취소
          </button>

          <button type="submit" className="order-submit-btn">
            <FiSave />
            승인 요청
          </button>
        </div>
      </form>
    </div>
  );
};

function FormField({
  label,
  required,
  icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="order-form-field">
      <span>
        {icon}
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}
