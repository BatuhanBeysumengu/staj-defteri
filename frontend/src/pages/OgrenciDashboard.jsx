import { useState } from "react";
import EntryCard from "../components/EntryCard";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { useKayit } from "../context/KayitContext";

function OgrenciDashboard() {
  const { kullanici } = useAuth();        
  const { kayitlar, kayitEkle } = useKayit();

  const [yeniIcerik, setYeniIcerik] = useState("");

  const handleEkle = () => {
    if (!yeniIcerik.trim()) return;
    kayitEkle(yeniIcerik, kullanici.id);
    setYeniIcerik("");
  };

  const benimKayitlarim = kayitlar.filter((k) => k.ogrenciId === kullanici.id);

  return (
    <div className="dashboard">
      <Header />

      <div className="kayit-form">
        <textarea
          placeholder="Bugün ne yaptınız?"
          value={yeniIcerik}
          onChange={(e) => setYeniIcerik(e.target.value)}
          rows={3}
        />
        <button onClick={handleEkle}>Kaydet</button>
      </div>

      {benimKayitlarim.length === 0 ? (
        <p className="bos-durum">Henüz kaydınız bulunmuyor.</p>
      ) : (
        benimKayitlarim.map((kayit) => (
          <EntryCard
            key={kayit.id}
            tarih={kayit.tarih}
            icerik={kayit.icerik}
            durum={kayit.durum}
          />
        ))
      )}
    </div>
  );
}

export default OgrenciDashboard;