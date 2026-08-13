function Modal({ baslik, acik, onKapat, children }) {
  if (!acik) return null;

  return (
    <div className="modal-arka">
      <button
        type="button"
        className="modal-arka__kapat"
        aria-label="Kapat"
        onClick={onKapat}
      />
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