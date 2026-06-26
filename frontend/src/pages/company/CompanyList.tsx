import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../../styles/CompanyList.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompanies } from "../../api/company";
import type { Company } from "../../types/company";

function CompanyList() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [type, setType] = useState("");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);

  const loadCompanies = async () => {
    try {
      const response = await getCompanies(page, keyword, type);

      const data = response.data;

      setCompanies(data?.list ?? []);
      setTotalElements(data?.totalElements ?? 0);
      setTotalPages(data?.totalPages ?? 1);
    } catch (error: any) {
      console.error(error);

      setCompanies([]);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [page, type, keyword]);

  const handleTypeChange = (t: string) => {
    setType(t);
    setPage(0);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPage(0);
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={page === i ? "active" : ""}
          onClick={() => setPage(i)}
        >
          {i + 1}
        </button>,
      );
    }
    return pages;
  };

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
            <strong>총 {totalElements}개</strong>의 업체가 등록되어 있습니다.
          </div>

          <div className="company-search">
            <FiSearch />
            <input
              placeholder="업체명, 대표자, 연락처 검색..."
              value={keyword}
              onChange={handleKeywordChange}
            />
          </div>
        </div>

        <div className="company-filter">
          <button
            className={type === "" ? "active" : ""}
            onClick={() => handleTypeChange("")}
          >
            전체
          </button>
          <button
            className={type === "CONSTRUCTION" ? "active" : ""}
            onClick={() => handleTypeChange("CONSTRUCTION")}
          >
            건설업체
          </button>
          <button
            className={type === "SUPPLIER" ? "active" : ""}
            onClick={() => handleTypeChange("SUPPLIER")}
          >
            공급업체
          </button>
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
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr
                key={company.companyId}
                onClick={() => navigate(`/company/${company.companyId}`)}
              >
                <td>{company.companyId}</td>
                <td>
                  <span
                    className={
                      company.companyType === "SUPPLIER"
                        ? "type-badge supplier"
                        : "type-badge builder"
                    }
                  >
                    {company.companyType === "SUPPLIER"
                      ? "공급업체"
                      : "건설업체"}
                  </span>
                </td>
                <td className="company-name">{company.companyName}</td>
                <td className="company-name">{company.ceoName}</td>
                <td className="company-name">{company.phone}</td>
                <td className="company-name">{company.address}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <FiChevronLeft />
          </button>

          {renderPages()}

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompanyList;
