import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiHome,
  FiMapPin,
  FiPackage,
  FiChevronRight,
  FiChevronLeft,
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiCalendar,
  FiX,
} from "react-icons/fi";
import adminApi from "../api/adminApi";
import "../styles/Dashboard.css";

type PendingCompany = {
  companyId: number;
  companyType: string;
  loginId: string;
  companyName: string;
  ceoName: string;
  businessNumber: string;
  phone: string;
  homepageUrl: string;
  address: string;
  email: string;
  createdAt: string;
  status: string;
};

type RecentCompany = {
  companyId: number;
  companyName: string;
  companyType: string;
  createdAt: string;
};

type MaterialCategory = {
  categoryId: number;
  categoryName: string;
  createdAt: string;
};

type AdminDashboard = {
  pendingCompanyCount: number;
  totalCompanyCount: number;
  totalSiteCount: number;
  totalMaterialCount: number;
  todaySignupCount: number;
  monthlySignupCount: number;
  activeCompanyCount: number;
  monthlyCompletedCount: number;
  monthlySiteCount: number;
  monthlyMaterialCount: number;
  systemUserCount: number;
  recentCompanies: RecentCompany[];
};

function DashboardPage() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [pendingList, setPendingList] = useState<PendingCompany[]>([]);
  const [pendingPage, setPendingPage] = useState(0);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const [categoryList, setCategoryList] = useState<MaterialCategory[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<PendingCompany | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const size = 10;

  const fetchDashboard = async () => {
    try {
      const data: AdminDashboard = await adminApi.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error(error);
      alert("운영자 대시보드 정보를 불러오지 못했습니다.");
    }
  };

  const fetchPendingCompanies = async () => {
    try {
      const data = await adminApi.getPendingCompanies({
        page: pendingPage,
        size,
      });

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.list)
          ? data.list
          : Array.isArray(data.content)
            ? data.content
            : Array.isArray(data.companies)
              ? data.companies
              : [];

      setPendingList(list);
      setPendingTotalPages(data.totalPages ?? 1);
    } catch (error) {
      console.error(error);
      alert("승인 대기 업체 목록을 불러오지 못했습니다.");
    }
  };

  const fetchCategories = async () => {
    try {
      const data: MaterialCategory[] = await adminApi.getMaterialCategories();
      setCategoryList(data);
    } catch (error) {
      console.error(error);
      alert("자재 카테고리 목록을 불러오지 못했습니다.");
    }
  };

  const reloadAdminData = async () => {
    await Promise.all([fetchDashboard(), fetchPendingCompanies()]);
  };

  useEffect(() => {
    if (!isAdmin) return;

    fetchDashboard();
    fetchCategories();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    fetchPendingCompanies();
  }, [isAdmin, pendingPage]);

  const handleApprove = async (id: number) => {
    const ok = window.confirm("해당 업체를 승인하시겠습니까?");
    if (!ok) return;

    try {
      setLoading(true);

      await adminApi.approveCompany(id);

      setPendingList((prev) =>
        prev.filter((company) => company.companyId !== id),
      );

      setSelectedCompany(null);
      alert("승인 처리되었습니다.");

      await reloadAdminData();
    } catch (error) {
      console.error(error);
      alert("승인 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    const ok = window.confirm("해당 업체를 반려하시겠습니까?");
    if (!ok) return;

    try {
      setLoading(true);

      await adminApi.rejectCompany(id);

      setPendingList((prev) =>
        prev.filter((company) => company.companyId !== id),
      );

      setSelectedCompany(null);
      alert("반려 처리되었습니다.");

      await reloadAdminData();
    } catch (error) {
      console.error(error);
      alert("반려 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (
    categoryId: number,
    categoryName: string,
  ) => {
    const ok = window.confirm(`${categoryName} 카테고리를 삭제하시겠습니까?`);
    if (!ok) return;

    try {
      await adminApi.deleteMaterialCategory(categoryId);
      alert("카테고리가 삭제되었습니다.");
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("카테고리 삭제에 실패했습니다.");
    }
  };

  if (!isAdmin) {
    return (
      <div>
        <h1>메인 대시보드</h1>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-label">운영자 관리</p>
          <h1>운영자 대시보드</h1>
          <p className="admin-dashboard-desc">
            시스템 전체 현황을 한눈에 확인하고 관리할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="admin-stat-grid">
        <StatCard
          icon={<FiUsers />}
          title="승인 대기 업체"
          value={String(dashboard?.pendingCompanyCount ?? 0)}
          unit="개"
        />
        <StatCard
          icon={<FiHome />}
          title="전체 업체"
          value={String(dashboard?.totalCompanyCount ?? 0)}
          unit="개"
        />
        <StatCard
          icon={<FiMapPin />}
          title="전체 현장"
          value={String(dashboard?.totalSiteCount ?? 0)}
          unit="개"
        />
        <StatCard
          icon={<FiPackage />}
          title="전체 자재"
          value={String(dashboard?.totalMaterialCount ?? 0)}
          unit="개"
        />
      </div>

      <div className="admin-dashboard-layout">
        <section className="admin-card pending-card">
          <div className="admin-card-header">
            <h2>승인 대기 업체</h2>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>업체명</th>
                <th>업체 유형</th>
                <th>사업자번호</th>
                <th>가입일</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {pendingList.length === 0 ? (
                <tr>
                  <td colSpan={5}>승인 대기 업체가 없습니다.</td>
                </tr>
              ) : (
                pendingList.map((company) => (
                  <tr key={company.companyId}>
                    <td>
                      <div className="company-name-cell">
                        <span>{company.companyName.slice(0, 1)}</span>
                        <strong>{company.companyName}</strong>
                      </div>
                    </td>
                    <td>{company.companyType}</td>
                    <td>{company.businessNumber}</td>
                    <td>{company.createdAt?.slice(0, 10)}</td>
                    <td>
                      <div className="approve-actions">
                        <button
                          className="detail-view-btn"
                          onClick={() => setSelectedCompany(company)}
                        >
                          자세히 보기
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="admin-pagination">
            <button
              onClick={() => {
                if (pendingPage > 0) setPendingPage(pendingPage - 1);
              }}
              disabled={pendingPage === 0}
            >
              <FiChevronLeft />
            </button>

            {Array.from({ length: pendingTotalPages }, (_, index) => (
              <button
                key={index}
                className={pendingPage === index ? "active" : ""}
                onClick={() => setPendingPage(index)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => {
                if (pendingPage < pendingTotalPages - 1) {
                  setPendingPage(pendingPage + 1);
                }
              }}
              disabled={pendingPage >= pendingTotalPages - 1}
            >
              <FiChevronRight />
            </button>
          </div>
        </section>

        <section className="admin-card category-card">
          <div className="admin-card-header">
            <h2>자재 카테고리 관리</h2>
            <button
              className="category-add-btn"
              onClick={() => navigate("/admin/material-categories/create")}
            >
              <FiPlus />
              카테고리 등록
            </button>
          </div>

          <table className="admin-table category-table">
            <thead>
              <tr>
                <th>카테고리명</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {categoryList.length === 0 ? (
                <tr>
                  <td colSpan={3}>등록된 카테고리가 없습니다.</td>
                </tr>
              ) : (
                categoryList.map((category) => (
                  <tr key={category.categoryId}>
                    <td>
                      <strong>{category.categoryName}</strong>
                    </td>
                    <td>{category.createdAt?.slice(0, 10)}</td>
                    <td>
                      <div className="category-actions">
                        <button
                          className="edit"
                          onClick={() =>
                            navigate(
                              `/admin/material-categories/edit/${category.categoryId}`,
                              { state: category },
                            )
                          }
                        >
                          <FiEdit3 />
                        </button>
                        <button
                          className="delete"
                          onClick={() =>
                            handleDeleteCategory(
                              category.categoryId,
                              category.categoryName,
                            )
                          }
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <aside className="admin-side">
          <section className="admin-card system-card">
            <div className="admin-card-header">
              <h2>시스템 현황</h2>
              <span>{new Date().toISOString().slice(0, 10)} 기준</span>
            </div>

            <SystemRow
              icon={<FiUsers />}
              label="오늘 신규 가입"
              value={`${dashboard?.todaySignupCount ?? 0}개`}
            />
            <SystemRow
              icon={<FiCalendar />}
              label="이번달 신규 가입"
              value={`${dashboard?.monthlySignupCount ?? 0}개`}
            />
            <SystemRow
              icon={<FiMapPin />}
              label="이번달 승인 완료"
              value={`${dashboard?.monthlyCompletedCount ?? 0}개`}
            />
            <SystemRow
              icon={<FiHome />}
              label="이번달 현장 등록"
              value={`${dashboard?.monthlySiteCount ?? 0}개`}
            />
            <SystemRow
              icon={<FiPackage />}
              label="이번달 자재 등록"
              value={`${dashboard?.monthlyMaterialCount ?? 0}개`}
            />
            <SystemRow
              icon={<FiUsers />}
              label="시스템 사용자 수"
              value={`${dashboard?.systemUserCount ?? 0}명`}
            />
          </section>

          <section className="admin-card recent-card">
            <div className="admin-card-header">
              <h2>최근 가입 업체</h2>
            </div>

            <table className="recent-table">
              <thead>
                <tr>
                  <th>업체명</th>
                  <th>가입일</th>
                </tr>
              </thead>

              <tbody>
                {(dashboard?.recentCompanies ?? []).map((company) => (
                  <tr key={company.companyId}>
                    <td>
                      <span>{company.companyName.slice(0, 1)}</span>
                      {company.companyName}
                    </td>
                    <td>{company.createdAt?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </aside>
      </div>

      {selectedCompany && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>업체 상세 정보</h2>
              <button type="button" onClick={() => setSelectedCompany(null)}>
                <FiX />
              </button>
            </div>

            <div className="admin-modal-company">
              <div className="company-name-cell">
                <span>{selectedCompany.companyName.slice(0, 1)}</span>
                <strong>{selectedCompany.companyName}</strong>
              </div>
            </div>

            <div className="admin-modal-info">
              <Info label="업체명" value={selectedCompany.companyName} />
              <Info label="대표자명" value={selectedCompany.ceoName} />
              <Info label="업체 유형" value={selectedCompany.companyType} />
              <Info label="사업자번호" value={selectedCompany.businessNumber} />
              <Info label="연락처" value={selectedCompany.phone} />
              <Info label="이메일" value={selectedCompany.email} />
              <Info label="주소" value={selectedCompany.address} />
              <Info
                label="홈페이지"
                value={selectedCompany.homepageUrl || "-"}
              />
              <Info
                label="가입일"
                value={selectedCompany.createdAt?.slice(0, 10)}
              />
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="reject-btn"
                onClick={() => handleReject(selectedCompany.companyId)}
                disabled={loading}
              >
                반려
              </button>
              <button
                type="button"
                className="approve-btn"
                onClick={() => handleApprove(selectedCompany.companyId)}
                disabled={loading}
              >
                승인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  unit,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
}) {
  return (
    <section className="admin-stat-card">
      <div className="admin-stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        <span>{unit}</span>
      </div>
    </section>
  );
}

function SystemRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="system-row">
      <div>
        <span>{icon}</span>
        <p>{label}</p>
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="admin-modal-info-row">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

export default DashboardPage;
