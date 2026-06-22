import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./routes/PublicRoute";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

import CompanyList from "./pages/company/CompanyList";
import CompanyDetail from "./pages/company/CompanyDetail";
import CompanyEdit from "./pages/company/CompanyEdit";

import MaterialList from "./pages/material/MeterialList";
import MaterialWrite from "./pages/material/MaterialWrite";
import MaterialEdit from "./pages/material/MaterialEdit";
import StockInOutList from "./pages/material/StockInOutList";
import StockInOutWrite from "./pages/material/StockInOutWrite";

import { WriteOrder } from "./pages/order/WriteOrder";
import { OrderList } from "./pages/order/OrderList";

import SuccessInput from "./pages/inoutput/SuccessInput";
import SuccessOutput from "./pages/inoutput/SuccessOutput";

import LoginPage from "./pages/user/LoginPage";
import JoinPage from "./pages/user/JoinPage";

import FindIdPage from "./pages/auth/FindIdPage";
import FindPasswordPage from "./pages/auth/FindPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import CostAnalysisPage from "./pages/analysis/CostAnalysisPage";

import Notifications from "./pages/notification/Notifications";
import { NotificationStock } from "./pages/notification/NotificationStock";

import AccountSetting from "./pages/settings/AccountSetting";
import SecuritySetting from "./pages/settings/SecuritySetting";
import ScreenSetting from "./pages/settings/ScreenSetting";

import SitePage from "./pages/site/SitePage";
import SiteCreatePage from "./pages/site/SiteCreatePage";
import SiteEditPage from "./pages/site/SiteEditPage";
import MaterialUsagePage from "./pages/site/MaterialUsagePage";
import SchedulePage from "./pages/schedule/SchedulePage";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/company" element={<CompanyList />} />
            <Route path="/company/:id" element={<CompanyDetail />} />
            <Route path="/company/:id/edit" element={<CompanyEdit />} />

            <Route path="/material" element={<MaterialList />} />
            <Route path="/material/write" element={<MaterialWrite />} />
            <Route
              path="/material/edit/:materialId"
              element={<MaterialEdit />}
            />

            <Route path="/stock" element={<StockInOutList />} />
            <Route path="/stock/write" element={<StockInOutWrite />} />

            <Route path="/order/write" element={<WriteOrder />} />
            <Route path="/order/list" element={<OrderList />} />

            <Route path="/input/success-input" element={<SuccessInput />} />
            <Route path="/output/success-output" element={<SuccessOutput />} />

            <Route path="/analysis" element={<CostAnalysisPage />} />

            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="/notifications/stock"
              element={<NotificationStock />}
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/join" element={<JoinPage />} />
            <Route path="/find-id" element={<FindIdPage />} />
            <Route path="/find-password" element={<FindPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/settings/account" element={<AccountSetting />} />
            <Route path="/settings/security" element={<SecuritySetting />} />
            <Route path="/settings/display" element={<ScreenSetting />} />

            <Route path="/site" element={<SitePage />} />
            <Route path="/site/create" element={<SiteCreatePage />} />
            <Route path="/site/edit/:id" element={<SiteEditPage />} />
            <Route path="/site/material" element={<MaterialUsagePage />} />

            <Route path="/schedule" element={<SchedulePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
