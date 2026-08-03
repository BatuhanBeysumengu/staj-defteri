import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { profilGetir } from "../services/api";

function Profil() {
  const { id } = useParams();   
  const [profil, setProfil] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const yukle = async () => {
      setYukleniyor(true);
      const veri = await profilGetir(id);
      setProfil(veri);
      setYukleniyor(false);
    };
    yukle();
  }, [id]);  

  if (yukleniyor) {
    return (
      <div className="dashboard">
        <Header />
        <p className="bos-durum">Yükleniyor...</p>
      </div>
    );
  }

  if (!profil) {
    return (
      <div className="dashboard">
        <Header />
        <p className="bos-durum">Kullanıcı bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header />

      <div className="profil-kart">
        <div className="profil-avatar">{profil.ad.charAt(0).toUpperCase()}</div>
        <h1>{profil.ad}</h1>
        <p className="profil-rol">{profil.rol === "yetkili" ? "Yetkili" : "Öğrenci"}</p>
        <p className="profil-email">{profil.email}</p>
      </div>
    </div>
  );
}

export default Profil;