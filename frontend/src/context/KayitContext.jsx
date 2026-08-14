import { createContext, useContext, useState, useMemo, useCallback } from "react";
import { apiIstek } from "../services/api";

const KayitContext = createContext(null);

export function KayitProvider({ children }) {
  const [kayitlar, setKayitlar] = useState([]);

  const kayitlariYukle = useCallback(async () => {
    const cevap = await apiIstek("/kayitlar/benim");
    if (cevap.ok) {
      setKayitlar(await cevap.json());
    }
  }, []);

  const kayitEkle = useCallback(async (icerik, gorunurluk) => {
    const cevap = await apiIstek("/kayitlar", {
      method: "POST",
      body: JSON.stringify({ icerik, gorunurluk }),
    });
    if (!cevap.ok) return null;
    const yeni = await cevap.json();
    kayitlariYukle();
    setKayitlar((onceki) => [yeni, ...onceki]);
    return yeni.id;
  }, [kayitlariYukle]);

  const kayitOnayla = useCallback(async (id) => {
    const cevap = await apiIstek(`/kayitlar/${id}/onayla`, { method: "PUT" });
    if (cevap.ok) {
      const guncel = await cevap.json();
      setKayitlar((onceki) => onceki.map((k) => (k.id === id ? guncel : k)));
    }
  }, []);

  const kayitReddet = useCallback(async (id, aciklama) => {
    const cevap = await apiIstek(`/kayitlar/${id}/reddet`, {
      method: "PUT",
      body: JSON.stringify({ aciklama }),
    });
    if (cevap.ok) {
      const guncel = await cevap.json();
      setKayitlar((onceki) => onceki.map((k) => (k.id === id ? guncel : k)));
    }
  }, []);

  const value = useMemo(
    () => ({ kayitlar, kayitlariYukle, kayitEkle, kayitOnayla, kayitReddet }),
    [kayitlar, kayitlariYukle, kayitEkle, kayitOnayla, kayitReddet]
  );

  return (
    <KayitContext.Provider value={value}>
      {children}
    </KayitContext.Provider>
  );
}


export function useKayit() {
  return useContext(KayitContext);
}