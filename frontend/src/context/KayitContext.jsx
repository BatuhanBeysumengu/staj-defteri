import { createContext, useContext, useState } from "react";
import { apiIstek } from "../services/api";

const KayitContext = createContext(null);

export function KayitProvider({ children }) {
  const [kayitlar, setKayitlar] = useState([]);
  const kayitlariYukle = async () => {
    const cevap = await apiIstek("/kayitlar/benim");
    if (cevap.ok) {
      setKayitlar(await cevap.json());
    }
  };

  const kayitEkle = async (icerik,gorunurluk) => {
    const cevap = await apiIstek("/kayitlar", {
      method: "POST",
      body: JSON.stringify({ icerik,gorunurluk }),   
    });
    if (cevap.ok) {
      kayitlariYukle();
      const yeni = await cevap.json();
      setKayitlar([yeni, ...kayitlar]);
    }
  };

  const kayitOnayla = async (id) => {
    const cevap = await apiIstek(`/kayitlar/${id}/onayla`, { method: "PUT" });
    if (cevap.ok) {
      const guncel = await cevap.json();
      setKayitlar(kayitlar.map((k) => (k.id === id ? guncel : k)));
    }
  };

  const kayitReddet = async (id, aciklama) => {
  const cevap = await apiIstek(`/kayitlar/${id}/reddet`, {
    method: "PUT",
    body: JSON.stringify({ aciklama }),
  });
  if (cevap.ok) {
    const guncel = await cevap.json();
    setKayitlar(kayitlar.map((k) => (k.id === id ? guncel : k)));
  }
};
  return (
    <KayitContext.Provider
      value={{ kayitlar, kayitlariYukle, kayitEkle, kayitOnayla, kayitReddet }}
    >
      {children}
    </KayitContext.Provider>
  );
}


export function useKayit() {
  return useContext(KayitContext);
}