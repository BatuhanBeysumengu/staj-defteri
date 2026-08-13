import { useState, useEffect } from "react";
import {
  begeniToggle,
  begeniDurum,
  yorumlariGetir,
  yorumEkle,
  yorumSil,
  arkadasListem,
  mesajGonder,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function KayitDetay({ kayit, kendiProfilim, onGorunurlukDegis, onGeri }) {
  const { kullanici } = useAuth();

  const [begeni, setBegeni] = useState({ sayi: 0, benBegendim: false });
  const [yorumlar, setYorumlar] = useState([]);
  const [yeniYorum, setYeniYorum] = useState("");

  const [paylasModu, setPaylasModu] = useState(false);
  const [arkadaslar, setArkadaslar] = useState([]);
  const [paylasSonuc, setPaylasSonuc] = useState("");

  useEffect(() => {
    const yukle = async () => {
      setBegeni(await begeniDurum(kayit.id));
      setYorumlar(await yorumlariGetir(kayit.id));
    };
    yukle();
    setPaylasModu(false);
    setPaylasSonuc("");
  }, [kayit.id]);

  const handleBegeni = async () => {
    const sonuc = await begeniToggle(kayit.id);
    if (sonuc) {
      setBegeni((onceki) => ({
        sayi: sonuc.begendi ? onceki.sayi + 1 : onceki.sayi - 1,
        benBegendim: sonuc.begendi,
      }));
    }
  };

  const handleYorumEkle = async () => {
    if (!yeniYorum.trim()) return;
    if (await yorumEkle(kayit.id, yeniYorum)) {
      setYeniYorum("");
      setYorumlar(await yorumlariGetir(kayit.id));
    }
  };

  const handleYorumSil = async (yorumId) => {
    if (await yorumSil(yorumId)) {
      setYorumlar((onceki) => onceki.filter((y) => y.id !== yorumId));
    }
  };

  const handlePaylasAc = async () => {
    setPaylasModu(true);
    setArkadaslar(await arkadasListem());
  };

  const handleKaydiGonder = async (arkadasId) => {
    const sonuc = await mesajGonder(arkadasId, null, kayit.id);
    if (sonuc.basarili) {
      setPaylasSonuc("Kayıt gönderildi");
      setPaylasModu(false);
    } else {
      setPaylasSonuc(sonuc.mesaj);
    }
  };

  return (
    <div className="kayit-detay">
      <button type="button" className="geri-btn" onClick={onGeri}>← Kayıtlara dön</button>

      <div className="kayit-detay__kart">
        <div className="kayit-detay__ust">
          <span className="kayit-detay__tarih">{kayit.tarih}</span>
          <span className={`entry-card__durum entry-card__durum--${kayit.durum}`}>
            {kayit.durum}
          </span>
        </div>

        <p className="kayit-detay__icerik">{kayit.icerik}</p>

        {kendiProfilim && (
          <select
            className="gorunurluk-select-detay"
            value={kayit.gorunurluk}
            onChange={(e) => onGorunurlukDegis(kayit.id, e.target.value)}
          >
            <option value="private">🔒 Özel</option>
            <option value="friends">👥 Arkadaşlar</option>
            <option value="public">🌍 Herkes</option>
          </select>
        )}

        <div className="kayit-detay__aksiyon">
          <button
            type="button"
            className={`begeni-btn ${begeni.benBegendim ? "begeni-btn--aktif" : ""}`}
            onClick={handleBegeni}
          >
            {begeni.benBegendim ? "❤️" : "🤍"} {begeni.sayi}
          </button>

          <button type="button" className="btn--ikincil" onClick={handlePaylasAc}>
            📤 Arkadaşa Gönder
          </button>
        </div>

        {paylasSonuc && <p className="form-mesaj--basari">{paylasSonuc}</p>}

        {paylasModu && (
          <div className="paylas-liste">
            {arkadaslar.length === 0 ? (
              <p className="yorum-bos">Gönderecek arkadaşınız yok.</p>
            ) : (
              arkadaslar.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  className="paylas-oge"
                  onClick={() => handleKaydiGonder(a.id)}
                >
                  <span className="paylas-oge__avatar">{a.ad.charAt(0).toUpperCase()}</span>
                  {a.ad}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="yorum-bolum">
        <h3>Yorumlar ({yorumlar.length})</h3>

        <div className="yorum-ekle">
          <input
            type="text"
            placeholder="Yorum yaz..."
            value={yeniYorum}
            onChange={(e) => setYeniYorum(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleYorumEkle()}
          />
          <button type="button" onClick={handleYorumEkle}>Gönder</button>
        </div>

        {yorumlar.length === 0 ? (
          <p className="yorum-bos">Henüz yorum yok.</p>
        ) : (
          yorumlar.map((y) => (
            <div key={y.id} className="yorum-oge">
              <div className="yorum-oge__ust">
                <span className="yorum-oge__ad">{y.kullaniciAd}</span>
                <span className="yorum-oge__tarih">
                  {new Date(y.tarih).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <p className="yorum-oge__icerik">{y.icerik}</p>
              {y.kullaniciId === kullanici.id && (
                <button type="button" className="yorum-sil" onClick={() => handleYorumSil(y.id)}>
                  Sil
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default KayitDetay;