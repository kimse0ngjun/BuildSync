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
import { writeOrderApi } from "../../api/orderApi";
import type {
  CompanyResponse,
  Contact,
  MaterialResponse,
  SelectedMaterialItem,
} from "../../types/OrderDTO";

import "../../styles/WriteOrder.css";

export const WriteOrder = () => {
  const navigate = useNavigate();
  const orderDate = new Date().toISOString().split("T")[0];

  const [supplierList, setSupplierList] = useState<CompanyResponse[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialResponse[]>(
    [],
  );
  const [inputMaterialId, setInputMaterialId] = useState<number>(0);
  const [inputQuantity, setInputQuantity] = useState<number>(0);
  const [basketList, setBasketList] = useState<SelectedMaterialItem[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [memo, setMemo] = useState<string>("");

  useEffect(() => {
    writeOrderApi
      .getSupplierList()
      .then((data) => {
        console.log(data);
        setSupplierList(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelectedMaterial([]);
      return;
    }

    writeOrderApi
      .getOurCompanyMaterial(Number(selectedId))
      .then((data) => {
        console.log("자재 응답", data);
        setSelectedMaterial(Array.isArray(data) ? data : []);
      })

      .catch(console.error);
  }, [selectedId]);

  const currentSelectedMaterialInfo = selectedMaterial.find(
    (m) => m.materialId === inputMaterialId,
  );

  const totalAmountSum = basketList.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyIdStr = e.target.value;

    setSelectedId(companyIdStr);
    setInputMaterialId(0);
    setBasketList([]);

    if (!companyIdStr) {
      setContact(null);
      return;
    }

    writeOrderApi
      .getContactList(Number(companyIdStr))
      .then((data) => {
        if (data && data.length > 0) {
          setContact(data[0]);
        } else {
          setContact(null);
        }
      })
      .catch((error) => {
        console.error("담당자 로드 실패:", error);
        setContact(null);
      });
  };

  const handleAddMaterial = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!currentSelectedMaterialInfo) {
      alert("자재를 선택해 주세요.");
      return;
    }

    if (inputQuantity <= 0) {
      alert("발주 수량을 1개 이상 입력해 주세요.");
      return;
    }

    const isExist = basketList.some(
      (item) => item.id === currentSelectedMaterialInfo.materialId,
    );

    if (isExist) {
      alert("이미 목록에 추가된 자재입니다.");
      return;
    }

    const newItem: SelectedMaterialItem = {
      ...currentSelectedMaterialInfo,
      currentStock: currentSelectedMaterialInfo.currentStock,
      minimumStock: currentSelectedMaterialInfo.minimumStock,
      orderQuantity: inputQuantity,
      totalAmount: currentSelectedMaterialInfo.unitPrice * inputQuantity,
    };

    setBasketList([...basketList, newItem]);
    setInputQuantity(0);
    setInputMaterialId(0);
  };

  const handleRemoveItem = (id: number) => {
    setBasketList(basketList.filter((item) => item.id !== id));
  };

  const handleUploadOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedId) {
      alert("거래처를 선택해 주세요.");
      return;
    }

    if (basketList.length === 0) {
      alert("발주할 품목을 최소 1개 이상 추가해 주세요.");
      return;
    }

    try {
      const orderPayload = {
        orders: {
          orderId: null,
          contactId: contact?.contactId || null,
          companyId: selectedId,
          orderDate: orderDate,
          totalAmount: totalAmountSum,
          status: "PENDING",
          memo: memo || null,
        },
        orderItems: basketList.map((item) => ({
          orderItemId: null,
          orderId: null,
          materialId: item.id,
          unitPrice: item.material.unitPrice,
          amount: item.totalAmount,
          quantity: item.orderQuantity,
        })),
      };

      await writeOrderApi.writeOrder(orderPayload);
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
              <input placeholder="주문자명" required />
            </FormField>

            <FormField label="발주일" required icon={<FiCalendar />}>
              <input type="date" defaultValue={orderDate} readOnly />
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
              <select onChange={handleCompanyChange} value={selectedId || ""}>
                <option value="">거래처를 선택하세요</option>

                {supplierList.length > 0 ? (
                  supplierList.map((item, index) => (
                    <option key={`${item.id}-${index}`} value={String(item.id)}>
                      {item.companyName}
                    </option>
                  ))
                ) : (
                  <option key="no-supplier" disabled value="">
                    등록된 공급업체가 없습니다
                  </option>
                )}
              </select>
            </FormField>

            <FormField label="담당자명" icon={<FiUser />}>
              <input value={contact?.contactName ?? ""} readOnly />
            </FormField>

            <FormField label="연락처" icon={<FiPhone />}>
              <input value={contact?.phone ?? ""} readOnly />
            </FormField>

            <FormField label="이메일" icon={<FiMail />}>
              <input value={contact?.email ?? ""} readOnly />
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
              {selectedMaterial.length > 0 ? (
                selectedMaterial.map((item) => (
                  <option key={item.materialId} value={item.materialId}>
                    {item.materialName}
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
                    <tr key={item.id}>
                      <td className="order-material-name">
                        {item.material.materialName}
                      </td>

                      <td>
                        {item.orderQuantity} {item.material.unit}
                      </td>
                      <td>{item.material.specification}</td>
                      <td>{item.material.unitPrice.toLocaleString()}</td>
                      <td>{item.totalAmount.toLocaleString()}</td>
                      <td>
                        <button
                          type="button"
                          className="delete-item-btn"
                          onClick={() => handleRemoveItem(item.material.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="empty-table" colSpan={8}>
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
