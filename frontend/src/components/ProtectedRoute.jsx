import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({children, izinliRol}) {
  const {kullanici} = useAuth();

  if(!kullanici) {
    return <Navigate to ="/login" replace />;
  }

  if(izinliRol && kullanici.rol !== izinliRol) {
    return <Navigate to={`/${kullanici.rol}` } replace />;
  }
  return children;
}
export default ProtectedRoute;