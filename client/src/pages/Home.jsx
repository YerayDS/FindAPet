import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer"; 
import "../styles/Home.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="home-page">
      <nav className={`navbar ${menuOpen ? "expanded" : ""}`}>
        <div className="navbar-top">
          <h1 className="logo">Pawfect Match 🐾</h1>
          <div className="navbar-right">
            {user ? (
              <>
                <span className="navbar-hello">
                  Hello, <strong>{user.username || user.email}</strong>
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false); // opcional para cerrar el menú si está abierto
                  }}
                  className="logout-button"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="login-button"
                onClick={() => setMenuOpen(false)}
                state={{ from: location.pathname }}
              >
                Log In
              </Link>
            )}
            <div className="menu-icon" onClick={toggleMenu}>
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </div>
          </div>
        </div>
        <div className="nav-menu">
          <Link to="/pets" onClick={() => setMenuOpen(false)}>
            Pet List
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </div>
      </nav>

      <section className="adoption-section">
        <h3 className="adoption-quote">Adopt a pet, save a life</h3>
        <img
          src="/assets/humandog.jpg"
          alt="Pet adoption"
          className="adoption-image"
        />
        <p className="adoption-stats">
          Approximately <strong>75,000</strong> animals are abandoned every day.
        </p>
      </section>
      <Footer />
    </div>
  );
}
