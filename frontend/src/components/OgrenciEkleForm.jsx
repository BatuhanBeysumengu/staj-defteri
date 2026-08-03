import { useState } from "react";
import { ogrenciEkle } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function OgrenciEkleForm() {
  const { kullanici } = useAuth();

  const [ad, setAd] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [mesaj, setMesaj] = useState(null); 

  const handleEkle = async () => {
    if (!ad.trim() || !email.trim() || !sifre.trim()) {
      setMesaj({ tur: "hata", metin: "Tüm alanları doldurun" });
      return;
    }
    const sonuc = await ogrenciEkle(ad, email, sifre, kullanici.id);

    if (sonuc.basarili) {
      setMesaj({ tur: "basari", metin: `${ad} eklendi` });
      setAd("");
      setEmail("");
      setSifre("");
    } else {
      setMesaj({ tur: "hata", metin: sonuc.mesaj });
    }
  };

  return (
    <div className="ogrenci-form">
      <h2>Yeni Öğrenci Ekle</h2>

      <input placeholder="Ad" value={ad} onChange={(e) => setAd(e.target.value)} />
      <input placeholder="E-posta" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Şifre" type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} />

      {mesaj && (
        <p className={mesaj.tur === "basari" ? "form-mesaj--basari" : "form-mesaj--hata"}>
          {mesaj.metin}
        </p>
      )}

      <button onClick={handleEkle}>Ekle</button>
    </div>
  );
}

export default OgrenciEkleForm;