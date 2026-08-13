import { useState, useEffect } from "react";
import { ogrenciTakip, ogrenciHatirlat } from "../services/api";

function OgrenciTakip() {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [gonderilen, setGonderilen] = useState([]);

  useEffect(() => {
    const yukle = async () => {
      setOgrenciler(await ogrenciTakip());
    };
    yukle();
  }, []);

  const handleHatirlat = async (id) => {
    const sonuc = await ogrenciHatirlat(id);
    if (sonuc.basarili) {
      setGonderilen((onceki) => [...onceki, id]);
    }
  };

  const durumBilgisi = (gunFarki) => {
    if (gunFarki === null) return { metin: "Hiç kayıt yok", sinif: "takip--kritik" };
    if (gunFarki === 0) return { metin: "Bugün girdi", sinif: "takip--iyi" };
    if (gunFarki === 1) return { metin: "Dün girdi", sinif: "takip--iyi" };
    if (gunFarki <= 3) return { metin: `${gunFarki} gün önce`, sinif: "takip--orta" };
    return { metin: `${gunFarki} gündür yok`, sinif: "takip--kritik" };
  };

  if (ogrenciler.length === 0) return null;

  return (
    <div className="ogrenci-takip">
      <h3 className="ogrenci-takip__baslik">Öğrenci Takibi</h3>
      {ogrenciler.map((o) => {
        const durum = durumBilgisi(o.gunFarki);
        return (
          <div key={o.id} className={`takip-oge ${durum.sinif}`}>
            <div className="takip-oge__bilgi">
              <span className="takip-oge__ad">{o.ad}</span>
              <span className="takip-oge__durum">{durum.metin}</span>
            </div>
            {(o.gunFarki === null || o.gunFarki >= 3) && (
              gonderilen.includes(o.id) ? (
                <span className="takip-oge__gonderildi">✓ Gönderildi</span>
              ) : (
                <button className="takip-oge__buton" onClick={() => handleHatirlat(o.id)}>
                  Hatırlat
                </button>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OgrenciTakip;