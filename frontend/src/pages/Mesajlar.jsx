import { useState, useEffect } from "react";
import Header from "../components/Header";
import Konusma from "../components/Konusma";
import { mesajKutusu, arkadasListem } from "../services/api";

function Mesajlar() {
  const [kutu, setKutu] = useState([]);
  const [arkadaslar, setArkadaslar] = useState([]);
  const [secili, setSecili] = useState(null);

  useEffect(() => {
    const yukle = async () => {
      setKutu(await mesajKutusu());
      setArkadaslar(await arkadasListem());
    };
    yukle();
  }, []);

  const kutuIdler = new Set(kutu.map((k) => k.kullaniciId));
  const mesajsizArkadaslar = arkadaslar.filter((a) => !kutuIdler.has(a.id));

  return (
    <div className="dashboard">
      <Header />
      <div className="mesajlar">
        <div className="mesajlar__liste">
          <h2>Mesajlar</h2>

          {kutu.map((k) => (
            <button
              type="button"
              key={k.kullaniciId}
              className={`konusma-oge ${secili?.id === k.kullaniciId ? "konusma-oge--aktif" : ""}`}
              onClick={() => setSecili({ id: k.kullaniciId, ad: k.kullaniciAd })}
            >
              <span className="konusma-oge__avatar">{k.kullaniciAd.charAt(0).toUpperCase()}</span>
              <div className="konusma-oge__bilgi">
                <span className="konusma-oge__ad">{k.kullaniciAd}</span>
                <span className="konusma-oge__son">{k.sonMesaj}</span>
              </div>
            </button>
          ))}

          {mesajsizArkadaslar.length > 0 && (
            <>
              <h3 className="mesajlar__altbaslik">Arkadaşlar</h3>
              {mesajsizArkadaslar.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  className={`konusma-oge ${secili?.id === a.id ? "konusma-oge--aktif" : ""}`}
                  onClick={() => setSecili({ id: a.id, ad: a.ad })}
                >
                  <span className="konusma-oge__avatar">{a.ad.charAt(0).toUpperCase()}</span>
                  <div className="konusma-oge__bilgi">
                    <span className="konusma-oge__ad">{a.ad}</span>
                    <span className="konusma-oge__son">Mesaj başlat</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {kutu.length === 0 && arkadaslar.length === 0 && (
            <p className="bos-durum">Henüz arkadaşın yok.</p>
          )}
        </div>

        <div className="mesajlar__konusma">
          {secili ? (
            <Konusma digerId={secili.id} digerAd={secili.ad} />
          ) : (
            <p className="bos-durum">Bir konuşma seç.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mesajlar;