import { useState, useEffect } from "react";
import EntryCard from "../components/EntryCard";
import Header from "../components/Header";
import { useKayit } from "../context/KayitContext";
import { ocrIstek, API_URL } from "../services/api";

function OgrenciDashboard() {
  const { kayitlar, kayitEkle, kayitlariYukle } = useKayit();

  const [yeniIcerik, setYeniIcerik] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    kayitlariYukle();
  }, []);

  const handleEkle = () => {
    if (!yeniIcerik.trim()) return;
    kayitEkle(yeniIcerik);
    setYeniIcerik("");
  };

  const handleFotograf = async (e) => {
    const dosya = e.target.files[0];
    if (!dosya) return;

    setYukleniyor(true);
    const sonuc = await ocrIstek(dosya);
    setYukleniyor(false);

    if (sonuc) {
      setYeniIcerik(sonuc.metin);
    }
  };

  const handlePdfIndir = async () => {
    const token = localStorage.getItem("token");
    const cevap = await fetch(`${API_URL}/kayitlar/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!cevap.ok) return;

    const blob = await cevap.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staj-defteri.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard__arac">
        <button onClick={handlePdfIndir}> PDF İndir</button>
      </div>

      <div className="kayit-form">
        <label className="foto-yukle">
          📷 Defter fotoğrafı yükle
          <input
            type="file"
            accept="image/*"
            onChange={handleFotograf}
            style={{ display: "none" }}
          />
        </label>

        {yukleniyor && <p className="foto-durum">Metin okunuyor...</p>}

        <textarea
          placeholder="Bugün ne yaptınız? (Fotoğraf yüklerseniz metin otomatik gelir, düzeltebilirsiniz)"
          value={yeniIcerik}
          onChange={(e) => setYeniIcerik(e.target.value)}
          rows={4}
        />
        <button onClick={handleEkle}>Kaydet</button>
      </div>

      {kayitlar.length === 0 ? (
        <p className="bos-durum">Henüz kaydınız bulunmuyor.</p>
      ) : (
        kayitlar.map((kayit) => (
          <EntryCard
            key={kayit.id}
            tarih={kayit.tarih}
            icerik={kayit.icerik}
            durum={kayit.durum}
            redAciklamasi={kayit.redAciklamasi}
            redTarihi={kayit.redTarihi}
            reddedenAd={kayit.reddedenAd}
          />
        ))
      )}
    </div>
  );
}

export default OgrenciDashboard;