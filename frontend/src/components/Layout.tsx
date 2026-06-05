import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiClipboard,
  FiMapPin,
  FiCalendar,
  FiPieChart,
  FiSettings,
  FiBell,
  FiChevronDown,
  FiLogIn,
  FiList,
  FiBox,
  FiTruck,
  FiEdit3,
  FiFileText,
  FiBarChart2,
  FiUser,
  FiShield,
  FiMoon,
  FiMail,
  FiAlertCircle,
} from "react-icons/fi";
import "../styles/Layout.css";

function Layout() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openBottom, setOpenBottom] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const toggleBottom = (menu: string) => {
    setOpenBottom((prev) => (prev === menu ? null : menu));
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-box">B</div>
          <span className="logo-text">
            <span className="logo-build">Build</span>
            <span className="logo-sync">Sync</span>
          </span>
        </div>

        <nav className="sidebar-menu">
          <NavLink to="/dashboard" className="menu-link">
            <FiHome />
            <span>Home</span>
          </NavLink>

          <MenuGroup
            icon={<FiUsers />}
            title="거래처 관리"
            isOpen={openMenu === "company"}
            onClick={() => toggleMenu("company")}
          >
            <NavLink to="/company">
              <FiList />
              업체 목록
            </NavLink>
          </MenuGroup>

          <MenuGroup
            icon={<FiPackage />}
            title="자재 관리"
            isOpen={openMenu === "material"}
            onClick={() => toggleMenu("material")}
          >
            <NavLink to="/material">
              <FiBox />
              자재 목록
            </NavLink>
            <NavLink to="/stock">
              <FiTruck />
              입출고 관리
            </NavLink>
          </MenuGroup>

          <MenuGroup
            icon={<FiClipboard />}
            title="발주 관리"
            isOpen={openMenu === "order"}
            onClick={() => toggleMenu("order")}
          >
            <NavLink to="/order/write">
              <FiEdit3 />
              발주 요청
            </NavLink>
            <NavLink to="/order">
              <FiFileText />
              발주 내역
            </NavLink>
          </MenuGroup>

          <MenuGroup
            icon={<FiMapPin />}
            title="현장 관리"
            isOpen={openMenu === "site"}
            onClick={() => toggleMenu("site")}
          >
            <NavLink to="/site">
              <FiMapPin />
              현장 목록
            </NavLink>
            <NavLink to="/site/material">
              <FiPackage />
              자재 사용 현황
            </NavLink>
          </MenuGroup>

          <MenuGroup
            icon={<FiCalendar />}
            title="일정 관리"
            isOpen={openMenu === "schedule"}
            onClick={() => toggleMenu("schedule")}
          >
            <NavLink to="/schedule">
              <FiCalendar />
              공사 일정
            </NavLink>
          </MenuGroup>

          <MenuGroup
            icon={<FiPieChart />}
            title="비용 분석"
            isOpen={openMenu === "analysis"}
            onClick={() => toggleMenu("analysis")}
          >
            <NavLink to="/analysis">
              <FiBarChart2 />
              통합 분석
            </NavLink>
          </MenuGroup>
        </nav>

        <div className="sidebar-bottom">
          <BottomGroup
            icon={<FiSettings />}
            title="Setting"
            isOpen={openBottom === "setting"}
            onClick={() => toggleBottom("setting")}
          >
            <NavLink to="/setting/profile">
              <FiUser />
              계정 설정
            </NavLink>
            <NavLink to="/setting/security">
              <FiShield />
              보안 설정
            </NavLink>
            <NavLink to="/setting/theme">
              <FiMoon />
              화면 설정
            </NavLink>
          </BottomGroup>

          <BottomGroup
            icon={<FiBell />}
            title="Notifications"
            isOpen={openBottom === "notification"}
            onClick={() => toggleBottom("notification")}
          >
            <NavLink to="/notifications">
              <FiMail />
              알림 목록
            </NavLink>
            <NavLink to="/notifications/stock">
              <FiAlertCircle />
              재고 부족 알림
            </NavLink>
          </BottomGroup>

          <div className="login-profile">
            <div className="login-avatar">
              <FiLogIn />
            </div>
            <div className="login-info">
              <strong>로그인</strong>
              <small>서비스 이용하기</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-logo">
            <span className="topbar-logo-text">
              <span className="logo-build">Build</span>
              <span className="logo-sync">Sync</span>
            </span>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

function MenuGroup({
  icon,
  title,
  children,
  isOpen,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`menu-group ${isOpen ? "open" : ""}`}>
      <button type="button" className="menu-group-title" onClick={onClick}>
        {icon}
        <span>{title}</span>
        <FiChevronDown className="chevron" />
      </button>
      <div className="submenu">{children}</div>
    </div>
  );
}

function BottomGroup({
  icon,
  title,
  children,
  isOpen,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`bottom-group ${isOpen ? "open" : ""}`}>
      <button type="button" className="bottom-title" onClick={onClick}>
        {icon}
        <span>{title}</span>
        <FiChevronDown className="bottom-chevron" />
      </button>
      <div className="bottom-submenu">{children}</div>
    </div>
  );
}

export default Layout;
