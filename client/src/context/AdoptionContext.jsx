import React, { createContext, useContext, useState } from "react";

const AdoptionContext = createContext();

export const AdoptionProvider = ({ children }) => {
  const [successfulAdoptions, setSuccessfulAdoptions] = useState(0);

  const incrementAdoptions = () => setSuccessfulAdoptions(prev => prev + 1);

  return (
    <AdoptionContext.Provider value={{ successfulAdoptions, incrementAdoptions }}>
      {children}
    </AdoptionContext.Provider>
  );
};

export const useAdoption = () => useContext(AdoptionContext);
