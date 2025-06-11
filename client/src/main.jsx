import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AdoptionProvider } from "./context/AdoptionContext"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <AdoptionProvider>
        <App />
      </AdoptionProvider>
    </AuthProvider>
  </React.StrictMode>
);
