import { useState, useEffect } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import Header from "../components/Header";
import {
  profilGetir,
  baglantiIstegiGonder,
  arkadaslikGonder,
  arkadaslikDurum,
  arkadaslikKabul,
  arkadasListem
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profil() {
  const { id } = useParams();
  const { kullanici } = useAuth();
  const navigate = useNavigate();
  const [profil, setProfil] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [istekModu, setIstekModu] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [sonuc, setSonuc] = useState(null);
  const [arkDurum, setArkDurum] = useState(null); 
  const [arkadaslar, setArkadaslar] = useState([]);

  useEffect(() => {
    const yukle = async () => {
      setYukleniyor(true);
      setSonuc(null);
      setIstekModu(false);
      setMesaj("");

      const veri = await profilGetir(id);
      setProfil(veri);
      if (veri && kullanici.id !== veri.id) {
        const durum = await arkadaslikDurum(id);
        setArkDurum(durum);
        setArkadaslar([]); 
      } else {
        setArkDurum(null);
        const liste = await arkadasListem();
        setArkadaslar(liste);
      }

      setYukleniyor(false);
    };
    yukle();
  }, [id]);

  const handleBaglanmaGonder = async () => {
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

  const handleArkadasEkle = async () => {
    const cevap = await arkadaslikGonder(profil.id);
    if (cevap.basarili) {
      setArkDurum({ durum: "gonderildi" });
    } else {
      setSonuc({ tur: "hata", metin: cevap.mesaj });
    }
  };

  const handleArkadasKabul = async () => {
    if (arkDurum?.istekId && (await arkadaslikKabul(arkDurum.istekId))) {
      setArkDurum({ durum: "arkadas" });
    }
  };

  if (yukleniyor) {
    return <div className="dashboard"><Header /><p className="bos-durum">Yükleniyor...</p></div>;
  }
  if (!profil) {
    return <div className="dashboard"><Header /><p className="bos-durum">Kullanıcı bulunamadı.</p></div>;
  }

  const kendiProfilim = kullanici.id === profil.id;
  const baglanmaGonderilebilir =
    kullanici.rol === "ogrenci" && profil.rol === "yetkili" && !kendiProfilim;

  return (
    <div className="dashboard">
      <Header />
      <button className="geri-btn" onClick={() => navigate(-1)}>← Geri</button>

      <div className="profil-kart">
        <div className="profil-avatar">{profil.ad.charAt(0).toUpperCase()}</div>
        <h1>{profil.ad}</h1>
        <span className="profil-rol">{profil.rol === "yetkili" ? "Yetkili" : "Öğrenci"}</span>
        <p className="profil-email">{profil.email}</p>

        {!kendiProfilim && arkDurum && (
          <div className="profil-arkadas">
            {arkDurum.durum === "yok" && (
              <button onClick={handleArkadasEkle}>Arkadaş Ekle</button>
            )}
            {arkDurum.durum === "gonderildi" && (
              <button className="btn--ikincil" disabled>İstek Gönderildi</button>
            )}
            {arkDurum.durum === "geldi" && (
              <button onClick={handleArkadasKabul}>İsteği Kabul Et</button>
            )}
            {arkDurum.durum === "arkadas" && (
              <button className="btn--ikincil" disabled>✓ Arkadaşsınız</button>
            )}
          </div>
        )}
        {baglanmaGonderilebilir && (
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
                  <button onClick={handleBaglanmaGonder}>Gönder</button>
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
      {kendiProfilim && (
  <div className="arkadas-liste">
    <h2>Arkadaşlarım ({arkadaslar.length})</h2>
    {arkadaslar.length === 0 ? (
      <p className="bos-durum">Henüz arkadaşınız yok.</p>
    ) : (
      <div className="arkadas-liste__grid">
        {arkadaslar.map((a) => (
          <Link key={a.id} to={`/profil/${a.id}`} className="arkadas-oge">
            <span className="arkadas-oge__avatar">{a.ad.charAt(0).toUpperCase()}</span>
            <span className="arkadas-oge__ad">{a.ad}</span>
            <span className="arkadas-oge__rol">{a.rol === "yetkili" ? "Yetkili" : "Öğrenci"}</span>
          </Link>
        ))}
      </div>
    )}
  </div>
)}
    </div>
  );
}

export default Profil;