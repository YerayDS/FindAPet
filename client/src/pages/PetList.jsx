import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/PetList.css";
import { getAllPets } from "../services/petService";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer"; 
import ChatPanel from "../components/ChatPanel";
import { useAdoption } from "../context/AdoptionContext";



export default function PetList() {
  const location = useLocation();
  const { user, token, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    age: "",
    size: "",
    gender: "",
    province: ""
  });

  const [form, setForm] = useState({
    name: "",
    age: "",
    size: "",
    type: "",
    birthday: "",
    gender: "",
    province: "",
    photo: null,
    breed: ""
  });

  const [showRegisterForm, setShowRegisterForm] = useState(false);
    
  const { successfulAdoptions } = useAdoption();

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const data = await getAllPets();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      setForm((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      }

      await api.post("/pets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}` 
        }
      });

      setForm({
        name: "",
        age: "",
        size: "",
        type: "",
        birthday: "",
        gender: "",
        province: "",
        photo: null,
        breed: ""
      });

      fetchPets();
      setShowRegisterForm(false);
    } catch (error) {
      console.error("Error creating pet:", error);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      age: "",
      size: "",
      gender: "",
      province: ""
    });
  };

  const filteredPets = pets.filter((pet) => {
    const petAge = Number(pet.age);

    if (filters.type && pet.type !== filters.type) return false;

    if (filters.age) {
      if (filters.age === "<1" && petAge >= 1) return false;
      if (filters.age === ">15" && petAge <= 15) return false;
      if (
        filters.age !== "<1" &&
        filters.age !== ">15" &&
        petAge !== Number(filters.age)
      )
        return false;
    }

    if (filters.size && pet.size !== filters.size) return false;
    if (filters.gender && pet.gender !== filters.gender) return false;
    if (
      filters.province &&
      pet.province.toLowerCase() !== filters.province.toLowerCase()
    )
      return false;

    return true;
  });

  const openRegisterForm = () => setShowRegisterForm(true);
  const closeRegisterForm = () => setShowRegisterForm(false);

  return (
    <>
    <div className="petlist-full">
        <nav className={`petlist-navbar ${menuOpen ? "expanded" : ""}`}>
          <div className="navbar-top">
            <h1 className="logo">
              <span className="logo-text">Find A Pet</span> <span className="logo-icon">🐾</span>
            </h1>
            <div className="navbar-right">
              {user ? (
                <>
                  <span className="navbar-hello">
                    Hello, <strong>{user.username || user.email}</strong>
                  </span>
                  {user && (
                    <ChatPanel />
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
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
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <div className="intro-text">
            <h1 className="main-title">Find Your Perfect Companion</h1>
            <h2 className="subtitle">
              Start the journey to meet your new best friend today
            </h2>
          </div>

          <section className="filter-section">
            <form className="filter-form" onSubmit={(e) => e.preventDefault()}>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Animals</option>
                <option value="Perro">Dog</option>
                <option value="Gato">Cat</option>
                <option value="Pájaro">Bird</option>
                <option value="Conejo">Rabbit</option>
                <option value="Hurón">Ferret</option>
              </select>

              <select name="age" value={filters.age} onChange={handleFilterChange}>
                <option value="">All Ages</option>
                <option value="<1">Less than 1 year</option>
                {[...Array(15)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} years
                  </option>
                ))}
                <option value=">15">More than 15 years</option>
              </select>

              <select name="size" value={filters.size} onChange={handleFilterChange}>
                <option value="">All Sizes</option>
                <option value="Toy">Toy</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Big">Big</option>
              </select>

              <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input
                type="text"
                name="province"
                placeholder="Province"
                value={filters.province}
                onChange={handleFilterChange}
              />

              <button type="button" onClick={clearFilters}>
                Clear Filters
              </button>
            </form>
          </section>

          {user?.role === "give_for_adoption" && (
            <div className="register-button-container">
              <button className="register-button" onClick={openRegisterForm}>
                Register New Pet
              </button>
            </div>
          )}

          {showRegisterForm && (
            <div className="modal-overlay">
              <div className="modal-content register-section pet-list-container">
                <button className="modal-close-btn" onClick={closeRegisterForm}>
                  &times;
                </button>
                <h2>Register a New Pet</h2>
                <form className="pet-form" onSubmit={handleSubmit}>
                  <input
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="age"
                    type="number"
                    step="any" 
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                    required
                  />
                  <select name="size" value={form.size} onChange={handleChange} required>
                    <option value="">Select Size</option>
                    <option value="Toy">Toy</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Big">Big</option>
                  </select>
                  <select name="type" value={form.type} onChange={handleChange} required>
                    <option value="">Select Animal Type</option>
                    <option value="Perro">Dog</option>
                    <option value="Gato">Cat</option>
                    <option value="Pájaro">Bird</option>
                    <option value="Conejo">Rabbit</option>
                    <option value="Hurón">Ferret</option>
                  </select>
                  <input
                    name="breed"
                    placeholder="Breed"
                    value={form.breed}
                    onChange={handleChange}
                  />
                  <input
                    name="birthday"
                    type="date"
                    value={form.birthday}
                    onChange={handleChange}
                  />
                  <select name="gender" value={form.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input
                    name="province"
                    placeholder="Province"
                    value={form.province}
                    onChange={handleChange}
                  />
                  <input type="file" name="photo" accept="image/*" onChange={handleChange} />
                  <button type="submit">Add Pet</button>
                </form>
              </div>
            </div>
          )}

          <section className="pet-list-section">
            <h3>Pet List</h3>
            {filteredPets.length === 0 ? (
              <p>No pets found matching the filters.</p>
            ) : (
              <ul className="pet-list-grid">
                {filteredPets.map((pet) => (
                  <li key={pet._id} className="pet-card">
                    {pet.photo && (
                      <img
                        src={`http://localhost:4000${pet.photo}`}
                        alt={pet.name}
                        className="pet-photo-large"
                      />
                    )}
                    <div className="pet-details">
                      <div className="pet-name-gender">
                        <strong className="pet-name">{pet.name}</strong>
                        {pet.gender === "Male" ? (
                          <img src="/assets/male.png" alt="Male" className="gender-icon" />
                        ) : pet.gender === "Female" ? (
                          <img
                            src="/assets/female.png"
                            alt="Female"
                            className="gender-icon"
                          />
                        ) : null}
                      </div>
                      <div className="pet-info-age-size">
                        {pet.age < 1
                          ? `${Math.round(pet.age * 12)} months old`
                          : `${pet.age === 1 ? "1 year" : `${pet.age} years`} old`}
                        , {pet.size}
                      </div>
                      <Link to={`/pet/${pet._id}`} className="adopt-button">
                        Adopt me
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
        <section className="adoption-section-list">
            <div className="adoption-content">
              <div className="adoption-number">{successfulAdoptions}</div>
              <p className="adoption-subtext">Animals who found their forever homes.</p>
              <h2 className="adoption-highlight">Every adoption is a new beginning filled with hope.</h2>
            </div>
          </section>
        <Footer />
      </div>
    </>
  );
}
