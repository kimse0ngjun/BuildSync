import { LuFileInput } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import "../../styles/SuccessInOut.css";

const SuccessInput = () => {
  const nav = useNavigate();

  return (
    <div className="suc-input">
      <LuFileInput className="input-icon" />
      <h2 className="input-message">입고 처리가 완료 되었습니다.</h2>
      <div className="btn-area">
        <button onClick={() => nav("/stock")} className="go-to-main">
          입출고 목록 보러가기
        </button>
      </div>
    </div>
  );
};

export default SuccessInput;
