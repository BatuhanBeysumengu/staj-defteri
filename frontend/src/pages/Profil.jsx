import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { profilGetir, baglantiIstegiGonder } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {  useNavigate } from "react-router-dom";

function Profil() {
  const { id } = useParams();
  const { kullanici } = useAuth();
  const navigate = useNavigate();
  const [profil, setProfil] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [istekModu, setIstekModu] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [sonuc, setSonuc] = useState(null);

  useEffect(() => {
    const yukle = async () => {
      setYukleniyor(true);
      setSonuc(null);       
      setIstekModu(false);  
      setMesaj("");          
      const veri = await profilGetir(id);
      setProfil(veri);
      setYukleniyor(false);
    };
    yukle();
  }, [id]);

  const handleGonder = async () => {
    if (!mesaj.trim()) {
      setSonuc({ tur: "hata", metin: "Lütfen kendinizi tanıtan bir mesaj yazın" });
      return;
    }
    const cevap = await baglantiIstegiGonder(profil.id, mesaj);
    if (cevap.basarili) {
      setSonuc({ tur: "basari", metin: "İstek gönderildi" });
      setIstekModu(false);
      setMesaj("");
    } else {
      setSonuc({ tur: "hata", metin: cevap.mesaj });
    }
  };

  if (yukleniyor) {
    return <div className="dashboard"><Header /><p className="bos-durum">Yükleniyor...</p></div>;
  }
  if (!profil) {
    return <div className="dashboard"><Header /><p className="bos-durum">Kullanıcı bulunamadı.</p></div>;
  }

  const istekGonderilebilir =
    kullanici.rol === "ogrenci" &&
    profil.rol === "yetkili" &&
    kullanici.id !== profil.id;

  return (
    <div className="dashboard">
      <Header />
      <button className="geri-btn" onClick={() => navigate(-1)}>← Geri</button>

      <div className="profil-kart">
        <div className="profil-avatar">{profil.ad.charAt(0).toUpperCase()}</div>
        <h1>{profil.ad}</h1>
        <span className="profil-rol">{profil.rol === "yetkili" ? "Yetkili" : "Öğrenci"}</span>
        <p className="profil-email">{profil.email}</p>

        {istekGonderilebilir && (
          <div className="profil-istek">
            {!istekModu ? (
              <button onClick={() => setIstekModu(true)}>Bağlanma İsteği Gönder</button>
            ) : (
              <>
                <textarea
                  placeholder="Kendinizi kısaca tanıtın..."
                  value={mesaj}
                  onChange={(e) => setMesaj(e.target.value)}
                  rows={3}
                />
                <div className="profil-istek__aksiyon">
                  <button onClick={handleGonder}>Gönder</button>
                  <button className="btn--ikincil" onClick={() => setIstekModu(false)}>İptal</button>
                </div>
              </>
            )}
          </div>
        )}

        {sonuc && (
          <p className={sonuc.tur === "basari" ? "form-mesaj--basari" : "form-mesaj--hata"}>
            {sonuc.metin}
          </p>
        )}
      </div>
    </div>
  );
}

export default Profil;