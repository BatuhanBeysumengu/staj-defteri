function EntryCard({ tarih, icerik, durum, onOnayla }) {
  return (
    <div className="entry-card">
      <span className="entry-card__tarih">{tarih}</span>
      <p className="entry-card__icerik">{icerik}</p>
      <span className={`entry-card__durum entry-card__durum--${durum}`}>
        {durum}
      </span>

      {onOnayla && <button onClick={onOnayla}>Onayla</button>}
    </div>
  );
}

export default EntryCard;