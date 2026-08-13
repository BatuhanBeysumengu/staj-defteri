import { useState, useEffect } from "react";
import { odevlerim } from "../services/api";

function Takvim() {
  const [odevler, setOdevler] = useState([]);
  const [aktifAy, setAktifAy] = useState(new Date());
  const [seciliGun, setSeciliGun] = useState(null);

  useEffect(() => {
    const yukle = async () => {
      setOdevler(await odevlerim());
    };
    yukle();
  }, []);

  const yil = aktifAy.getFullYear();
  const ay = aktifAy.getMonth();

  const ayIlkGun = new Date(yil, ay, 1);
  const ayGunSayisi = new Date(yil, ay + 1, 0).getDate();
  const baslangicBosluk = (ayIlkGun.getDay() + 6) % 7;

  const ayAdlari = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const gunAdlari = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const gunler = [];
  for (let g = 1; g <= ayGunSayisi; g++) gunler.push(g);

  const bosGunler = gunAdlari.slice(0, baslangicBosluk);

  const tarihStr = (g) =>
    `${yil}-${String(ay + 1).padStart(2, "0")}-${String(g).padStart(2, "0")}`;

  const gunOdevleri = (g) =>
    odevler.filter((o) => o.sonTeslimTarihi === tarihStr(g));

  const ayGeri = () => setAktifAy(new Date(yil, ay - 1, 1));
  const ayIleri = () => setAktifAy(new Date(yil, ay + 1, 1));

  return (
    <div className="takvim">
      <div className="takvim__baslik">
        <button type="button" onClick={ayGeri}>‹</button>
        <span>{ayAdlari[ay]} {yil}</span>
        <button type="button" onClick={ayIleri}>›</button>
      </div>

      <div className="takvim__hafta">
        {gunAdlari.map((g) => (
          <span key={g} className="takvim__hafta-gun">{g}</span>
        ))}
      </div>

      <div className="takvim__grid">
        {bosGunler.map((etiket) => (
          <span key={`bos-${etiket}`} className="takvim__bos" />
        ))}
        {gunler.map((g) => {
          const oSayi = gunOdevleri(g).length;
          return (
            <button
              type="button"
              key={tarihStr(g)}
              className={`takvim__gun ${oSayi > 0 ? "takvim__gun--dolu" : ""} ${seciliGun === g ? "takvim__gun--secili" : ""}`}
              onClick={() => setSeciliGun(seciliGun === g ? null : g)}
            >
              {g}
              {oSayi > 0 && <span className="takvim__nokta" />}
            </button>
          );
        })}
      </div>

      {seciliGun && (
        <div className="takvim__detay">
          <strong>{seciliGun} {ayAdlari[ay]}</strong>
          {gunOdevleri(seciliGun).length === 0 ? (
            <p className="takvim__bos-not">Bu gün ödev yok.</p>
          ) : (
            gunOdevleri(seciliGun).map((o) => (
              <div key={o.id} className="takvim__odev">
                <span className="takvim__odev-baslik">{o.baslik}</span>
                <span className="takvim__odev-kisi">{o.kisiAd}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Takvim;