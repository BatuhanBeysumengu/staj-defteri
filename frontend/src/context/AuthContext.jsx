import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [kullanici, setKullanici] = useState(() => {
    const kayitli = localStorage.getItem("kullanici");
    return kayitli ? JSON.parse(kayitli) : null;
  });

  const giris = (kullaniciBilgisi, token) => {
    setKullanici(kullaniciBilgisi);
    localStorage.setItem("kullanici", JSON.stringify(kullaniciBilgisi));
    localStorage.setItem("token", token);
  };

  const cikis = () => {
    setKullanici(null);
    localStorage.removeItem("kullanici");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ kullanici, giris, cikis }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}