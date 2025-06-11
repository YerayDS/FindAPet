import React, { createContext, useContext, useState, useEffect } from "react";

const AdoptionContext = createContext();

const API_URL = "http://localhost:4000";

export const AdoptionProvider = ({ children }) => {
  const [successfulAdoptions, setSuccessfulAdoptions] = useState(0);

  // Al cargar el componente, obtener el contador guardado en la base de datos
  useEffect(() => {
    fetch(`${API_URL}/api/adoption/count`)
      .then((res) => res.json())
      .then((data) => setSuccessfulAdoptions(data.count))
      .catch(console.error);
  }, []);

  const incrementAdoptions = () => {
    fetch(`${API_URL}/api/adoption/increment`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => setSuccessfulAdoptions(data.count))
      .catch(console.error);
  };

  return (
    <AdoptionContext.Provider value={{ successfulAdoptions, incrementAdoptions }}>
      {children}
    </AdoptionContext.Provider>
  );
};

export const useAdoption = () => useContext(AdoptionContext);
