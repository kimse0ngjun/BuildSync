import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

import SitePage from "./pages/site/SitePage";
import SiteCreatePage from "./pages/site/SiteCreatePage";
import SiteEditPage from "./pages/site/SiteEditPage";
import MaterialUsagePage from "./pages/material/MaterialUsagePage";
import SchedulePage from "./pages/schedule/SchedulePage";
import CostAnalysisPage from "./pages/analysis/CostAnalysisPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/site" element={<SitePage />} />
          <Route path="/site/create" element={<SiteCreatePage />} />
          <Route path="/site/edit/:id" element={<SiteEditPage />} />
          <Route path="/site/material" element={<MaterialUsagePage />} />

          <Route path="/schedule" element={<SchedulePage />} />

          <Route path="/analysis" element={<CostAnalysisPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
