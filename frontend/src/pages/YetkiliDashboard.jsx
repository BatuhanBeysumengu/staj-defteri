import { useNavigate } from "react-router-dom";
import EntryCard from "../components/EntryCard";
import { kayitlar } from "../services/entryService";
import { useAuth } from "../context/AuthContext";

function YetkiliDashboard() {
  const { kullanici, cikis } = useAuth();
  const navigate = useNavigate();

  const handleCikis = () => {
    cikis();
    navigate("/login");
  };

  const handleOnayla = (id) => {
    alert(`${id} numaralı kayıt onaylandı`);   
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
          onOnayla={() => handleOnayla(kayit.id)}   
        />
      ))}
    </div>
  );
}

export default YetkiliDashboard;