import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { kullanici, cikis } = useAuth();
  const navigate = useNavigate();

  const handleCikis = () => {
    cikis();
    navigate("/login");
  };

  return (
    <div className="dashboard__ust">
      <h1>Merhaba, {kullanici.ad}</h1>
      <button onClick={handleCikis}>Çıkış</button>
    </div>
  );
}

export default Header;