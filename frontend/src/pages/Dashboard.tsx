import { useAuth } from "../context/AuthContext";
import LoginRequired from "../components/LoginRequired";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import { useNavigate } from "react-router-dom";
import heroImage from "../images/Hero.png";
import "../styles/Dashboard.css";

function DashboardPage() {
  const { isLogin } = useAuth();
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const navigate = useNavigate();

  if (!isLogin) {
    return <LoginRequired />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="dashboard-main">
      <section
        className="hero dashboard-hero"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <p className="eyebrow">
            건설 현장 기반 자재 및 발주 통합 관리 플랫폼
          </p>

          <h1>
            건설 자재 발주·재고 관리를
            <br />한 곳에서 <span>간편하게</span>
          </h1>

          <p className="hero-desc">
            BuildSync는 건설 현장의 자재 재고, 발주 요청, 납품 상태,
            <br />
            공사 일정과 비용 흐름을 통합 관리하는 웹 기반 시스템입니다.
          </p>
        </div>
      </section>

      <div className="quick-menu">
        <h2>주요 기능 바로가기</h2>

        <div className="quick-grid">
          <div className="quick-card" onClick={() => navigate("/company")}>
            <h3>🏢 거래처</h3>
            <p>업체 등록 및 관리</p>
          </div>

          <div className="quick-card" onClick={() => navigate("/material")}>
            <h3>📦 자재</h3>
            <p>자재 목록 </p>
          </div>

          <div className="quick-card" onClick={() => navigate("/order/white")}>
            <h3>📝 발주</h3>
            <p>발주 요청</p>
          </div>

          <div className="quick-card" onClick={() => navigate("/site")}>
            <h3>🏗 현장</h3>
            <p>공사 현장 관리</p>
          </div>

          <div className="quick-card" onClick={() => navigate("/company")}>
            <h3>🏢 거래처</h3>
            <p>업체 등록 및 관리</p>
          </div>

          <div className="quick-card" onClick={() => navigate("/analysis")}>
            <h3>📊 비용 분석</h3>
            <p>자재비 및 현장 비용 분석</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
