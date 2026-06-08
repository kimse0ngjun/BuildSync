import { useNavigate } from "react-router-dom";
import heroImage from "../images/Hero.png";
import adsImage from "../images/Ads.png";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="logo">
          <div className="logo-icon">B</div>
          <span className="landing-logo-text">
            <span className="logo-build">Build</span>
            <span className="logo-sync">Sync</span>
          </span>
        </div>

        <nav className="nav">
          <a href="#intro">서비스 소개</a>
          <a href="#features">핵심 기능</a>
          <a href="#process">프로세스</a>
          <button className="login-btn">로그인</button>
        </nav>
      </header>

      <section
        className="hero"
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

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              시작하기
            </button>
            <button className="outline-btn">기능 보기</button>
          </div>
        </div>
      </section>

      <section className="intro" id="intro">
        <div className="intro-text">
          <h2>
            왜 <span>BuildSync</span>가 필요한가요?
          </h2>
          <p>
            건설 현장에서는 자재 부족, 발주 누락, 납품 지연, 비용 파악
            어려움으로 인해
            <br />
            공사 일정이 지연될 수 있습니다.
            <br />
            BuildSync는 자재·발주·현장·일정·비용 데이터를 하나의 흐름으로 연결해
            <br />
            관리 효율을 높입니다.
          </p>
        </div>

        <div className="intro-icons">
          <div>📋</div>
          <div>👷</div>
          <div>📦</div>
        </div>
      </section>

      <section className="features" id="features">
        <SectionTitle title="핵심 기능" />

        <div className="feature-grid">
          <FeatureCard number="01" icon="📦" title="자재 관리">
            자재 등록, 현재 재고 조회, 최소 재고 설정 및 재고 부족 알림을
            제공합니다.
          </FeatureCard>

          <FeatureCard number="02" icon="📋" title="발주 관리">
            발주 요청부터 승인, 납품 상태 조회, 입고 처리까지 한 화면에서
            관리합니다.
          </FeatureCard>

          <FeatureCard number="03" icon="🏗️" title="현장 관리">
            공사 현장별 자재 사용량과 사용 비용을 확인하고 현장 상태를
            관리합니다.
          </FeatureCard>

          <FeatureCard number="04" icon="📊" title="비용 분석">
            월별, 거래처별, 자재별, 현장별 비용 데이터를 차트로 분석합니다.
          </FeatureCard>
        </div>
      </section>

      <section className="process" id="process">
        <SectionTitle title="시스템 프로세스" />
        <p className="section-desc">
          거래처 등록부터 비용 분석까지 자연스럽게 이어지는 관리 흐름
        </p>

        <div className="process-list">
          {[
            ["1", "👥", "거래처 등록"],
            ["2", "📦", "자재 등록"],
            ["3", "📋", "발주 요청"],
            ["4", "🚚", "입고 처리"],
            ["5", "🏢", "현장 사용"],
            ["6", "📊", "비용 분석"],
          ].map(([num, icon, label]) => (
            <div className="process-item" key={num}>
              <div
                className={
                  num === "1" ? "process-circle active" : "process-circle"
                }
              >
                <strong>{num}</strong>
                <span>{icon}</span>
              </div>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ads">
        <img src={adsImage} alt="건설 현장 배경" />
        <div className="ads-overlay" />

        <div className="ads-content">
          <div>
            <h2>
              BuildSync로 현장 자재 관리를
              <br />더 단순하게
            </h2>
            <p>
              자재 재고, 발주 요청, 납품 현황, 비용 분석을 하나의 서비스에서
              확인하세요.
            </p>
          </div>

          <button className="cta-btn" onClick={() => navigate("/dashboard")}>
            Go to Start →
          </button>
        </div>
      </section>

      <footer className="footer">
        <div>
          <h3>BuildSync</h3>
          <p>건설 자재 발주·재고 통합 관리 시스템</p>
          <small>© 2026 BuildSync. All rights reserved.</small>
        </div>

        <div className="footer-links">
          <a href="#intro">서비스 소개</a>
          <a href="#features">핵심 기능</a>
          <a href="#process">프로세스</a>
          <a href="#">로그인</a>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="section-title">{title}</h2>;
}

function FeatureCard({
  number,
  icon,
  title,
  children,
}: {
  number: string;
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="feature-card">
      <span className="feature-number">{number}</span>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export default LandingPage;
