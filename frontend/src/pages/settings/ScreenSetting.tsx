import { useEffect, useState } from "react";
import { FiMoon, FiSun, FiMonitor } from "react-icons/fi";
import "../../styles/ScreenSetting.css";

function ScreenSetting() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setDarkMode(false);
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const handleToggle = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);

    if (nextMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="screen-setting-page">
      <div className="screen-setting-header">
        <p className="screen-setting-label">설정</p>
        <h1>화면 설정</h1>
        <p className="screen-setting-desc">
          화면 테마 및 사용자 환경을 설정할 수 있습니다.
        </p>
      </div>

      <section className="screen-setting-section">
        <div className="screen-section-title">
          <FiMonitor />
          <div>
            <h2>테마 설정</h2>
            <p>시스템 화면 테마를 선택할 수 있습니다.</p>
          </div>
        </div>

        <div className="theme-card">
          <div className="theme-info">
            <div className="theme-icon">
              {darkMode ? <FiMoon /> : <FiSun />}
            </div>

            <div>
              <h3>다크 모드</h3>
              <p>
                야간 환경에서 눈의 피로를 줄여주는 어두운 테마를 적용합니다.
              </p>
            </div>
          </div>

          <label className="switch">
            <input type="checkbox" checked={darkMode} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
        </div>
      </section>
    </div>
  );
}

export default ScreenSetting;
