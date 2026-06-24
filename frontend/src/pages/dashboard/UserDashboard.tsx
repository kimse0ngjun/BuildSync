import { useNavigate } from "react-router-dom";
import heroImage from "../../images/Hero.png";
import "../../styles/Dashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const companyType = localStorage.getItem("companyType");

  const isSupplier = companyType === "SUPPLIER" || companyType === "공급업체";

  return (
    <div className="user-dashboard-page">
      <section
        className="user-hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(250,250,250,0.98) 0%, rgba(250,250,250,0.9) 36%, rgba(250,250,250,0.25) 100%), url(${heroImage})`,
        }}
      >
        <div className="user-hero-content">
          <p className="user-eyebrow">
            건설 현장 기반 자재 및 발주 통합 관리 플랫폼
          </p>

          <h1>
            건설 자재 발주·재고 관리를
            <br />한 곳에서 <span>간편하게</span>
          </h1>

          <p className="user-hero-desc">
            BuildSync는 자재 재고, 발주 요청, 납품 상태, 공사 일정과 비용 흐름을
            통합 관리하는 웹 기반 시스템입니다.
          </p>

          <div className="user-hero-actions">
            <button onClick={() => navigate("/material")}>자재 확인하기</button>
            <button
              className="outline"
              onClick={() => navigate("/order/write")}
            >
              발주 요청하기
            </button>
          </div>
        </div>
      </section>

      <section className="quick-menu">
        <p className="section-label">Quick Menu</p>
        <h2>주요 기능 바로가기</h2>

        <div className="quick-grid-main">
          <QuickCard
            title="거래처"
            icon="🏢"
            desc="건설업체와 공급업체 정보를 확인합니다."
            onClick={() => navigate("/company")}
          />

          <QuickCard
            title="자재"
            icon="📦"
            desc="전체 자재 목록과 재고 정보를 조회합니다."
            onClick={() => navigate("/material")}
          />

          <QuickCard
            title="발주"
            icon="📝"
            desc="자재 발주 요청과 발주 내역을 관리합니다."
            onClick={() => navigate("/order/write")}
          />

          {!isSupplier && (
            <QuickCard
              title="현장"
              icon="🏗"
              desc="공사 현장 정보와 진행 상태를 관리합니다."
              onClick={() => navigate("/site")}
            />
          )}

          {!isSupplier && (
            <QuickCard
              title="자재 사용"
              icon="🚧"
              desc="현장별 자재 사용 내역을 확인합니다."
              onClick={() => navigate("/site/material")}
            />
          )}

          <QuickCard
            title="비용 분석"
            icon="📊"
            desc="자재비와 현장 비용 흐름을 분석합니다."
            onClick={() => navigate("/analysis")}
          />
        </div>
      </section>
    </div>
  );
}

function QuickCard({
  title,
  icon,
  desc,
  onClick,
}: {
  title: string;
  icon: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <div className="quick-card" onClick={onClick}>
      <div className="quick-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function ProcessCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="process-card">
      <span>{step}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export default UserDashboard;
