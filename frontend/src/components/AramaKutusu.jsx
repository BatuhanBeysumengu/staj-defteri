import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { kullaniciAra } from "../services/api";

function AramaKutusu() {
  const [q, setQ] = useState("");
  const [rol, setRol] = useState("");
  const [sonuclar, setSonuclar] = useState([]);
  const [acik, setAcik] = useState(false);
  const kutuRef = useRef(null);
  
  useEffect(() => {
    if (!q.trim() && !rol) {
      setSonuclar([]);
      return;
    }
    const zaman = setTimeout(async () => {
      const veri = await kullaniciAra(q, rol);
      setSonuclar(veri);
      setAcik(true);
    }, 300);  

    return () => clearTimeout(zaman);  
  }, [q, rol]);

  // Dışarı tıklayınca listeyi kapat
  useEffect(() => {
    const disari = (e) => {
      if (kutuRef.current && !kutuRef.current.contains(e.target)) {
        setAcik(false);
      }
    };
    document.addEventListener("mousedown", disari);
    return () => document.removeEventListener("mousedown", disari);
  }, []);

  return (
    <div className="arama" ref={kutuRef}>
      <div className="arama__giris">
        <input
          type="text"
          placeholder="Kişi ara..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => sonuclar.length && setAcik(true)}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">Tümü</option>
          <option value="ogrenci">Öğrenci</option>
          <option value="yetkili">Yetkili</option>
        </select>
      </div>

      {acik && sonuclar.length > 0 && (
        <div className="arama__sonuc">
          {sonuclar.map((k) => (
            <Link
              key={k.id}
              to={`/profil/${k.id}`}
              className="arama__oge"
              onClick={() => setAcik(false)}
            >
              <span className="arama__avatar">{k.ad.charAt(0).toUpperCase()}</span>
              <span className="arama__ad">{k.ad}</span>
              <span className="arama__rol">{k.rol === "yetkili" ? "Yetkili" : "Öğrenci"}</span>
            </Link>
          ))}
        </div>
      )}

      {acik && q.trim() && sonuclar.length === 0 && (
        <div className="arama__sonuc">
          <p className="arama__bos">Sonuç bulunamadı</p>
        </div>
      )}
    </div>
  );
}

export default AramaKutusu;