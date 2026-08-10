function Modal({ baslik, acik, onKapat, children }) {
  if (!acik) return null;

  return (
    <div className="modal-arka" onClick={onKapat}>
      <div className="modal-kutu" onClick={(e) => e.stopPropagation()}>
        <div className="modal-baslik">
          <h3>{baslik}</h3>
          <button className="modal-kapat" onClick={onKapat}>✕</button>
        </div>
        <div className="modal-icerik">{children}</div>
      </div>
    </div>
  );
}

export default Modal;