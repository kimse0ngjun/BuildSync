import { LuFileOutput } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import "../../styles/SuccessInOut.css";
import { useAuth } from "../../context/AuthContext";
import LoginRequired from "../../components/LoginRequired";

const SuccessOutput = () => {
  const nav = useNavigate();
  const { isLogin } = useAuth();

  if (!isLogin) {
    return <LoginRequired />;
  }

  return (
    <div className="suc-input">
      <LuFileOutput className="input-icon" />
      <h2 className="input-message">출고 처리가 완료 되었습니다.</h2>
      <div className="btn-area">
        <button onClick={() => nav("/stock")} className="go-to-main">
          입출고 목록 보러가기
        </button>
      </div>
    </div>
  );
};

export default SuccessOutput;
