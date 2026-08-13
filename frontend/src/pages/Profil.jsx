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
  arkadasListesi,
  odevVer
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import KayitDetay from "../components/KayitDetay";

const GORUNURLUK_IKONLARI = {
  public: "🌍",
  friends: "👥",
};

const KAYIT_DURUM_ETIKETLERI = {
  onaylandi: "✓ Onaylandı",
  reddedildi: "Reddedildi",
};

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
  const [odevModu, setOdevModu] = useState(false);
  const [odevBaslik, setOdevBaslik] = useState("");
  const [odevAciklama, setOdevAciklama] = useState("");
  const [odevTarih, setOdevTarih] = useState("");
  const [odevSonuc, setOdevSonuc] = useState(null);

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
  const handleOdevVer = async () => {
    if (!odevBaslik.trim() || !odevTarih) {
      setOdevSonuc({ tur: "hata", metin: "Başlık ve teslim tarihi gerekli" });
      return;
    }
    const sonuc = await odevVer(odevBaslik, odevAciklama, odevTarih, profil.id);
    if (sonuc.basarili) {
      setOdevSonuc({ tur: "basari", metin: "Ödev verildi" });
      setOdevBaslik("");
      setOdevAciklama("");
      setOdevTarih("");
      setOdevModu(false);
    } else {
      setOdevSonuc({ tur: "hata", metin: sonuc.mesaj });
    }
  };

  const kendiProfilim = kullanici.id === profil.id;
  const baglanmaGonderilebilir =
    kullanici.rol === "ogrenci" && profil.rol === "yetkili" && !kendiProfilim;

  const gorunurlukIkon = (g) => GORUNURLUK_IKONLARI[g] || "🔒";

  const durumEtiket = (d) => KAYIT_DURUM_ETIKETLERI[d] || "Bekliyor";

  const kayitlarIcerigiGoster = () => {
    if (kayitlar.length === 0) {
      return <p className="bos-durum">Görüntülenecek kayıt yok.</p>;
    }
    if (seciliKayit) {
      return (
        <KayitDetay
          kayit={seciliKayit}
          kendiProfilim={kendiProfilim}
          onGorunurlukDegis={handleGorunurlukDegis}
          onGeri={() => setSeciliKayit(null)}
        />
      );
    }
    return (
      <div className="kayit-grid">
        {kayitlar.map((k) => (
          <button type="button" key={k.id} className="kayit-kare" onClick={() => setSeciliKayit(k)}>
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
    );
  };

  return (
    <div className="dashboard">
      <Header />
      <button type="button" className="geri-btn" onClick={() => navigate(-1)}>← Geri</button>

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
                {kullanici.rol === "yetkili" && profil.rol === "ogrenci" && (
                  <button type="button" onClick={() => setOdevModu(true)}>Ödev Ver</button>
                )}
                <button type="button" onClick={() => navigate(`/mesajlar?kisi=${profil.id}&ad=${encodeURIComponent(profil.ad)}`)}>Mesaj Gönder</button>
                {arkDurum.durum === "yok" && (
                  <button type="button" onClick={handleArkadasEkle}>Arkadaş Ekle</button>
                )}
                {arkDurum.durum === "gonderildi" && (
                  <button type="button" className="btn--ikincil" disabled>İstek Gönderildi</button>
                )}
                {arkDurum.durum === "geldi" && (
                  <button type="button" onClick={handleArkadasKabul}>İsteği Kabul Et</button>
                )}
                {arkDurum.durum === "arkadas" && (
                  <button type="button" className="btn--ikincil" disabled>✓ Arkadaşsınız</button>
                )}
              </>
            )}
            {baglanmaGonderilebilir && !istekModu && (
              <button type="button" onClick={() => setIstekModu(true)}>Bağlanma İsteği Gönder</button>
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
            <button type="button" onClick={handleBaglanmaGonder}>Gönder</button>
            <button type="button" className="btn--ikincil" onClick={() => setIstekModu(false)}>İptal</button>
          </div>
        </div>
      )}

      {sonuc && (
        <p className={sonuc.tur === "basari" ? "form-mesaj--basari" : "form-mesaj--hata"}>
          {sonuc.metin}
        </p>
      )}
      {odevModu && (
        <div className="odev-form">
          <h3>Ödev Ver</h3>
          <input
            type="text"
            placeholder="Ödev başlığı"
            value={odevBaslik}
            onChange={(e) => setOdevBaslik(e.target.value)}
          />
          <textarea
            placeholder="Açıklama (isteğe bağlı)"
            value={odevAciklama}
            onChange={(e) => setOdevAciklama(e.target.value)}
            rows={3}
          />
          <label className="odev-form__tarih">
            <span>Son teslim tarihi:</span>
            <input type="date" value={odevTarih} onChange={(e) => setOdevTarih(e.target.value)} />
          </label>
          <div className="odev-form__aksiyon">
            <button type="button" onClick={handleOdevVer}>Gönder</button>
            <button type="button" className="btn--ikincil" onClick={() => setOdevModu(false)}>İptal</button>
          </div>
        </div>
      )}

      {odevSonuc && (
        <p className={odevSonuc.tur === "basari" ? "form-mesaj--basari" : "form-mesaj--hata"}>
          {odevSonuc.metin}
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

        {kayitlarIcerigiGoster()}
      </div>
    </div>
  );
}

export default Profil;