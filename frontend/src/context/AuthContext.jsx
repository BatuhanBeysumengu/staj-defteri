import { createContext, useContext, useState, useMemo, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [kullanici, setKullanici] = useState(() => {
    const kayitli = localStorage.getItem("kullanici");
    return kayitli ? JSON.parse(kayitli) : null;
  });

  const giris = useCallback((kullaniciBilgisi, token) => {
    setKullanici(kullaniciBilgisi);
    localStorage.setItem("kullanici", JSON.stringify(kullaniciBilgisi));
    localStorage.setItem("token", token);
  }, []);

  const cikis = useCallback(() => {
    setKullanici(null);
    localStorage.removeItem("kullanici");
    localStorage.removeItem("token");
  }, []);

  const value = useMemo(
    () => ({ kullanici, giris, cikis }),
    [kullanici, giris, cikis]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}