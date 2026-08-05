import { useEffect } from "react";
import EntryCard from "../components/EntryCard";
import Header from "../components/Header";
import OgrenciEkleForm from "../components/OgrenciEkleForm";
import { useAuth } from "../context/AuthContext";
import { useKayit } from "../context/KayitContext";
import GelenIstekler from "../components/GelenIstekler";
import ArkadaslikIstekleri from "../components/ArkadaslikIstekleri";

function YetkiliDashboard() {
  const { kullanici } = useAuth();
  const { kayitlar, kayitOnayla, kayitReddet, kayitlariYukle } = useKayit();

  useEffect(() => {
    kayitlariYukle();
  }, []);

  return (
    <div className="dashboard">
      <Header />
      <ArkadaslikIstekleri />
      <GelenIstekler />
      <OgrenciEkleForm />

      {kayitlar.length === 0 ? (
        <p className="bos-durum">Size bağlı öğrencilere ait kayıt bulunmuyor.</p>
      ) : (
        kayitlar.map((kayit) => (
          <EntryCard
            key={kayit.id}
            tarih={kayit.tarih}
            icerik={kayit.icerik}
            durum={kayit.durum}
            redAciklamasi={kayit.redAciklamasi}
            redTarihi={kayit.redTarihi}
            reddedenAd={kullanici.ad}
            onOnayla={
              kayit.durum === "bekliyor" ? () => kayitOnayla(kayit.id) : undefined
            }
            onReddet={
              kayit.durum === "bekliyor"
                ? (aciklama) => kayitReddet(kayit.id, aciklama)
                : undefined
            }
          />
        ))
      )}
    </div>
  );
}

export default YetkiliDashboard;