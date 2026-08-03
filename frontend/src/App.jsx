import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import OgrenciDashboard from "./pages/OgrenciDashboard";
import YetkiliDashboard from "./pages/YetkiliDashboard";
import Profil from "./pages/Profil";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { KayitProvider } from "./context/KayitContext";
import Home from "./pages/Home";
import { TemaProvider } from "./context/TemaContext";

function App() {
  return (
    <TemaProvider>
      <AuthProvider>
        <KayitProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/ogrenci" element={<ProtectedRoute izinliRol="ogrenci"><OgrenciDashboard /> </ProtectedRoute>} />
              <Route path="/yetkili" element={<ProtectedRoute izinliRol="yetkili"><YetkiliDashboard /> </ProtectedRoute>} />
              <Route path="/profil/:id" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </KayitProvider>
      </AuthProvider>
    </TemaProvider>
  );
}

export default App;