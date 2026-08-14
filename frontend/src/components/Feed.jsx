import { useState, useEffect } from "react";
import {
  feedGetir,
  API_URL,
  begeniToggle,
  begeniDurum,
  yorumlariGetir,
  yorumEkle,
  yorumSil,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const GORUNURLUK_ETIKETLERI = {
  public: "Herkese açık",
  friends: "Arkadaşlar",
};

function FeedKart({ kayit }) {
  const { kullanici } = useAuth();

  const [begeni, setBegeni] = useState({ sayi: 0, benBegendim: false });
  const [yorumAcik, setYorumAcik] = useState(false);
  const [yorumlar, setYorumlar] = useState([]);
  const [yorumYuklendi, setYorumYuklendi] = useState(false);
  const [yeniYorum, setYeniYorum] = useState("");

  useEffect(() => {
    const yukle = async () => {
      setBegeni(await begeniDurum(kayit.id));
    };
    yukle();
  }, [kayit.id]);

  const gorunurlukEtiket = (g) => GORUNURLUK_ETIKETLERI[g] || "Sadece ben";

  const handleBegeni = async () => {
    const sonuc = await begeniToggle(kayit.id);
    if (sonuc) {
      setBegeni((onceki) => ({
        sayi: sonuc.begendi ? onceki.sayi + 1 : onceki.sayi - 1,
        benBegendim: sonuc.begendi,
      }));
    }
  };

  const handleYorumAc = async () => {
    const acilacak = !yorumAcik;
    setYorumAcik(acilacak);
    if (acilacak && !yorumYuklendi) {
      setYorumlar(await yorumlariGetir(kayit.id));
      setYorumYuklendi(true);
    }
  };

  const handleYorumEkle = async () => {
    if (!yeniYorum.trim()) return;
    if (await yorumEkle(kayit.id, yeniYorum)) {
      setYeniYorum("");
      setYorumlar(await yorumlariGetir(kayit.id));
      setYorumYuklendi(true);
    }
  };

  const handleYorumSil = async (yorumId) => {
    if (await yorumSil(yorumId)) {
      setYorumlar((onceki) => onceki.filter((y) => y.id !== yorumId));
    }
  };

  return (
    <div className="feed-kart">
      <div className="feed-kart__ust">
        <span className="feed-kart__ad">{kayit.sahipAd}</span>
        <span className="feed-kart__tarih">{kayit.tarih}</span>
      </div>
      <p className="feed-kart__icerik">{kayit.icerik}</p>
      {kayit.fotografYolu && (
        <img
          className="feed-kart__foto"
          src={`${API_URL.replace("/api", "")}${kayit.fotografYolu}`}
          alt="Defter fotoğrafı"
        />
      )}
      <span className="feed-kart__gorunurluk">{gorunurlukEtiket(kayit.gorunurluk)}</span>

      <div className="kayit-detay__aksiyon">
        <button
          type="button"
          className={`begeni-btn ${begeni.benBegendim ? "begeni-btn--aktif" : ""}`}
          onClick={handleBegeni}
        >
          {begeni.benBegendim ? "❤️" : "🤍"} {begeni.sayi}
        </button>

        <button type="button" className="btn--ikincil" onClick={handleYorumAc}>
          💬 {yorumYuklendi ? yorumlar.length : ""}
        </button>
      </div>

      {yorumAcik && (
        <div className="yorum-bolum">
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
      )}
    </div>
  );
}

function Feed() {
  const [kayitlar, setKayitlar] = useState([]);

  useEffect(() => {
    const yukle = async () => {
      setKayitlar(await feedGetir());
    };
    yukle();
  }, []);

  if (kayitlar.length === 0) {
    return <p className="bos-durum">Henüz gösterilecek kayıt yok.</p>;
  }

  return (
    <div className="feed">
      {kayitlar.map((k) => (
        <FeedKart key={k.id} kayit={k} />
      ))}
    </div>
  );
}

export default Feed;
