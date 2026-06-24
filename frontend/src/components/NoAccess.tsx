import { useNavigate } from "react-router-dom";
import { FiLock, FiArrowLeft } from "react-icons/fi";
import "../styles/NoAccess.css";

interface NoAccessProps {
  title?: string;
  targetRoleName: string;
  description?: React.ReactNode;
}

function NoAccess({
  title = "접근 권한이 없습니다",
  targetRoleName,
  description,
}: NoAccessProps) {
  const navigate = useNavigate();

  return (
    <div className="no-access-container">
      <div className="no-access-card">
        <div className="no-access-icon-wrapper">
          <FiLock className="no-access-icon" />
        </div>

        <h2 className="no-access-title">{title}</h2>

        <p className="no-access-desc">
          {description ? (
            description
          ) : (
            <>
              해당 메뉴는 <strong>{targetRoleName}</strong> 전용 관리
              화면입니다.
              <br />
              현재 로그인하신 계정의 권한으로는 접근하거나 수정할 수 없습니다.
            </>
          )}
        </p>

        <button className="no-access-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> 이전 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default NoAccess;
