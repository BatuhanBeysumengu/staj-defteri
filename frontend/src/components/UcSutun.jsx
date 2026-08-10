function UcSutun({ sol, orta, sag }) {
  return (
    <div className="uc-sutun">
      <aside className="uc-sutun__yan uc-sutun__sol">{sol}</aside>
      <main className="uc-sutun__orta">{orta}</main>
      <aside className="uc-sutun__yan uc-sutun__sag">{sag}</aside>
    </div>
  );
}

export default UcSutun;