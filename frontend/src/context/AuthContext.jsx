import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
export function AuthProvider({children}) {
  const [kullanici, setKullanici]= useState(null);

  const giris= (k) => setKullanici(k);
  const cikis= () => setKullanici(null);

  return(
    <AuthContext.Provider value={{kullanici, giris, cikis}}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth(){
  return useContext(AuthContext);
}