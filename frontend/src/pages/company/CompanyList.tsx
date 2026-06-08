import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../../styles/CompanyList.css";
import { useNavigate } from "react-router-dom";

const companies = [
  {
    id: 7,
    type: "공급업체",
    name: "대한건설자재",
    ceo: "김철수",
    phone: "010-1234-5678",
    address: "부산광역시 부산진구 중앙대로 708, 5층",
    materials: "시멘트, 철근",
  },
  {
    id: 6,
    type: "건설업체",
    name: "한빛건설",
    ceo: "이민호",
    phone: "010-2345-6789",
    address: "서울특별시 강남구 테헤란로 120",
    materials: "-",
  },
  {
    id: 5,
    type: "공급업체",
    name: "대성철강",
    ceo: "박지훈",
    phone: "010-3456-7890",
    address: "인천광역시 남동구 산업로 45",
    materials: "철근, H빔",
  },
  {
    id: 4,
    type: "공급업체",
    name: "삼화시멘트",
    ceo: "최영수",
    phone: "010-4567-8901",
    address: "대전광역시 유성구 과학로 21",
    materials: "시멘트",
  },
  {
    id: 3,
    type: "건설업체",
    name: "동부건설",
    ceo: "정하늘",
    phone: "010-5678-9012",
    address: "부산광역시 해운대구 센텀중앙로 97",
    materials: "-",
  },
  {
    id: 2,
    type: "공급업체",
    name: "우진자재",
    ceo: "강민수",
    phone: "010-6789-0123",
    address: "경기도 수원시 영통구 광교로 11",
    materials: "목재, 유리",
  },
  {
    id: 1,
    type: "건설업체",
    name: "대한건설",
    ceo: "김철수",
    phone: "010-1234-5678",
    address: "부산광역시 부산진구 중앙대로 708, 5층",
    materials: "-",
  },
];

function CompanyList() {
  const navigate = useNavigate();

  return (
    <div className="company-page">
      <div className="company-header">
        <div>
          <p className="page-label">업체 관리</p>
          <h1>업체 목록</h1>
          <p className="page-desc">
            등록된 건설업체와 공급업체 정보를 조회하고 관리하세요.
          </p>
        </div>
      </div>

      <div className="company-card">
        <div className="company-toolbar">
          <div className="company-summary">
            <strong>총 7개</strong>의 업체가 등록되어 있습니다.
          </div>

          <div className="company-search">
            <FiSearch />
            <input placeholder="업체명, 대표자, 연락처 검색..." />
          </div>
        </div>

        <div className="company-filter">
          <button className="active">전체</button>
          <button>건설업체</button>
          <button>공급업체</button>
        </div>

        <table className="company-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>유형</th>
              <th>업체명</th>
              <th>대표자</th>
              <th>연락처</th>
              <th>주소</th>
              <th>취급 자재</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr
                key={company.id}
                onClick={() => navigate(`/company/${company.id}`)}
              >
                <td>{company.id}</td>
                <td>
                  <span
                    className={
                      company.type === "공급업체"
                        ? "type-badge supplier"
                        : "type-badge builder"
                    }
                  >
                    {company.type}
                  </span>
                </td>
                <td className="company-name">{company.name}</td>
                <td>{company.ceo}</td>
                <td>{company.phone}</td>
                <td>{company.address}</td>
                <td>{company.materials}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button>
            <FiChevronLeft />
          </button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5</button>
          <button>
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyList;
