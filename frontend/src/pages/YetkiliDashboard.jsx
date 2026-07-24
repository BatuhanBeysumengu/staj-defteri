import { useNavigate } from "react-router-dom";
import EntryCard from "../components/EntryCard";
import { useAuth } from "../context/AuthContext";
import { useKayit } from "../context/KayitContext";
import { bagliOgrenciIdleri, kullaniciAdiGetir } from "../services/deneme";

function YetkiliDashboard() {
  const { kullanici, cikis } = useAuth();
  const { kayitlar, kayitOnayla, kayitReddet } = useKayit();
  const navigate = useNavigate();

  const handleCikis = () => {
    cikis();
    navigate("/login");
  };
  const ogrencilerim = bagliOgrenciIdleri(kullanici.id);
  const gorunecekKayitlar = kayitlar.filter((k) =>
    ogrencilerim.includes(k.ogrenciId)
  );

  return (
    <div className="dashboard">
      <div className="dashboard__ust">
        <h1>Merhaba, {kullanici.ad}</h1>
        <button onClick={handleCikis}>Çıkış</button>
      </div>

      {gorunecekKayitlar.length === 0 ? (
        <p className="bos-durum">Size bağlı öğrencilere ait kayıt bulunmuyor.</p>
      ) : (
        gorunecekKayitlar.map((kayit) => (
          <EntryCard
            key={kayit.id}
            tarih={kayit.tarih}
            icerik={kayit.icerik}
            durum={kayit.durum}
            ogrenciAdi={kullaniciAdiGetir(kayit.ogrenciId)}  
            onOnayla={
              kayit.durum === "bekliyor" ? () => kayitOnayla(kayit.id) : undefined
            }
            onReddet={kayit.durum === "bekliyor" ? () => kayitReddet(kayit.id) : undefined}
          />
        ))
      )}
    </div>
  );
}

export default YetkiliDashboard;