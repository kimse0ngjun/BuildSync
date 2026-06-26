import { useAuth } from "../context/AuthContext";
import LoginRequired from "../components/LoginRequired";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import UserDashboard from "../pages/dashboard/UserDashboard";

function DashboardPage() {
  const { isLogin } = useAuth();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isLogin) {
    return <LoginRequired />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
}

export default DashboardPage;
