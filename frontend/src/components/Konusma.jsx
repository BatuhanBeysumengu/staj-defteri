import { useState, useEffect, useRef } from "react";
import { konusmaGetir, mesajGonder } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Konusma({ digerId, digerAd, onMesajGonderildi }) {
  const { kullanici } = useAuth();
  const [mesajlar, setMesajlar] = useState([]);
  const [yeni, setYeni] = useState("");
  const sonRef = useRef(null);

  const yukle = async () => {
    setMesajlar(await konusmaGetir(digerId));
  };

  useEffect(() => {
    yukle();
  }, [digerId]);

  useEffect(() => {
    sonRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesajlar]);

  const handleGonder = async () => {
    if (!yeni.trim()) return;
    const sonuc = await mesajGonder(digerId, yeni, null);
    if (sonuc.basarili) {
      setYeni("");
      yukle();
      onMesajGonderildi?.(); 
    }
  };

  return (
    <div className="konusma">
      <div className="konusma__baslik">{digerAd}</div>

      <div className="konusma__akis">
        {mesajlar.length === 0 ? (
          <p className="konusma__bos">Henüz mesaj yok. İlk mesajı sen gönder.</p>
        ) : (
          mesajlar.map((m) => (
            <div
              key={m.id}
              className={`mesaj-balon ${m.gonderenId === kullanici.id ? "mesaj-balon--ben" : "mesaj-balon--karsi"}`}
            >
              {m.paylasilanKayitId ? (
                <div className="mesaj-kayit">
                  <span className="mesaj-kayit__etiket">📎 Paylaşılan kayıt</span>
                  <p className="mesaj-kayit__onizleme">{m.paylasilanKayitOnizleme}</p>
                </div>
              ) : (
                <p className="mesaj-balon__metin">{m.icerik}</p>
              )}
              <span className="mesaj-balon__saat">
                {new Date(m.tarih).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))
        )}
        <div ref={sonRef} />
      </div>

      <div className="konusma__giris">
        <input
          type="text"
          placeholder="Mesaj yaz..."
          value={yeni}
          onChange={(e) => setYeni(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGonder()}
        />
        <button onClick={handleGonder}>Gönder</button>
      </div>
    </div>
  );
}

export default Konusma;