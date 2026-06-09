import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CompanyList from "./pages/company/CompanyList";
import CompanyDetail from "./pages/company/CompanyDetail";
import CompanyEdit from "./pages/company/CompanyEdit";
import MaterialList from "./pages/material/MeterialList";
import MaterialWrite from "./pages/material/MaterialWrite";
import StockInOutList from "./pages/material/StockInOutList";
import StockInOutWrite from "./pages/material/StockInOutWrite";
import { WriteOrder } from "./pages/order/WriteOrder";
import { OrderList } from "./pages/order/OrderList";
import SuccessInput from "./pages/inoutput/SuccessInput";
import SuccessOutput from "./pages/inoutput/SuccessOutput";
import LoginPage from "./pages/user/LoginPage";
import JoinPage from "./pages/user/JoinPage";
import AccountSetting from "./pages/settings/AccountSetting";
import SecuritySetting from "./pages/settings/SecuritySetting";
import ScreenSetting from "./pages/settings/ScreenSetting";

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<CompanyList />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/company/:id/edit" element={<CompanyEdit />} />

          <Route path="/material" element={<MaterialList />} />
          <Route path="/material/write" element={<MaterialWrite />} />

          <Route path="/stock" element={<StockInOutList />} />
          <Route path="/stock/write" element={<StockInOutWrite />} />

          <Route path="/order/write" element={<WriteOrder />} />
          <Route path="/order/list" element={<OrderList />} />

          <Route path="/input/success-input" element={<SuccessInput />} />
          <Route path="/output/success-output" element={<SuccessOutput />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />

          <Route path="/settings/account" element={<AccountSetting />} />
          <Route path="/settings/security" element={<SecuritySetting />} />
          <Route path="/settings/display" element={<ScreenSetting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
