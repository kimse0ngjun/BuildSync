import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiMapPin,
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiFlag,
  FiSave,
} from "react-icons/fi";
import "../../styles/SiteEditPage.css";

type SiteForm = {
  id: string;
  name: string;
  type: string;
  address: string;
  startDate: string;
  endDate: string;
  budget: string;
};

type SiteState = {
  id: number;
  siteName: string;
  constructionType: string;
  address: string;
  cost: number;
  status: string;
  startDate: string;
  expectedEndDate: string;
};

type FormFieldProps = {
  icon: ReactNode;
  label: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
};

function SiteEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<SiteForm>({
    id: "",
    name: "",
    type: "",
    address: "",
    startDate: "",
    endDate: "",
    budget: "",
  });

  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      return null;
    }

    return token;
  };

  const getAutoStatus = () => {
    if (!form.startDate || !form.endDate) return "예정";

    const today = new Date();
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (today < start) return "예정";
    if (today >= end) return "완료";
    return "진행중";
  };

  useEffect(() => {
    const stateData = location.state as SiteState | undefined;

    if (stateData) {
      setForm({
        id: String(stateData.id),
        name: stateData.siteName,
        type: stateData.constructionType,
        address: stateData.address,
        startDate: stateData.startDate,
        endDate: stateData.expectedEndDate,
        budget: String(stateData.cost),
      });
    } else if (id) {
      setForm((prev) => ({
        ...prev,
        id,
      }));
    }
  }, [id, location.state]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const siteId = form.id || id;

    if (!siteId) {
      alert("현장 ID가 없습니다.");
      return;
    }

    if (
      !form.name ||
      !form.type ||
      !form.address ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      alert("준공 예정일은 착공일보다 빠를 수 없습니다.");
      return;
    }

    if (form.budget && Number(form.budget) < 0) {
      alert("비용은 0 이상으로 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      const token = getToken();
      if (!token) return;

      const payload = {
        siteName: form.name,
        constructionType: form.type,
        address: form.address,
        cost: Number(form.budget || 0),
        status: getAutoStatus(),
        startDate: form.startDate,
        expectedEndDate: form.endDate,
      };

      const response = await fetch(
        `http://localhost:8080/api/sites/${siteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error("공사 현장 수정 실패");
      }

      alert("공사 현장이 수정되었습니다.");
      navigate("/site");
    } catch (error) {
      console.error(error);
      alert("공사 현장 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
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
                <option value="건축">건축</option>
                <option value="신축">신축</option>
                <option value="증축">증축</option>
                <option value="리모델링">리모델링</option>
                <option value="보수">보수</option>
                <option value="오피스">오피스</option>
                <option value="아파트">아파트</option>
                <option value="상가">상가</option>
              </select>
            </FormField>

            <FormField icon={<FiMapPin />} label="주소" required full>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="주소를 입력하세요"
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
            <FiDollarSign />
            <div>
              <h2>비용 및 상태</h2>
              <p>공사 비용과 일정에 따른 상태를 확인하세요.</p>
            </div>
          </div>

          <div className="site-edit-grid">
            <FormField icon={<FiDollarSign />} label="비용">
              <input
                name="budget"
                type="number"
                min="0"
                value={form.budget}
                onChange={handleChange}
                placeholder="예) 100000000"
              />
            </FormField>

            <FormField icon={<FiFlag />} label="상태">
              <input value={getAutoStatus()} readOnly />
            </FormField>
          </div>
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
            disabled={loading}
          >
            <FiSave />
            {loading ? "저장 중..." : "저장하기"}
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
