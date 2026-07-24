import { useState } from "react";
import { Navigate, useNavigate,Link } from "react-router-dom";
import { girisYap } from "../services/deneme";
import { useAuth } from "../context/AuthContext";

function Login() {
  const {giris}= useAuth();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");

  const navigate = useNavigate();

  const handleGiris= () => {
    const kullanici = girisYap(email ,sifre);

    if(!kullanici) {
      setHata("E-Posta veya şifre hatalı")
      return;
    }

    giris(kullanici);

    if(kullanici.rol=== "yetkili") {
      navigate("/yetkili");
    }else{
      navigate("/ogrenci");
    }
  };
  return(
    <div className="login">
      <Link to="/" className="geri-link">←Ana Sayfa</Link>
      <h1>Staj Defteri</h1>
      <p> Devam etmek için giriş yapın</p>
      <input
        type="email"
        placeholder="E-Posta"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="şifre"
        value={sifre}
        onChange={(e) => setSifre(e.target.value)}
      />
      {hata && <p className="hata">{hata}</p>}
      <button onClick={handleGiris}>Giriş Yap</button>
      </div>
  );
}
export default Login;