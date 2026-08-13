import { useEffect, useState } from "react";
import EntryCard from "../components/EntryCard";
import Header from "../components/Header";
import OgrenciEkleForm from "../components/OgrenciEkleForm";
import { useAuth } from "../context/AuthContext";
import { useKayit } from "../context/KayitContext";
import GelenIstekler from "../components/GelenIstekler";
import ArkadaslikIstekleri from "../components/ArkadaslikIstekleri";
import OdevListesi from "../components/OdevListesi";
import Modal from "../components/Modal";
import OdevVerForm from "../components/OdevVerForm";
import Takvim from "../components/Takvim";
import OgrenciTakip from "../components/OgrenciTakip";

function YetkiliDashboard() {
  const { kullanici } = useAuth();
  const { kayitlar, kayitOnayla, kayitReddet, kayitlariYukle } = useKayit();
  const [ogrenciEkleAcik, setOgrenciEkleAcik] = useState(false);
  const [odevVerAcik, setOdevVerAcik] = useState(false)

  useEffect(() => {
    kayitlariYukle();
  }, []);

  return (
    <div className="dashboard">
      <Header />

      <div className="uc-panel">

        <aside className="uc-panel__sol">
        <button onClick={() => setOgrenciEkleAcik(true)}>+ Öğrenci Ekle</button>
        <button onClick={() => setOdevVerAcik(true)}>+ Ödev Ver</button>
        </aside>

        <main className="uc-panel__orta">
          <h2 className="uc-panel__baslik">Öğrenci Kayıtları</h2>
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
        </main>

        <aside className="uc-panel__sag">
          <OgrenciTakip />
          <Takvim />
          <OdevListesi />
          <GelenIstekler />
          <ArkadaslikIstekleri />
        </aside>

      </div>

      <Modal baslik="Öğrenci Ekle" acik={ogrenciEkleAcik} onKapat={() => setOgrenciEkleAcik(false)}>
        <OgrenciEkleForm />
      </Modal>
      <Modal baslik="Ödev Ver" acik={odevVerAcik} onKapat={() => setOdevVerAcik(false)}>
      <OdevVerForm onTamam={() => setOdevVerAcik(false)} />
      </Modal>
    </div>
  );
}

export default YetkiliDashboard;