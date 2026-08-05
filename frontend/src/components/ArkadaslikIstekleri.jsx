import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { arkadaslikGelenler, arkadaslikKabul, arkadaslikRet } from "../services/api";

function ArkadaslikIstekleri() {
  const [istekler, setIstekler] = useState([]);

  const yukle = async () => {
    setIstekler(await arkadaslikGelenler());
  };

  useEffect(() => { yukle(); }, []);

  const handleKabul = async (id) => {
    if (await arkadaslikKabul(id)) yukle();
  };
  const handleRet = async (id) => {
    if (await arkadaslikRet(id)) yukle();
  };

  if (istekler.length === 0) return null;

  return (
    <div className="istek-kutu">
      <h2>Arkadaşlık İstekleri ({istekler.length})</h2>
      {istekler.map((istek) => (
        <div key={istek.id} className="istek-kart">
          <div className="istek-kart__ust">
            <Link to={`/profil/${istek.gonderenId}`} className="istek-kart__ad">
              {istek.gonderenAd}
            </Link>
            <span className="istek-kart__tarih">
              {new Date(istek.tarih).toLocaleDateString("tr-TR")}
            </span>
          </div>
          <div className="istek-kart__aksiyon">
            <button onClick={() => handleKabul(istek.id)}>Kabul Et</button>
            <button className="btn--tehlike" onClick={() => handleRet(istek.id)}>Reddet</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ArkadaslikIstekleri;