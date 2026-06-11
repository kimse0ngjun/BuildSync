import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBox,
  FiMapPin,
  FiUser,
  FiCalendar,
  FiHash,
  FiFileText,
  FiSave,
} from "react-icons/fi";
import "../../styles/MaterialUsageEditPage.css";

type UsageForm = {
  id: string;
  usedDate: string;
  siteId: string;
  siteName: string;
  materialId: string;
  materialName: string;
  quantity: string;
  unit: string;
  managerId: string;
  managerName: string;
  memo: string;
};

type FormFieldProps = {
  icon: ReactNode;
  label: string;
  required?: boolean;
  children: ReactNode;
};

const sampleUsages: UsageForm[] = [
  {
    id: "1",
    usedDate: "2026-06-01",
    siteId: "SITE-001",
    siteName: "강남 오피스 신축",
    materialId: "MAT-002",
    materialName: "시멘트",
    quantity: "120",
    unit: "포대",
    managerId: "CONTACT-001",
    managerName: "홍길동",
    memo: "1차 타설용",
  },
  {
    id: "2",
    usedDate: "2026-06-02",
    siteId: "SITE-002",
    siteName: "송도 아파트 건설",
    materialId: "MAT-001",
    materialName: "철근",
    quantity: "50",
    unit: "톤",
    managerId: "CONTACT-002",
    managerName: "김철수",
    memo: "기초 골조 작업",
  },
];

function MaterialUsageEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const selected =
    sampleUsages.find((item) => item.id === id) || sampleUsages[0];

  const [form, setForm] = useState<UsageForm>(selected);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      id: form.id,
      usedDate: form.usedDate,
      siteId: form.siteId,
      materialId: form.materialId,
      quantity: Number(form.quantity),
      unit: form.unit,
      managerId: form.managerId,
      memo: form.memo,
    };

    console.log("자재 사용 수정 데이터:", payload);
    navigate("/site/material");
  };

  return (
    <div className="usage-edit-page">
      <div className="usage-edit-header">
        <button
          type="button"
          className="usage-edit-back-btn"
          onClick={() => navigate("/site/material")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <p className="usage-edit-label">현장 관리</p>
          <h1>자재 사용 내역 수정</h1>
          <p className="usage-edit-desc">
            현장별 자재 사용 수량과 담당 정보를 수정하세요.
          </p>
        </div>
      </div>

      <div className="usage-edit-form">
        <section className="usage-edit-section">
          <div className="usage-edit-section-title">
            <FiCalendar />
            <div>
              <h2>사용 기본 정보</h2>
              <p>자재 사용일과 공사 현장을 확인하세요.</p>
            </div>
          </div>

          <div className="usage-edit-grid">
            <FormField icon={<FiCalendar />} label="사용일" required>
              <input
                type="date"
                name="usedDate"
                value={form.usedDate}
                onChange={handleChange}
              />
            </FormField>

            <FormField icon={<FiMapPin />} label="공사 현장" required>
              <select
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
              >
                <option value="강남 오피스 신축">강남 오피스 신축</option>
                <option value="송도 아파트 건설">송도 아파트 건설</option>
                <option value="부산 상가 리모델링">부산 상가 리모델링</option>
                <option value="판교 오피스 건설">판교 오피스 건설</option>
              </select>
            </FormField>
          </div>
        </section>

        <section className="usage-edit-section">
          <div className="usage-edit-section-title">
            <FiBox />
            <div>
              <h2>자재 정보</h2>
              <p>사용한 자재와 수량 정보를 수정하세요.</p>
            </div>
          </div>

          <div className="usage-edit-grid">
            <FormField icon={<FiBox />} label="자재명" required>
              <select
                name="materialName"
                value={form.materialName}
                onChange={handleChange}
              >
                <option value="시멘트">시멘트</option>
                <option value="철근">철근</option>
                <option value="벽돌">벽돌</option>
                <option value="페인트 18L">페인트 18L</option>
              </select>
            </FormField>

            <FormField icon={<FiHash />} label="사용 수량" required>
              <div className="usage-quantity-input">
                <input
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="수량을 입력하세요"
                />

                <select name="unit" value={form.unit} onChange={handleChange}>
                  <option value="포대">포대</option>
                  <option value="톤">톤</option>
                  <option value="EA">EA</option>
                  <option value="통">통</option>
                  <option value="롤">롤</option>
                </select>
              </div>
            </FormField>
          </div>
        </section>

        <section className="usage-edit-section">
          <div className="usage-edit-section-title">
            <FiUser />
            <div>
              <h2>담당 정보</h2>
              <p>자재 사용 처리 담당자를 수정하세요.</p>
            </div>
          </div>

          <div className="usage-edit-grid">
            <FormField icon={<FiUser />} label="담당자" required>
              <select
                name="managerName"
                value={form.managerName}
                onChange={handleChange}
              >
                <option value="홍길동">홍길동</option>
                <option value="김철수">김철수</option>
                <option value="이민호">이민호</option>
                <option value="박지훈">박지훈</option>
              </select>
            </FormField>

            <FormField icon={<FiFileText />} label="메모">
              <input
                name="memo"
                value={form.memo}
                onChange={handleChange}
                placeholder="간단한 메모를 입력하세요"
              />
            </FormField>
          </div>
        </section>

        <section className="usage-edit-section">
          <div className="usage-edit-section-title">
            <FiFileText />
            <div>
              <h2>추가 메모</h2>
              <p>자재 사용과 관련된 상세 내용을 입력하세요.</p>
            </div>
          </div>

          <textarea
            className="usage-edit-memo"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="메모를 입력하세요. (선택사항)"
            maxLength={300}
          />
        </section>

        <div className="usage-edit-actions">
          <button
            type="button"
            className="usage-edit-cancel-btn"
            onClick={() => navigate("/site/material")}
          >
            취소
          </button>

          <button
            type="button"
            className="usage-edit-submit-btn"
            onClick={handleSubmit}
          >
            <FiSave />
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ icon, label, required, children }: FormFieldProps) {
  return (
    <label className="usage-edit-field">
      <span>
        {icon}
        {label}
        {required && <em>*</em>}
      </span>

      {children}
    </label>
  );
}

export default MaterialUsageEditPage;
