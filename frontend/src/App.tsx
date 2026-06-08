import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import CompanyList from "./pages/company/CompantList";
import CompanyDetail from "./pages/company/CompanyDetail";
import MaterialList from "./pages/material/MeterialList";
import MaterialWrite from "./pages/material/MaterialWrite";
import { WriteOrder } from "./pages/order/WriteOrder";
import SuccessInput from "./pages/inoutput/SuccessInput";
import SuccessOutput from "./pages/inoutput/SuccessOutput";
import { OrderList } from "./pages/order/OrderList";

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

          <Route path="/order/write" element={<WriteOrder />} />
          <Route path="/order/list" element={<OrderList />} />

          <Route path="/input/success-input" element={<SuccessInput />} />
          <Route path="/output/success-output" element={<SuccessOutput />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
