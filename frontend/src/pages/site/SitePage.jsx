import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/SitePage.css";

function SitePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  const [sites, setSites] = useState([
    {
      id: 1,
      name: "강남 오피스 신축",
      address: "서울 강남구",
      startDate: "2026-06-01",
      endDate: "2026-12-31",
      status: "진행중",
    },
    {
      id: 2,
      name: "송도 아파트 건설",
      address: "인천 연수구",
      startDate: "2026-05-01",
      endDate: "2027-03-31",
      status: "진행중",
    },
  ]);

  const handleUpdateSite = (updatedSite) => {
    setSites((prev) =>
      prev.map((site) => (site.id === updatedSite.id ? updatedSite : site)),
    );
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    setSites((prev) => prev.filter((site) => site.id !== id));
  };

  const filteredSites = sites.filter(
    (site) => site.name.includes(search) || site.address.includes(search),
  );

  useEffect(() => {
    const updated = location.state?.updatedSite;
    if (!updated) return;

    setSites((prev) =>
      prev.map((site) => (site.id === updated.id ? updated : site)),
    );
  }, [location.state]);

  return (
    <div className="site-page">
      <div className="site-header">
        <div>
          <h1>공사 현장 관리</h1>
          {/* <p>공사 현장을 등록하고 관리합니다.</p> */}
        </div>

        <button
          className="site-add-btn"
          onClick={() => navigate("/site/create")}
        >
          + 현장 등록
        </button>
      </div>

      <div className="site-search">
        <input
          type="text"
          placeholder="현장명 또는 주소 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="site-table">
        <thead>
          <tr>
            <th>현장명</th>
            <th>주소</th>
            <th>착공일</th>
            <th>준공 예정일</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {filteredSites.length > 0 ? (
            filteredSites.map((site) => (
              <tr key={site.id}>
                <td>{site.name}</td>
                <td>{site.address}</td>
                <td>{site.startDate}</td>
                <td>{site.endDate}</td>
                <td>{site.status}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/site/edit/${site.id}`, {
                        state: site,
                      })
                    }
                  >
                    수정
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(site.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SitePage;
