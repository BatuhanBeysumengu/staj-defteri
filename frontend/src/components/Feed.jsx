import { useState, useEffect } from "react";
import { feedGetir } from "../services/api";

function Feed() {
  const [kayitlar, setKayitlar] = useState([]);

  useEffect(() => {
    const yukle = async () => {
      setKayitlar(await feedGetir());
    };
    yukle();
  }, []);

  const gorunurlukEtiket = (g) =>
    g === "public" ? "Herkese açık" : g === "friends" ? "Arkadaşlar" : "Sadece ben";

  if (kayitlar.length === 0) {
    return <p className="bos-durum">Henüz gösterilecek kayıt yok.</p>;
  }

  return (
    <div className="feed">
      {kayitlar.map((k) => (
        <div key={k.id} className="feed-kart">
          <div className="feed-kart__ust">
            <span className="feed-kart__ad">{k.sahipAd}</span>
            <span className="feed-kart__tarih">{k.tarih}</span>
          </div>
          <p className="feed-kart__icerik">{k.icerik}</p>
          <span className="feed-kart__gorunurluk">{gorunurlukEtiket(k.gorunurluk)}</span>
        </div>
      ))}
    </div>
  );
}

export default Feed;