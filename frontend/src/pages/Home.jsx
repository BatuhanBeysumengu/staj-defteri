import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { kullanici } = useAuth();
  const handleTiklama = () => {
    if (kullanici) {
      navigate(`/${kullanici.rol}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home">
      <div className="home__icerik">
        <h1 className="home__baslik">Staj Defteri</h1>
        <p className="home__aciklama">
          Staj kayıtlarınızı çevrim içi tutun, sorumlunuzun onayına sunun.
          Kağıt defter taşımaya gerek yok.
        </p>

        <button type="button" onClick={handleTiklama}>
          {kullanici ? "Panele Git" : "Giriş Yap"}
        </button>

        <div className="home__ozellikler">
          <div className="home__ozellik">
            <h3>Kolay Kayıt</h3>
            <p>Günlük çalışmalarınızı birkaç saniyede kaydedin.</p>
          </div>
          <div className="home__ozellik">
            <h3>Hızlı Onay</h3>
            <p>Sorumlunuz kayıtlarınızı görüntüleyip onaylasın.</p>
          </div>
          <div className="home__ozellik">
            <h3>Her Zaman Erişim</h3>
            <p>Geçmiş kayıtlarınıza istediğiniz an ulaşın.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;