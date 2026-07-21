import { BrowserRouter ,Routes, Route, Navigate } from "react-router-dom";
import Login  from "./pages/Login";
import OgrenciDashboard from "./pages/OgrenciDashboard";
import YetkiliDashboard from "./pages/YetkiliDashboard";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to ="/login" />} />

      <Route path="/login" element={<Login/>} />
      <Route path="/ogrenci" element={<OgrenciDashboard />} />
      <Route path="/yetkili" element={<YetkiliDashboard />} />
      </Routes>
      </BrowserRouter>
  );
}

export default App;