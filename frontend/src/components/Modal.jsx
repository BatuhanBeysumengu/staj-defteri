function Modal({ baslik, acik, onKapat, children }) {
  if (!acik) return null;

  const handleArkaTiklama = (e) => {
    if (e.target === e.currentTarget) onKapat();
  };

  const handleArkaKeyDown = (e) => {
    if (e.key === "Escape" || e.key === "Enter") onKapat();
  };

  return (
    <div
      className="modal-arka"
      role="button"
      tabIndex={0}
      aria-label="Kapat"
      onClick={handleArkaTiklama}
      onKeyDown={handleArkaKeyDown}
    >
      <div className="modal-kutu">
        <div className="modal-baslik">
          <h3>{baslik}</h3>
          <button type="button" className="modal-kapat" onClick={onKapat}>✕</button>
        </div>
        <div className="modal-icerik">{children}</div>
      </div>
    </div>
  );
}

export default Modal;