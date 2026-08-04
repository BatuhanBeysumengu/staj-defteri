import { useState, useEffect } from "react";
import { gelenIstekler, istekKabul, istekRet } from "../services/api";

function GelenIstekler() {
  const [istekler, setIstekler] = useState([]);

  const yukle = async () => {
    const veri = await gelenIstekler();
    setIstekler(veri);
  };

  useEffect(() => {
    yukle();
  }, []);

  const handleKabul = async (id) => {
    if (await istekKabul(id)) yukle();  
  };

  const handleRet = async (id) => {
    if (await istekRet(id)) yukle();
  };

  if (istekler.length === 0) return null;

  return (
    <div className="istek-kutu">
      <h2>Bağlanma İstekleri ({istekler.length})</h2>
      {istekler.map((istek) => (
        <div key={istek.id} className="istek-kart">
          <div className="istek-kart__ust">
            <strong>{istek.ogrenciAd}</strong>
            <span className="istek-kart__tarih">
              {new Date(istek.tarih).toLocaleDateString("tr-TR")}
            </span>
          </div>
          <p className="istek-kart__mesaj">{istek.mesaj}</p>
          <div className="istek-kart__aksiyon">
            <button onClick={() => handleKabul(istek.id)}>Kabul Et</button>
            <button className="btn--tehlike" onClick={() => handleRet(istek.id)}>Reddet</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GelenIstekler;