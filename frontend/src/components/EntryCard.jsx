import { useState } from "react";
import { API_URL } from "../services/api";

function EntryCard({
  tarih,
  icerik,
  durum,
  ogrenciAdi,
  redAciklamasi,
  redTarihi,
  reddedenAd,
  fotografYolu,
  onOnayla,
  onReddet,
  onSil,
}) {
  const [redModu, setRedModu] = useState(false);
  const [aciklama, setAciklama] = useState("");

  const handleReddet = () => {
    if (!redModu) {
      setRedModu(true);
      return;
    }
    if (!aciklama.trim()) return;
    onReddet(aciklama);
    setRedModu(false);
    setAciklama("");
  };

  return (
    <div className="entry-card">
      <div className="entry-card__ust">
        <span className="entry-card__tarih">{tarih}</span>
        {ogrenciAdi && <span className="entry-card__ogrenci">{ogrenciAdi}</span>}
      </div>

      <p className="entry-card__icerik">{icerik}</p>

      {fotografYolu && (
        <img
          className="entry-card__foto"
          src={`${API_URL.replace("/api", "")}${fotografYolu}`}
          alt="Defter fotoğrafı"
        />
      )}

      <span className={`entry-card__durum entry-card__durum--${durum}`}>
        {durum}
      </span>

      {durum === "reddedildi" && redAciklamasi && (
        <div className="entry-card__red-bilgi">
          <strong>Red sebebi:</strong> {redAciklamasi}
          {reddedenAd && redTarihi && (
            <span className="entry-card__red-meta">
              {reddedenAd} · {new Date(redTarihi).toLocaleDateString("tr-TR")}
            </span>
          )}
        </div>
      )}
      {redModu && (
        <textarea
          className="entry-card__red-input"
          placeholder="Red sebebini yazın"
          value={aciklama}
          onChange={(e) => setAciklama(e.target.value)}
          rows={2}
        />
      )}
      {(onOnayla || onReddet || onSil) && (
        <div className="entry-card__aksiyonlar">
          {onOnayla && !redModu && <button type="button" onClick={onOnayla}>Onayla</button>}
          {onReddet && (
            <button type="button" className="btn--tehlike" onClick={handleReddet}>
              {redModu ? "Reddi Gönder" : "Reddet"}
            </button>
          )}
          {onSil && !redModu && (
            <button type="button" className="btn--tehlike" onClick={onSil}>🗑️ Sil</button>
          )}
        </div>
      )}
    </div>
  );
}

export default EntryCard;