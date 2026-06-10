import LoginForm from "../../components/auth/LoginForm";
import "../../styles/auth/LoginPage.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-logo">
          <div className="logo-box">B</div>

          <div className="login-logo-text">
            <span className="login-logo-build">Build</span>
            <span className="login-logo-sync">Sync</span>
          </div>
        </div>

        <h2 className="login-title">로그인</h2>

        <LoginForm />
      </div>
    </div>
  );
}
