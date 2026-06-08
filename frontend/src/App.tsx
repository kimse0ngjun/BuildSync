import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WriteOrder } from "./components/WriteOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WriteOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
