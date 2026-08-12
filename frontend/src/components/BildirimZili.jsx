import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { bildirimlerim, bildirimSayisi, bildirimleriOkunduYap } from "../services/api";

function BildirimZili() {
  const navigate = useNavigate();
  const [acik, setAcik] = useState(false);
  const [bildirimler, setBildirimler] = useState([]);
  const [sayi, setSayi] = useState(0);
  const ref = useRef(null);

  const sayiYukle = async () => {
    const sonuc = await bildirimSayisi();
    setSayi(sonuc.sayi);
  };

  useEffect(() => {
    sayiYukle();
    const zamanlayici = setInterval(sayiYukle, 20000);
    return () => clearInterval(zamanlayici);
  }, []);

  useEffect(() => {
    const disariTikla = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAcik(false);
    };
    document.addEventListener("mousedown", disariTikla);
    return () => document.removeEventListener("mousedown", disariTikla);
  }, []);

  const zileTikla = async () => {
    if (!acik) {
      setBildirimler(await bildirimlerim());
      setAcik(true);
      if (sayi > 0) {
        await bildirimleriOkunduYap();
        setSayi(0);
      }
    } else {
      setAcik(false);
    }
  };

  const bildirimeTikla = (b) => {
    setAcik(false);
    if (b.link) navigate(b.link);
  };

  return (
    <div className="bildirim-zili" ref={ref}>
      <button className="bildirim-zili__buton" onClick={zileTikla} title="Bildirimler">
        🔔
        {sayi > 0 && <span className="bildirim-zili__rozet">{sayi > 9 ? "9+" : sayi}</span>}
      </button>

      {acik && (
        <div className="bildirim-zili__panel">
          <div className="bildirim-zili__baslik">Bildirimler</div>
          {bildirimler.length === 0 ? (
            <p className="bildirim-zili__bos">Bildirim yok.</p>
          ) : (
            bildirimler.map((b) => (
              <button
                key={b.id}
                className={`bildirim-oge ${b.okundu ? "" : "bildirim-oge--yeni"}`}
                onClick={() => bildirimeTikla(b)}
              >
                <span className="bildirim-oge__metin">{b.metin}</span>
                <span className="bildirim-oge__tarih">
                  {new Date(b.tarih).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default BildirimZili;