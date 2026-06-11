import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
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
import "../../styles/SiteEditPage.css";

type SiteForm = {
  id: string;
  name: string;
  type: string;
  address: string;
  detailAddress: string;
  startDate: string;
  endDate: string;
  manager: string;
  phone: string;
  budget: string;
  status: string;
  memo: string;
};

type FormFieldProps = {
  icon: ReactNode;
  label: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
};

const sampleSites: SiteForm[] = [
  {
    id: "1",
    name: "강남 오피스 신축",
    type: "신축",
    address: "서울특별시 강남구 테헤란로 120",
    detailAddress: "5층",
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    manager: "홍길동",
    phone: "010-1234-5678",
    budget: "100000000",
    status: "진행중",
    memo: "초기 공사 및 자재 점검 필요",
  },
  {
    id: "2",
    name: "송도 아파트 건설",
    type: "신축",
    address: "인천광역시 연수구 송도동 12",
    detailAddress: "101동",
    startDate: "2026-05-01",
    endDate: "2027-03-31",
    manager: "김철수",
    phone: "010-2222-3333",
    budget: "200000000",
    status: "진행중",
    memo: "파일럿 공사",
  },
];

function SiteEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [form, setForm] = useState<SiteForm>({
    id: "",
    name: "",
    type: "",
    address: "",
    detailAddress: "",
    startDate: "",
    endDate: "",
    manager: "",
    phone: "",
    budget: "",
    status: "예정",
    memo: "",
  });

  useEffect(() => {
    const stateData = location.state as SiteForm | undefined;
    const foundSite = sampleSites.find((site) => site.id === id);

    if (stateData) {
      setForm(stateData);
    } else if (foundSite) {
      setForm(foundSite);
    }
  }, [id, location.state]);

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
    console.log("현장 수정 데이터:", form);
    navigate("/site");
  };

  return (
    <div className="site-edit-page">
      <div className="site-edit-header">
        <button
          type="button"
          className="site-edit-back-btn"
          onClick={() => navigate("/site")}
        >
          <FiArrowLeft />
        </button>

        <div>
          <p className="site-edit-label">현장 관리</p>
          <h1>공사 현장 수정</h1>
          <p className="site-edit-desc">
            등록된 공사 현장의 기본 정보와 일정을 수정하세요.
          </p>
        </div>
      </div>

      <div className="site-edit-form">
        <section className="site-edit-section">
          <div className="site-edit-section-title">
            <FiHome />
            <div>
              <h2>기본 정보</h2>
              <p>현장명, 공사 유형, 주소를 수정하세요.</p>
            </div>
          </div>

          <div className="site-edit-grid">
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

            <FormField icon={<FiMapPin />} label="주소" required>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="주소를 입력하세요"
              />
            </FormField>

            <FormField icon={<FiMapPin />} label="상세 주소">
              <input
                name="detailAddress"
                value={form.detailAddress}
                onChange={handleChange}
                placeholder="상세 주소를 입력하세요"
              />
            </FormField>
          </div>
        </section>

        <section className="site-edit-section">
          <div className="site-edit-section-title">
            <FiCalendar />
            <div>
              <h2>공사 일정</h2>
              <p>착공일과 준공 예정일을 수정하세요.</p>
            </div>
          </div>

          <div className="site-edit-grid">
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

        <section className="site-edit-section">
          <div className="site-edit-section-title">
            <FiUser />
            <div>
              <h2>담당 정보</h2>
              <p>현장 담당자와 연락처를 수정하세요.</p>
            </div>
          </div>

          <div className="site-edit-grid">
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

        <section className="site-edit-section">
          <div className="site-edit-section-title">
            <FiDollarSign />
            <div>
              <h2>비용 및 상태</h2>
              <p>공사 비용과 현장 상태를 수정하세요.</p>
            </div>
          </div>

          <div className="site-edit-grid">
            <FormField icon={<FiDollarSign />} label="비용">
              <input
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="예) 100000000"
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

        <section className="site-edit-section">
          <div className="site-edit-section-title">
            <FiFileText />
            <div>
              <h2>메모</h2>
              <p>현장 관련 추가 사항을 수정하세요.</p>
            </div>
          </div>

          <textarea
            className="site-edit-memo"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="메모를 입력하세요. (선택사항)"
          />
        </section>

        <div className="site-edit-actions">
          <button
            type="button"
            className="site-edit-cancel-btn"
            onClick={() => navigate("/site")}
          >
            취소
          </button>

          <button
            type="button"
            className="site-edit-submit-btn"
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

function FormField({ icon, label, required, full, children }: FormFieldProps) {
  return (
    <label className={full ? "site-edit-field full" : "site-edit-field"}>
      <span>
        {icon}
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

export default SiteEditPage;
