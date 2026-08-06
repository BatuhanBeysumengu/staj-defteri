import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import {
  profilGetir,
  baglantiIstegiGonder,
  arkadaslikGonder,
  arkadaslikDurum,
  arkadaslikKabul,
  kullaniciKayitlari,
  gorunurlukGuncelle,
  arkadasListesi
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import KayitDetay from "../components/KayitDetay";

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
  const [kayitlar, setKayitlar] = useState([]);
  const [seciliKayit, setSeciliKayit] = useState(null);

  useEffect(() => {
    const yukle = async () => {
      setYukleniyor(true);
      setSonuc(null);
      setIstekModu(false);
      setMesaj("");
      setSeciliKayit(null);

      const kayitVeri = await kullaniciKayitlari(id);
      setKayitlar(kayitVeri);

      const veri = await profilGetir(id);
      setProfil(veri);

      const arkListe = await arkadasListesi(id);
      setArkadaslar(arkListe);

      if (veri && kullanici.id !== veri.id) {
        const durum = await arkadaslikDurum(id);
        setArkDurum(durum);
      } else {
        setArkDurum(null);
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

  const handleGorunurlukDegis = async (kayitId, yeniGorunurluk) => {
    if (await gorunurlukGuncelle(kayitId, yeniGorunurluk)) {
      setKayitlar((onceki) =>
        onceki.map((k) => (k.id === kayitId ? { ...k, gorunurluk: yeniGorunurluk } : k))
      );
      if (seciliKayit && seciliKayit.id === kayitId) {
        setSeciliKayit({ ...seciliKayit, gorunurluk: yeniGorunurluk });
      }
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

  const gorunurlukIkon = (g) =>
    g === "public" ? "🌍" : g === "friends" ? "👥" : "🔒";

  const durumEtiket = (d) =>
    d === "onaylandi" ? "✓ Onaylandı" : d === "reddedildi" ? "Reddedildi" : "Bekliyor";

  return (
    <div className="dashboard">
      <Header />
      <button className="geri-btn" onClick={() => navigate(-1)}>← Geri</button>

      <div className="profil-ust">
        <div className="profil-avatar profil-avatar--buyuk">
          {profil.ad.charAt(0).toUpperCase()}
        </div>
        <div className="profil-ust__bilgi">
          <h1>{profil.ad}</h1>
          <span className="profil-rol">{profil.rol === "yetkili" ? "Yetkili" : "Öğrenci"}</span>

          <div className="profil-sayac">
            <span><strong>{kayitlar.length}</strong> kayıt</span>
            <span><strong>{arkadaslar.length}</strong> arkadaş</span>
          </div>

          <p className="profil-email">{profil.email}</p>

          <div className="profil-ust__aksiyon">
            {!kendiProfilim && arkDurum && (
              <>
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
              </>
            )}
            {baglanmaGonderilebilir && !istekModu && (
              <button onClick={() => setIstekModu(true)}>Bağlanma İsteği Gönder</button>
            )}
          </div>
        </div>
      </div>

      {baglanmaGonderilebilir && istekModu && (
        <div className="profil-istek">
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
        </div>
      )}

      {sonuc && (
        <p className={sonuc.tur === "basari" ? "form-mesaj--basari" : "form-mesaj--hata"}>
          {sonuc.metin}
        </p>
      )}

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

      <div className="profil-kayitlar">
        <h2>Kayıtlar</h2>

        {kayitlar.length === 0 ? (
          <p className="bos-durum">Görüntülenecek kayıt yok.</p>
        ) : seciliKayit ? (
          <KayitDetay
            kayit={seciliKayit}
            kendiProfilim={kendiProfilim}
            onGorunurlukDegis={handleGorunurlukDegis}
            onGeri={() => setSeciliKayit(null)}
          />
        ) : (
          <div className="kayit-grid">
            {kayitlar.map((k) => (
              <button key={k.id} className="kayit-kare" onClick={() => setSeciliKayit(k)}>
                <div className="kayit-kare__ust">
                  <span className="kayit-kare__tarih">{k.tarih}</span>
                  <span className="kayit-kare__ikon">{gorunurlukIkon(k.gorunurluk)}</span>
                </div>
                <p className="kayit-kare__onizleme">{k.icerik}</p>
                <span className={`kayit-kare__durum kayit-kare__durum--${k.durum}`}>
                  {durumEtiket(k.durum)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profil;