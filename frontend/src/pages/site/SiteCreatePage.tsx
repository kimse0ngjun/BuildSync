import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/SiteForm.css";

function SiteCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const [notes, setNotes] = useState([""]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNote = () => {
    setNotes((prev) => [...prev, ""]);
  };

  const removeNote = (index) => {
    setNotes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      notes,
    };

    console.log("등록 데이터:", payload);
    navigate("/site");
  };

  return (
    <div className="site-create-page">
      <h1>공사 현장 등록</h1>

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
            <option value="">선택</option>
            <option value="신축">신축</option>
            <option value="증축">증축</option>
            <option value="리모델링">리모델링</option>
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

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="예정">예정</option>
          <option value="진행중">진행중</option>
          <option value="중단">중단</option>
          <option value="완료">완료</option>
        </select>
      </section>

      <section>
        <h2>메모</h2>

        {notes.map((note, index) => (
          <div key={index}>
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
        <button onClick={handleSubmit}>등록</button>
      </div>
    </div>
  );
}

export default SiteCreatePage;
