import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CompanyList from "./pages/company/CompanyList";
import CompanyDetail from "./pages/company/CompanyDetail";
import MaterialList from "./pages/material/MeterialList";
import MaterialWrite from "./pages/material/MaterialWrite";
import CompanyEdit from "./pages/company/CompanyEdit";
import StockInOutList from "./pages/material/StockInOutList";
import StockInOutWrite from "./pages/material/StockInOutWrite";
import LoginPage from "./pages/user/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<CompanyList />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/material" element={<MaterialList />} />
          <Route path="/material/write" element={<MaterialWrite />} />
          <Route path="/company/:id/edit" element={<CompanyEdit />} />
          <Route path="/stock" element={<StockInOutList />} />
          <Route path="/stock/write" element={<StockInOutWrite />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
