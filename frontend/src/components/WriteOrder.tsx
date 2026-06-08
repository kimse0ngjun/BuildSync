import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { writeOrderApi } from "../api/api";
import type {
  Company,
  Contact,
  Material,
  OrderDetail,
  SelectedMaterialItem,
} from "../types/OrderDTO";
import "../css/WriteOrder.css";
import { FiUser } from "react-icons/fi";
import { MdCalendarToday } from "react-icons/md";
import { IoOptionsOutline } from "react-icons/io5";
import { BsTelephone } from "react-icons/bs";
import { IoMailOutline } from "react-icons/io5";
import { TbBlocks } from "react-icons/tb";

export const WriteOrder = () => {
  const nav = useNavigate();

  // 발주서 작성 오늘 날짜 표시
  const orderDate = new Date().toISOString().split("T")[0];

  // 공급업체 목록 상태
  const [supplierList, setSupplierList] = useState<Company[]>([]);
  useEffect(() => {
    writeOrderApi
      .getSupplierList()
      .then((data) => setSupplierList(data))
      .catch(console.error);
  }, []);

  // 발주서에 선택한 공급업체 ID
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 발주서에 선택한 자재 정보
  const [selectedMaterial, setSelectMaterial] = useState<Material[]>([]);
  useEffect(() => {
    writeOrderApi
      .getOurCompanyMaterial()
      .then((data) => setSelectMaterial(data))
      .catch(console.error);
  }, []);

  // 자재&수량 입력 받기
  const [inputMaterialId, setInputMaterialId] = useState<number>(0);
  const [inputQuantity, setInputQuantity] = useState<number>(0);

  // 하단 표에 데이터 담기
  const [basketList, setBasketList] = useState<SelectedMaterialItem[]>([]);

  // 선택한 자재 ID로 자재 정보 자동 출력
  const ourCompanyMaterialInfo = selectedMaterial.find(
    (m) => m.materialId === inputMaterialId,
  );

  // 선택한 회사의 담당자
  const [contact, setContact] = useState<Contact | null>(null);

  // 회사 선택 핸들러
  const handleCompanyChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const companyId = Number(e.target.value);
    setSelectedId(companyId);

    if (!companyId) {
      try {
        const data = await writeOrderApi.getContactList(companyId);

        if (data && data.length > 0) {
          setContact(data[0]);
        } else {
          setContact(null);
        }
      } catch (error) {
        console.error("담당자 로드 실패:", error);
        setContact(null);
      }
    } else {
      setContact(null);
    }
  };

  // 자재 추가 핸들러
  const handleAddMaterial = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!ourCompanyMaterialInfo) {
      alert("자재를 선택해 주세요.");
      return;
    }

    if (inputQuantity <= 0) {
      alert("발주 수량을 1개 이상 입력해 주세요.");
      return;
    }

    const isExist = basketList.some(
      (item) => item.materialId === ourCompanyMaterialInfo.materialId,
    );
    if (isExist) {
      alert(
        "이미 목록에 추가된 자재입니다. 수정이 필요하시면 삭제 후 다시 추가해 주세요.",
      );
      return;
    }

    const newItem: SelectedMaterialItem = {
      ...ourCompanyMaterialInfo,
      orderQuantity: inputQuantity,
      totalAmount: ourCompanyMaterialInfo.price * inputQuantity,
    };

    setBasketList([...basketList, newItem]);
    setInputQuantity(0);
  };

  // 자재 선택 삭제 핸들러
  const handleRemoveItem = (id: number) => {
    setSelectMaterial(basketList.filter((item) => item.materialId !== id));
  };

  // 선택 자재 총 합계 금액 계산
  const totalAmountSum = basketList.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  // 발주서 업로드
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
      const orderQuest = basketList.map((item) => {
        const order: OrderDetail = {
          orderId: 0,
          contactId: contact?.contactId || 0,
          companyId: selectedId,
          orderDate: new Date(orderDate),
          totalAmount: totalAmountSum,
          status: "PENDING",
          memo: "",

          orderItemId: 0,
          materialId: item.materialId,
          unitPrice: item.price,
          unit: item.unit,
          amount: item.totalAmount,
          quantity: item.orderQuantity,
        };

        return writeOrderApi.writeOrder(order);
      });
      await Promise.all(orderQuest);
      alert("발주서 전송이 완료되었습니다.");
      nav("");
    } catch (error) {
      console.error("발주서 전송 실패: ", error);
      alert("서버 오류로 발주서 전송에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="container">
      <h1 className="main-title">발주서</h1>

      <form className="write-order-form" onSubmit={handleUploadOrder}>
        <div className="basic-header-area">
          <h2 className="form-title">
            기본 정보<span className="point"> *</span>
          </h2>
          <small className="explain">기본 정보를 작성해 주세요.</small>
        </div>

        <div className="basic-input-area">
          <FiUser className="user-icon" />
          <input
            placeholder="주문자명"
            className="write-name"
            type="text"
            required
          />

          <label className="label-date">발주일</label>
          <input
            type="date"
            defaultValue={orderDate}
            className="write-date"
            readOnly
          />
          <MdCalendarToday className="date-icon" />
        </div>

        <div className="contact-header-area">
          <h2 className="form-title">
            거래처 정보<span className="point"> *</span>
          </h2>
          <small className="explain">거래처 정보를 작성해 주세요.</small>
        </div>

        <div className="contact-input-area">
          <IoOptionsOutline className="option-icon" />
          <select className="select-company" onChange={handleCompanyChange}>
            <option disabled selected className="selected-default">
              거래처 선택
            </option>
            {supplierList && supplierList.length > 0 ? (
              supplierList.map((list) => (
                <option
                  key={list.companyId}
                  value={list.companyId}
                  className="company-list"
                >
                  {list.companyName}
                </option>
              ))
            ) : (
              <option className="no-data">등록된 거래처가 없습니다.</option>
            )}
          </select>

          {contact && (
            <div>
              <FiUser className="user-icon" />
              <input
                type="text"
                className="company-contact-name"
                value={contact.contactName}
                readOnly
              />

              <BsTelephone className="tel-icon" />
              <input
                type="tel"
                className="company-contact-tel"
                value={contact.phone}
                readOnly
              />

              <IoMailOutline className="email-icon" />
              <input
                type="email"
                className="company-contact-email"
                value={contact.email}
                readOnly
              />
            </div>
          )}
        </div>

        <div className="order-header-area">
          <h2 className="form-title">
            발주 품목<span className="point"> *</span>
          </h2>
          <small className="explain">발주를 요청할 품목을 선택해 주세요.</small>
        </div>

        <div className="order-input-area">
          <TbBlocks className="block-icon" />
          <select
            className="select-material"
            value={inputMaterialId}
            onChange={(e) => setInputMaterialId(Number(e.target.value))}
          >
            <option value={0} className="selected-default">
              자재 선택
            </option>
            {selectedMaterial.map((m) => (
              <option
                key={m.materialId}
                value={m.materialId}
                className="option"
              >
                {m.materialName}
              </option>
            ))}
          </select>
          <input
            placeholder="수량을 입력해 주세요."
            type="number"
            value={inputQuantity === 0 ? "" : inputQuantity}
            onChange={(e) => setInputQuantity(Number(e.target.value))}
            className="selected-quantity"
          />
          <p className="unit">
            {ourCompanyMaterialInfo ? ourCompanyMaterialInfo.unit : "-"}
          </p>
          <button type="button" className="btn-add" onClick={handleAddMaterial}>
            추가
          </button>

          <div className="container-table">
            <small className="explain-table">
              현재 귀사의 재고 현황이 표시됩니다.
            </small>
            <table className="wish-table">
              <thead className="thead">
                <tr className="thead-tr">
                  <th className="material-name">자재명</th>
                  <th className="current-stock">현재 재고</th>
                  <th className="min-stock">최소 재고</th>
                  <th className="order-stock">발주 수량</th>
                  <th className="specification">규격</th>
                  <th className="price">단가</th>
                  <th className="amount">금액</th>
                  <th></th>
                </tr>
              </thead>

              <tbody className="tbody">
                {basketList && basketList.length > 0 ? (
                  basketList.map((material) => (
                    <tr className="tbody-tr">
                      <td>
                        <strong className="name">
                          {material.materialName}
                        </strong>
                      </td>
                      <td className="current-stock">{material.currentStock}</td>
                      <td className="min-stock">{material.minimumStock}</td>
                      <td className="order-stock">
                        {material.orderQuantity} {material.unit}
                      </td>
                      <td className="specification">
                        {material.specification}
                      </td>
                      <td className="price">{material.price}</td>
                      <td className="amount">{material.totalAmount}</td>
                      <td className="icon">
                        <RiDeleteBin6Line
                          className="click-icon"
                          onClick={() => handleRemoveItem(material.materialId)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="tr-no-data">
                    <td className="td-no-data" colSpan={8}>
                      표시할 목록이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="total">합계 {totalAmountSum}원</div>
          </div>
        </div>

        <div className="container-etc">
          <h2 className="form-title">기타</h2>
          <p className="explain">추가 사항을 작성해 주세요.</p>
          <textarea className="write-etc" />
        </div>
        <div className="btn-area">
          <button className="btn-order" type="submit">
            발주
          </button>
          <button className="btn-cancel" onClick={() => nav(-1)} type="button">
            취소
          </button>
        </div>
      </form>
    </div>
  );
};
