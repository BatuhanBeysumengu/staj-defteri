import { useState, useEffect } from "react";
import EntryCard from "../components/EntryCard";
import Header from "../components/Header";
import { useKayit } from "../context/KayitContext";
import { ocrIstek, pdfIndir } from "../services/api";
import ArkadaslikIstekleri from "../components/ArkadaslikIstekleri";
import OdevListesi from "../components/OdevListesi";
import Takvim from "../components/Takvim";
import Feed from "../components/Feed";

function OgrenciDashboard() {
  const { kayitlar, kayitEkle, kayitlariYukle } = useKayit();

  const [yeniIcerik, setYeniIcerik] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [secimModu, setSecimModu] = useState(false);
  const [secililer, setSecililer] = useState([]);
  const [baslangic, setBaslangic] = useState("");
  const [bitis, setBitis] = useState("");
  const [gorunurluk, setGorunurluk] = useState("private");

  useEffect(() => {
    kayitlariYukle();
  }, []);

  const handleEkle = () => {
    if (!yeniIcerik.trim()) return;
    kayitEkle(yeniIcerik, gorunurluk);
    setYeniIcerik("");
    setGorunurluk("private");
  };

  const handleFotograf = async (e) => {
    const dosya = e.target.files[0];
    if (!dosya) return;
    setYukleniyor(true);
    const sonuc = await ocrIstek(dosya);
    setYukleniyor(false);
    if (sonuc) setYeniIcerik(sonuc.metin);
  };

  const secimToggle = (id) => {
    setSecililer((onceki) =>
      onceki.includes(id) ? onceki.filter((x) => x !== id) : [...onceki, id]
    );
  };

  const filtreliKayitlar = kayitlar.filter((k) => {
    if (baslangic && k.tarih < baslangic) return false;
    if (bitis && k.tarih > bitis) return false;
    return true;
  });

  const tumunuSec = () => {
    setSecililer(filtreliKayitlar.map((k) => k.id));
  };
  const temizle = () => setSecililer([]);

  const handleIndir = async () => {
    if (secililer.length === 0) return;
    await pdfIndir(secililer);
  };

  return (
    <div className="dashboard">
      <Header />

      <div className="uc-panel">

        <aside className="uc-panel__sol">
          <div className="kayit-form">
            <label className="foto-yukle">
              📷 Defter fotoğrafı yükle
              <input type="file" accept="image/*" onChange={handleFotograf} style={{ display: "none" }} />
            </label>
            {yukleniyor && <p className="foto-durum">Metin okunuyor...</p>}
            <textarea
              placeholder="Bugün ne yaptınız?"
              value={yeniIcerik}
              onChange={(e) => setYeniIcerik(e.target.value)}
              rows={4}
            />
            <div className="kayit-form__alt">
              <label className="gorunurluk-secici">
                Görünürlük:
                <select value={gorunurluk} onChange={(e) => setGorunurluk(e.target.value)}>
                  <option value="private">🔒 Sadece ben</option>
                  <option value="friends">👥 Arkadaşlarım</option>
                  <option value="public">🌍 Herkes</option>
                </select>
              </label>
              <button onClick={handleEkle}>Kaydet</button>
            </div>
          </div>

          <div className="pdf-arac">
            {!secimModu ? (
              <button onClick={() => setSecimModu(true)}>📄 PDF İndir</button>
            ) : (
              <div className="pdf-arac__panel">
                <div className="pdf-arac__tarih">
                  <label>
                    Başlangıç
                    <input type="date" value={baslangic} onChange={(e) => setBaslangic(e.target.value)} />
                  </label>
                  <label>
                    Bitiş
                    <input type="date" value={bitis} onChange={(e) => setBitis(e.target.value)} />
                  </label>
                </div>
                <div className="pdf-arac__butonlar">
                  <button className="btn--ikincil" onClick={tumunuSec}>Tümünü Seç</button>
                  <button className="btn--ikincil" onClick={temizle}>Temizle</button>
                  <button onClick={handleIndir}>
                    Seçilenleri İndir ({secililer.length})
                  </button>
                  <button className="btn--ikincil" onClick={() => { setSecimModu(false); temizle(); }}>
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        <main className="uc-panel__orta">
        <h2 className="uc-panel__baslik">Akış</h2>
        <Feed />

        <h2 className="uc-panel__baslik" style={{ marginTop: "24px" }}>Kayıtlarım</h2>
        {filtreliKayitlar.length === 0 ? (
          <p className="bos-durum">Kayıt bulunmuyor.</p>
          ) : (
            filtreliKayitlar.map((kayit) => (
              <div key={kayit.id} className="kayit-satir">
                {secimModu && (
                  <input
                    type="checkbox"
                    className="kayit-secim"
                    checked={secililer.includes(kayit.id)}
                    onChange={() => secimToggle(kayit.id)}
                  />
                )}
                <div className="kayit-satir__kart">
                  <EntryCard
                    tarih={kayit.tarih}
                    icerik={kayit.icerik}
                    durum={kayit.durum}
                    redAciklamasi={kayit.redAciklamasi}
                    redTarihi={kayit.redTarihi}
                    reddedenAd={kayit.reddedenAd}
                  />
                </div>
              </div>
            ))
          )}
        </main>

        <aside className="uc-panel__sag">
          <Takvim />
          <OdevListesi />
          <ArkadaslikIstekleri />
        </aside>

      </div>
    </div>
  );
}

export default OgrenciDashboard;