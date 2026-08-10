import { useState, useEffect } from "react";
import { odevlerim, odevTeslim, odevDosyaYukle, odevOnayla, odevReddet } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../services/api";

function OdevListesi() {
  const { kullanici } = useAuth();
  const [odevler, setOdevler] = useState([]);
  const [teslimModu, setTeslimModu] = useState(null);
  const [not, setNot] = useState("");
  const [dosya, setDosya] = useState(null);
  const [redModu, setRedModu] = useState(null);
  const [redAciklama, setRedAciklama] = useState("");

  const yukle = async () => {
    setOdevler(await odevlerim());
  };

  useEffect(() => {
    yukle();
  }, []);

  const handleTeslim = async (id) => {
    const sonuc = await odevTeslim(id, not);
    if (sonuc) {
      if (dosya) {
        await odevDosyaYukle(id, dosya);
      }
      setTeslimModu(null);
      setNot("");
      setDosya(null);
      yukle();
    }
  };

  const handleOnayla = async (id) => {
    const sonuc = await odevOnayla(id);
    if (sonuc) yukle();
  };

  const handleReddet = async (id) => {
    if (!redAciklama.trim()) return;
    const sonuc = await odevReddet(id, redAciklama);
    if (sonuc) {
      setRedModu(null);
      setRedAciklama("");
      yukle();
    }
  };

  const bugun = new Date().toISOString().split("T")[0];

  if (odevler.length === 0) return null;

  const dosyaTamYolu = (yol) => `${API_URL.replace("/api", "")}${yol}`;

  const durumEtiket = (d) =>
    d === "onaylandi" ? "✓ Onaylandı" :
    d === "reddedildi" ? "Reddedildi" :
    d === "teslim_edildi" ? "Teslim edildi" : "Bekliyor";

  return (
    <div className="odev-listesi">
      <h2>{kullanici.rol === "yetkili" ? "Verdiğim Ödevler" : "Ödevlerim"}</h2>
      {odevler.map((o) => {
        const gecti = o.sonTeslimTarihi < bugun && o.durum === "bekliyor";
        const teslimEdildi = o.durum === "teslim_edildi" || o.durum === "onaylandi" || o.durum === "reddedildi";
        return (
          <div key={o.id} className={`odev-kart odev-kart--${o.durum} ${gecti ? "odev-kart--gecti" : ""}`}>
            <div className="odev-kart__ust">
              <span className="odev-kart__baslik">{o.baslik}</span>
              <span className="odev-kart__tarih">Son: {o.sonTeslimTarihi}</span>
            </div>
            {o.aciklama && <p className="odev-kart__aciklama">{o.aciklama}</p>}

            {teslimEdildi && (o.teslimNotu || o.teslimDosyaYolu) && (
              <div className="odev-teslim">
                {o.teslimNotu && <p className="odev-teslim__not"><strong>Teslim notu:</strong> {o.teslimNotu}</p>}
                {o.teslimDosyaYolu && (
                  <a className="odev-teslim__dosya" href={dosyaTamYolu(o.teslimDosyaYolu)} target="_blank" rel="noreferrer">
                    📎 Teslim dosyası
                  </a>
                )}
              </div>
            )}

            {o.durum === "reddedildi" && o.redAciklamasi && (
              <div className="odev-red">
                <strong>Red sebebi:</strong> {o.redAciklamasi}
              </div>
            )}

            <div className="odev-kart__alt">
              <span className="odev-kart__kisi">
                {kullanici.rol === "yetkili" ? "Öğrenci: " : "Veren: "}{o.kisiAd}
              </span>

              {kullanici.rol === "ogrenci" ? (
                teslimModu === o.id ? null : (
                  o.durum === "onaylandi" ? (
                    <span className="odev-kart__durum odev-kart__durum--onaylandi">✓ Onaylandı</span>
                  ) : (
                    <button
                      className={o.durum === "teslim_edildi" ? "btn--ikincil" : ""}
                      onClick={() => { setTeslimModu(o.id); setNot(o.teslimNotu || ""); setDosya(null); }}
                    >
                      {o.durum === "reddedildi" ? "Yeniden Teslim Et" : o.durum === "teslim_edildi" ? "Güncelle" : "Teslim Et"}
                    </button>
                  )
                )
              ) : (
                <span className={`odev-kart__durum odev-kart__durum--${o.durum}`}>
                  {gecti ? "Süresi geçti" : durumEtiket(o.durum)}
                </span>
              )}
            </div>

            {kullanici.rol === "yetkili" && o.durum === "teslim_edildi" && (
              <div className="odev-onay-aksiyon">
                {redModu === o.id ? (
                  <div className="odev-red-form">
                    <textarea
                      placeholder="Red sebebi"
                      value={redAciklama}
                      onChange={(e) => setRedAciklama(e.target.value)}
                      rows={2}
                    />
                    <div className="odev-red-form__aksiyon">
                      <button onClick={() => handleReddet(o.id)}>Reddet</button>
                      <button className="btn--ikincil" onClick={() => setRedModu(null)}>İptal</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button onClick={() => handleOnayla(o.id)}>Onayla</button>
                    <button className="btn--ikincil" onClick={() => { setRedModu(o.id); setRedAciklama(""); }}>Reddet</button>
                  </>
                )}
              </div>
            )}

            {kullanici.rol === "ogrenci" && teslimModu === o.id && (
              <div className="odev-teslim-form">
                <textarea
                  placeholder="Teslim notu (isteğe bağlı)"
                  value={not}
                  onChange={(e) => setNot(e.target.value)}
                  rows={2}
                />
                <label className="odev-teslim-form__dosya">
                  📎 {o.teslimDosyaYolu ? "Dosyayı değiştir" : "Dosya ekle"} (isteğe bağlı)
                  <input type="file" onChange={(e) => setDosya(e.target.files[0])} style={{ display: "none" }} />
                </label>
                {dosya && <span className="odev-teslim-form__dosyaad">{dosya.name}</span>}
                <div className="odev-teslim-form__aksiyon">
                  <button onClick={() => handleTeslim(o.id)}>Gönder</button>
                  <button className="btn--ikincil" onClick={() => setTeslimModu(null)}>İptal</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OdevListesi;