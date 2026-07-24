import { BrowserRouter ,Routes, Route} from "react-router-dom";
import Login  from "./pages/Login";
import OgrenciDashboard from "./pages/OgrenciDashboard";
import YetkiliDashboard from "./pages/YetkiliDashboard";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { KayitProvider } from "./context/KayitContext";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
       <KayitProvider> 
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home to ="/login" />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/ogrenci" element={<ProtectedRoute izinliRol="ogrenci"><OgrenciDashboard/> </ProtectedRoute>} />
              <Route path="/yetkili" element={<ProtectedRoute izinliRol="yetkili"><YetkiliDashboard/> </ProtectedRoute>} />
              </Routes>
          </BrowserRouter>
        </KayitProvider>  
    </AuthProvider>
  );
}

export default App;