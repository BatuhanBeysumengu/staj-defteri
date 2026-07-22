import { useNavigate } from "react-router-dom";
import EntryCard from "../components/EntryCard";
import { kayitlar } from "../services/entryService";
import { useAuth } from "../context/AuthContext";

function OgrenciDashboard() {

  const { kullanici, cikis } = useAuth();
  const navigate = useNavigate();

  const handleCikis = () => {
    cikis();              
    navigate("/login");   
  };
  return (
    <div className="dashboard">
      <div className="dashboard__ust">
        <h1>Merhaba, {kullanici.ad}</h1>
        <button onClick={handleCikis}>Çıkış</button>
      </div>

      {kayitlar.map((kayit) => (
        <EntryCard
          key={kayit.id}
          tarih={kayit.tarih}
          icerik={kayit.icerik}
          durum={kayit.durum}
        />
      ))}
    </div>
  );
}

export default OgrenciDashboard;