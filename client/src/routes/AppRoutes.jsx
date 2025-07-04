import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import PetList from "../pages/PetList";
import About from "../pages/About";
import AuthPage from "../pages/AuthPage"; 
import PetDetail from "../pages/PetDetail"; 


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<PetList />} />
        <Route path="/pet/:id" element={<PetDetail />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<AuthPage />} /> 
      </Routes>
    </Router>
  );
}