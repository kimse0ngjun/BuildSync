import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiHome,
  FiCalendar,
  FiUser,
  FiPhone,
  FiDollarSign,
  FiFlag,
  FiFileText,
  FiSave,
} from "react-icons/fi";
import "../../styles/SiteCreatePage.css";

type SiteForm = {
  name: string;
  type: string;
  address: string;
  cost: string;
  status: string;
  startDate: string;
  endDate: string;
  manager: string;
  phone: string;
  memo: string;
};

type FormFieldProps = {
  icon: ReactNode;
  label: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
};

function SiteCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SiteForm>({
    name: "",
    type: "",
    address: "",
    cost: "",
    status: "예정",
    startDate: "",
    endDate: "",
    manager: "",
    phone: "",
    memo: "",
  });

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
      siteName: form.name,
      constructionType: form.type,
      address: form.address,
      cost: form.cost,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      manager: form.manager,
      phone: form.phone,
      memo: form.memo,
    };

    console.log("현장 등록 데이터:", payload);
    navigate("/site");
  };

  return (
    <div className="site-create-page">
      <div className="site-create-header">
        <button
          type="button"
          className="site-back-btn"
          onClick={() => navigate("/site")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <p className="site-create-label">현장 관리</p>
          <h1>공사 현장 등록</h1>
          <p className="site-create-desc">
            공사 현장의 기본 정보와 일정을 등록하세요.
          </p>
        </div>
      </div>

      <div className="site-create-form">
        <section className="site-form-section">
          <div className="site-section-title">
            <FiHome />
            <div>
              <h2>기본 정보</h2>
              <p>현장명, 공사 유형, 주소를 입력하세요.</p>
            </div>
          </div>

          <div className="site-form-grid">
            <FormField icon={<FiMapPin />} label="현장명" required>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="현장명을 입력하세요"
              />
            </FormField>

            <FormField icon={<FiHome />} label="공사 유형" required>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">공사 유형을 선택하세요</option>
                <option value="신축">신축</option>
                <option value="증축">증축</option>
                <option value="리모델링">리모델링</option>
                <option value="보수">보수</option>
              </select>
            </FormField>

            <FormField icon={<FiMapPin />} label="주소" required full>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="현장 주소를 입력하세요"
              />
            </FormField>
          </div>
        </section>

        <section className="site-form-section">
          <div className="site-section-title">
            <FiCalendar />
            <div>
              <h2>공사 일정</h2>
              <p>착공일과 준공 예정일을 입력하세요.</p>
            </div>
          </div>

          <div className="site-form-grid">
            <FormField icon={<FiCalendar />} label="착공일" required>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </FormField>

            <FormField icon={<FiCalendar />} label="준공 예정일" required>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </FormField>
          </div>
        </section>

        <section className="site-form-section">
          <div className="site-section-title">
            <FiUser />
            <div>
              <h2>담당 정보</h2>
              <p>현장 담당자와 연락처를 입력하세요.</p>
            </div>
          </div>

          <div className="site-form-grid">
            <FormField icon={<FiUser />} label="담당자" required>
              <input
                name="manager"
                value={form.manager}
                onChange={handleChange}
                placeholder="담당자 이름을 입력하세요"
              />
            </FormField>

            <FormField icon={<FiPhone />} label="연락처">
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="예) 010-1234-5678"
              />
            </FormField>
          </div>
        </section>

        <section className="site-form-section">
          <div className="site-section-title">
            <FiDollarSign />
            <div>
              <h2>비용 및 상태</h2>
              <p>공사 비용과 현장 상태를 입력하세요.</p>
            </div>
          </div>

          <div className="site-form-grid">
            <FormField icon={<FiDollarSign />} label="비용">
              <input
                name="cost"
                value={form.cost}
                onChange={handleChange}
                placeholder="예) 1250000000"
              />
            </FormField>

            <FormField icon={<FiFlag />} label="상태" required>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="예정">예정</option>
                <option value="진행중">진행중</option>
                <option value="중단">중단</option>
                <option value="완료">완료</option>
              </select>
            </FormField>
          </div>
        </section>

        <section className="site-form-section">
          <div className="site-section-title">
            <FiFileText />
            <div>
              <h2>메모</h2>
              <p>현장 관련 추가 사항을 작성하세요.</p>
            </div>
          </div>

          <textarea
            className="site-memo"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="메모를 입력하세요. (선택사항)"
            maxLength={300}
          />
        </section>

        <div className="site-form-actions">
          <button
            type="button"
            className="site-cancel-btn"
            onClick={() => navigate("/site")}
          >
            취소
          </button>

          <button
            type="button"
            className="site-submit-btn"
            onClick={handleSubmit}
          >
            <FiSave />
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ icon, label, required, full, children }: FormFieldProps) {
  return (
    <label className={full ? "site-form-field full" : "site-form-field"}>
      <span>
        {icon}
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

export default SiteCreatePage;
