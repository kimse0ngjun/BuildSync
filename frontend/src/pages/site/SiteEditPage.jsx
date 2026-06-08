import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../styles/SiteForm.css";

function SiteEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const siteData = location.state;

  const { id } = useParams();

  const [notes, setNotes] = useState([""]);

  const [form, setForm] = useState({
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
  });

  const sites = [
    {
      id: "1",
      name: "강남 오피스 신축",
      type: "신축",
      address: "서울 강남구",
      detailAddress: "테헤란로 123",
      startDate: "2026-06-01",
      endDate: "2026-12-31",
      manager: "홍길동",
      phone: "010-1234-5678",
      budget: "100000000",
      status: "진행중",
      notes: ["초기 공사", "자재 점검 필요"],
    },
    {
      id: "2",
      name: "송도 아파트 건설",
      type: "신축",
      address: "인천 연수구",
      detailAddress: "송도동 12",
      startDate: "2026-05-01",
      endDate: "2027-03-31",
      manager: "김철수",
      phone: "010-2222-3333",
      budget: "200000000",
      status: "진행중",
      notes: ["파일럿 공사"],
    },
  ];

  useEffect(() => {
    if (!siteData) return;

    setForm(siteData);
    setNotes(siteData.notes || [""]);
  }, [siteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNote = () => {
    setNotes([...notes, ""]);
  };

  const removeNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      notes,
    };

    console.log("수정 데이터:", payload);

    navigate("/site");
  };

  return (
    <div className="site-create-page">
      <h1>공사 현장 수정</h1>

      <section>
        <h2>기본 정보</h2>

        <div className="form-group">
          <label>
            현장명 <span className="required">*</span>
          </label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>
            공사 유형 <span className="required">*</span>
          </label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option>신축</option>
            <option>증축</option>
            <option>리모델링</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            주소 <span className="required">*</span>
          </label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>상세 주소</label>
          <input
            name="detailAddress"
            value={form.detailAddress}
            onChange={handleChange}
          />
        </div>
      </section>

      <section>
        <h2>공사 일정</h2>

        <div className="form-group">
          <label>
            착공일 <span className="required">*</span>
          </label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            준공 예정일 <span className="required">*</span>
          </label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>
      </section>

      <section>
        <h2>담당 정보</h2>

        <div className="form-group">
          <label>
            담당자 <span className="required">*</span>
          </label>
          <input name="manager" value={form.manager} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>연락처</label>
          <input name="phone" value={form.phone} onChange={handleChange} />
        </div>
      </section>

      <section>
        <h2>비용 정보</h2>

        <div className="form-group">
          <label>예상 예산</label>
          <input name="budget" value={form.budget} onChange={handleChange} />
        </div>
      </section>

      <section>
        <h2>상태</h2>

        <div className="form-group">
          <label>상태</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option>예정</option>
            <option>진행중</option>
            <option>중단</option>
            <option>완료</option>
          </select>
        </div>
      </section>

      <section>
        <h2>메모</h2>

        {notes.map((note, index) => (
          <div className="note-row" key={index}>
            <input
              value={note}
              onChange={(e) => {
                const updated = [...notes];
                updated[index] = e.target.value;
                setNotes(updated);
              }}
            />

            <button onClick={() => removeNote(index)}>-</button>
          </div>
        ))}

        <button onClick={addNote}>+ 메모 추가</button>
      </section>

      <div className="form-buttons">
        <button onClick={() => navigate("/site")}>취소</button>

        <button onClick={handleSubmit}>저장</button>
      </div>
    </div>
  );
}

export default SiteEditPage;
