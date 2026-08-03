import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTema } from "../context/TemaContext";

function Header() {
  const { kullanici, cikis } = useAuth();
  const { tema, temaDegistir } = useTema();
  const navigate = useNavigate();

  const handleCikis = () => {
    cikis();
    navigate("/login");
  };

  return (
    <header className="ust-bar">
      <h1 className="ust-bar__baslik">Merhaba, {kullanici.ad}</h1>
      <nav className="ust-bar__menu">
        <button className="tema-btn" onClick={temaDegistir} title="Tema değiştir">
          {tema === "koyu" ? "☀️" : "🌙"}
        </button>
        <Link to={`/profil/${kullanici.id}`} className="ust-bar__link">Profilim</Link>
        <button className="ust-bar__cikis" onClick={handleCikis}>Çıkış</button>
      </nav>
    </header>
  );
}

export default Header;