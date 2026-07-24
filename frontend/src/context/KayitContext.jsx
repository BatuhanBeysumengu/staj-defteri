import { createContext, useContext, useState } from "react";
import { kayitlar as baslangicKayitlari } from "../services/entryService";

const KayitContext = createContext(null);

export function KayitProvider({ children }) {
  const [kayitlar, setKayitlar] = useState(baslangicKayitlari);

  const kayitEkle = (icerik, ogrenciId) => {
    const yeniKayit = {
      id: Date.now(),
      tarih: new Date().toISOString().split("T")[0],
      icerik,
      durum: "bekliyor",
      ogrenciId,
    };
    setKayitlar([yeniKayit, ...kayitlar]);
  };

  const kayitOnayla = (id) => {
    setKayitlar(
      kayitlar.map((k) => (k.id === id ? { ...k, durum: "onaylandi" } : k))
    );
  };
  const kayitReddet = (id) => {
  setKayitlar(
    kayitlar.map((k) => (k.id === id ? { ...k, durum: "reddedildi" } : k))
  );
};

  return (
    <KayitContext.Provider value={{ kayitlar, kayitEkle, kayitOnayla, kayitReddet }}>
      {children}
    </KayitContext.Provider>
  );
}

export function useKayit() {
  return useContext(KayitContext);
}