import { createContext, useContext, useState, useEffect } from "react";

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem("tema") || "koyu";
  });

  useEffect(() => {
    if (tema === "acik") {
      document.body.classList.add("acik-tema");
    } else {
      document.body.classList.remove("acik-tema");
    }
    localStorage.setItem("tema", tema);
  }, [tema]);

  const temaDegistir = () => {
    setTema((onceki) => (onceki === "koyu" ? "acik" : "koyu"));
  };

  return (
    <TemaContext.Provider value={{ tema, temaDegistir }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}