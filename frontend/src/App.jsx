import { BrowserRouter ,Routes, Route, Navigate } from "react-router-dom";
import Login  from "./pages/Login";
import OgrenciDashboard from "./pages/OgrenciDashboard";
import YetkiliDashboard from "./pages/YetkiliDashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to ="/login" />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/ogrenci" element={<ProtectedRoute izinliRol="ogrenci"><OgrenciDashboard/> </ProtectedRoute>} />
          <Route path="/yetkili" element={<ProtectedRoute izinliRol="yetkili"><YetkiliDashboard/> </ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;