import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { kayitOl } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Kayit() {
  const { giris } = useAuth();
  const navigate = useNavigate();

  const [ad, setAd] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [davetKodu, setDavetKodu] = useState("");
  const [hata, setHata] = useState("");
  const [kodGoster, setKodGoster] = useState(false);

  const handleKayit = async () => {
    if (!ad.trim() || !email.trim() || !sifre.trim()) {
      setHata("Lütfen tüm alanları doldurun");
      return;
    }

    const sonuc = await kayitOl(ad, email, sifre, davetKodu);

    if (!sonuc.basarili) {
      setHata(sonuc.mesaj);
      return;
    }

    giris(sonuc.veri.kullanici, sonuc.veri.token);

    if (sonuc.veri.kullanici.rol === "yetkili") {
      navigate("/yetkili");
    } else {
      navigate("/ogrenci");
    }
  };

  return (
    <div className="login">
      <Link to="/" className="geri-link">← Ana Sayfa</Link>
      <h1>Kayıt Ol</h1>
      <p>Yeni bir hesap oluşturun</p>

      <input
        type="text"
        placeholder="Ad Soyad"
        value={ad}
        onChange={(e) => setAd(e.target.value)}
      />
      <input
        type="email"
        placeholder="E-Posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Şifre"
        value={sifre}
        onChange={(e) => setSifre(e.target.value)}
      />
      {kodGoster ? (
        <input
          type="text"
          placeholder="Yetkili davet kodu (opsiyonel)"
          value={davetKodu}
          onChange={(e) => setDavetKodu(e.target.value)}
        />
      ) : (
        <button className="link-btn" onClick={() => setKodGoster(true)}>
          Davet kodum var
        </button>
      )}

      {hata && <p className="hata">{hata}</p>}

      <button onClick={handleKayit}>Kayıt Ol</button>

      <p className="alt-link">
        Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
      </p>
    </div>
  );
}

export default Kayit;