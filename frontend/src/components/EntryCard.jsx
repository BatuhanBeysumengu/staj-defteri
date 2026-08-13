import { useState } from "react";

function EntryCard({
  tarih,
  icerik,
  durum,
  ogrenciAdi,
  redAciklamasi,
  redTarihi,
  reddedenAd,
  onOnayla,
  onReddet,
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
      {(onOnayla || onReddet) && (
        <div className="entry-card__aksiyonlar">
          {onOnayla && !redModu && <button type="button" onClick={onOnayla}>Onayla</button>}
          {onReddet && (
            <button type="button" className="btn--tehlike" onClick={handleReddet}>
              {redModu ? "Reddi Gönder" : "Reddet"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EntryCard;