import AdminDashboard from "../pages/dashboard/AdminDashboard";
import "../styles/Dashboard.css";

function DashboardPage() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

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
