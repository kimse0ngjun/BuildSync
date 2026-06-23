import { useAuth } from "../context/AuthContext";
import LoginRequired from "../components/LoginRequired";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import "../styles/Dashboard.css";

function DashboardPage() {
  const { isLogin } = useAuth();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isLogin) {
    return <LoginRequired />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div>
      <h1>메인 대시보드</h1>
    </div>
  );
}

export default DashboardPage;
