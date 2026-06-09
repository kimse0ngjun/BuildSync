import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MaterialUsagePage.css";

function MaterialUsagePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [usages, setUsages] = useState([
    {
      id: 1,
      date: "2026-06-01",
      siteName: "강남 오피스 신축",
      materialName: "시멘트",
      quantity: 120,
      unit: "포대",
      manager: "홍길동",
    },
    {
      id: 2,
      date: "2026-06-02",
      siteName: "송도 아파트 건설",
      materialName: "철근",
      quantity: 50,
      unit: "톤",
      manager: "김철수",
    },
  ]);

  const handleDelete = (id) => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;

    setUsages((prev) => prev.filter((item) => item.id !== id));
  };

  const filtered = usages.filter(
    (u) =>
      u.siteName.includes(search) ||
      u.materialName.includes(search) ||
      u.manager.includes(search),
  );

  return (
    <div className="material-page">
      <div className="material-header">
        <h1>자재 사용 현황</h1>
      </div>

      {/* 검색 */}
      <div className="material-search">
        <input
          placeholder="현장명 / 자재명 / 담당자 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 테이블 */}
      <table className="material-table">
        <thead>
          <tr>
            <th>사용일</th>
            <th>현장명</th>
            <th>자재명</th>
            <th>수량</th>
            <th>단위</th>
            <th>담당자</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.siteName}</td>
              <td>{item.materialName}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>{item.manager}</td>

              <td>
                <button onClick={() => navigate(`/material/edit/${item.id}`)}>
                  수정
                </button>

                <button onClick={() => handleDelete(item.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaterialUsagePage;
