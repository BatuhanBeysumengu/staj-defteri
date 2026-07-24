function EntryCard({ tarih, icerik, durum, ogrenciAdi, onOnayla, onReddet }) {
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
      {(onOnayla || onReddet) && (
        <div className="entry-card__aksiyonlar">
          {onOnayla && <button onClick={onOnayla}>Onayla</button>}
          {onReddet && (
            <button className="btn--tehlike" onClick={onReddet}>
              Reddet
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EntryCard;