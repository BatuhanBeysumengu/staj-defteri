import { useState, useEffect } from "react";
import { ogrencilerim, odevVer } from "../services/api";

function OdevVerForm({ onTamam }) {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [ogrenciId, setOgrenciId] = useState("");
  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [tarih, setTarih] = useState("");
  const [sonuc, setSonuc] = useState(null);

  useEffect(() => {
    const yukle = async () => {
      setOgrenciler(await ogrencilerim());
    };
    yukle();
  }, []);

  const handleGonder = async () => {
    if (!ogrenciId || !baslik.trim() || !tarih) {
      setSonuc({ tur: "hata", metin: "Öğrenci, başlık ve tarih gerekli" });
      return;
    }
    const cevap = await odevVer(baslik, aciklama, tarih, parseInt(ogrenciId));
    if (cevap.basarili) {
      setSonuc({ tur: "basari", metin: "Ödev verildi" });
      setBaslik("");
      setAciklama("");
      setTarih("");
      setOgrenciId("");
      if (onTamam) onTamam();
    } else {
      setSonuc({ tur: "hata", metin: cevap.mesaj });
    }
  };

  return (
    <div className="odev-ver-form">
      <label>
        Öğrenci
        <select value={ogrenciId} onChange={(e) => setOgrenciId(e.target.value)}>
          <option value="">Öğrenci seçin</option>
          {ogrenciler.map((o) => (
            <option key={o.id} value={o.id}>{o.ad}</option>
          ))}
        </select>
      </label>

      <input
        type="text"
        placeholder="Ödev başlığı"
        value={baslik}
        onChange={(e) => setBaslik(e.target.value)}
      />

      <textarea
        placeholder="Açıklama (isteğe bağlı)"
        value={aciklama}
        onChange={(e) => setAciklama(e.target.value)}
        rows={3}
      />

      <label>
        Son teslim tarihi
        <input type="date" value={tarih} onChange={(e) => setTarih(e.target.value)} />
      </label>

      <button onClick={handleGonder}>Ödevi Ver</button>

      {sonuc && (
        <p className={sonuc.tur === "basari" ? "form-mesaj--basari" : "form-mesaj--hata"}>
          {sonuc.metin}
        </p>
      )}
    </div>
  );
}

export default OdevVerForm;