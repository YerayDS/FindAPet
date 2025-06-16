import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer"; 
import "../styles/Home.css";
import ChatPanel from "../components/ChatPanel";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [pets, setPets] = useState([]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/pets`)
      .then((res) => res.json())
      .then((data) => setPets(data))
      .catch((err) => console.error("Error fetching pets:", err));
  }, []);

  const randomPet = pets.length > 0
    ? pets[Math.floor(Math.random() * pets.length)]
    : null;

  const petDescriptions = [
    (name, gender) => `${name} is a very affectionate and charming ${gender === "Male" ? "boy" : "girl"} who's full of joy and ready to meet you.`,
    (name, gender) => `${name} needs a loving home where they can give and receive endless love.`,
    (name, gender) => `Looking for a new best friend? ${name} is a wonderful ${gender === "Male" ? "boy" : "girl"} who will fill your days with happiness.`,
    (name, gender) => `This lovely ${gender === "Male" ? "boy" : "girl"}, ${name}, is eager to find a caring family to call their own.`,
  ];

  let description = "";
  if (randomPet) {
    const randomIndex = Math.floor(Math.random() * petDescriptions.length);
    description = petDescriptions[randomIndex](randomPet.name, randomPet.gender);
  }

  const benefits = [
    {
      title: "Benefits for the Animal",
      points: [
        "Providing a loving and safe home",
        "Access to proper nutrition and care",
        "Chance to experience companionship and play",
        "Improved physical and mental wellbeing",
      ],
    },
    {
      title: "Benefits for Yourself",
      points: [
        "Gain a loyal and loving companion",
        "Improve your emotional wellbeing",
        "Encourage responsibility and routine",
        "Enjoy unconditional love and joy",
      ],
    },
    {
      title: "Social and Environmental Impact",
      points: [
        "Reduce pet overpopulation",
        "Support animal shelters and rescues",
        "Promote sustainable pet ownership",
        "Strengthen compassionate communities",
      ],
    },
  ];

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      {
        threshold: 0.3, 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      <nav className={`navbar ${menuOpen ? "expanded" : ""}`}>
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
                {user && <ChatPanel />}
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
          <Link to="/pets" onClick={() => setMenuOpen(false)}>Pet List</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </div>
      </nav>

      <section className="adoption-section">
        <p className="adoption-quote-line">Adopt a pet, Save a life</p>
        <img
          src="/assets/adoptdog.jpg"
          alt="Pet adoption"
          className="adoption-image"
        />
        <p className="adoption-stats emphasized">
          Approximately <strong>75.000</strong> animals are abandoned every day.
        </p>
      </section>

      <section
        ref={sectionRef}
        className={`featured-pet-section ${isVisible ? "visible" : ""}`}
      >
        {randomPet ? (
          <div className="featured-pet-wrapper">
            <div className="pet-cardh">
              {randomPet.photo && (
                <img
                  src={`${import.meta.env.VITE_API_URL}${randomPet.photo}`}
                  alt={randomPet.name}
                  className="pet-photo-largeh"
                />
              )}
              <div className="pet-detailsh">
                <div className="pet-name-gender">
                  <strong className="pet-name">{randomPet.name}</strong>
                  {randomPet.gender === "Male" ? (
                    <img src="/assets/male.png" alt="Male" className="gender-icon" />
                  ) : randomPet.gender === "Female" ? (
                    <img src="/assets/female.png" alt="Female" className="gender-icon" />
                  ) : null}
                </div>
                <div className="pet-info-age-size">
                   {randomPet.age < 1
                    ? `${Math.round(randomPet.age * 12)} months old`
                    : `${randomPet.age === 1 ? "1 year" : `${randomPet.age} years`} old`}
                  , {randomPet.size}
                </div>
              </div>
            </div>

            <div className="featured-pet-text">
              <h2>This Pet Deserves a Loving Home</h2>
              <p>
                Every animal deserves a family to love and be loved by. Your home could be the safe, warm place this sweet soul has been waiting for.
              </p>
              <p>{description}</p>
            </div>
          </div>
        ) : (
          <p>Loading pet...</p>
        )}
      </section>
      
      <div className="why-adopt-background">
        <section className="why-adopt-section">
        <h1 className="why-adopt-title">Why Adopt?</h1>
        <p className="why-adopt-subtitle">Save a life. Gain a friend.</p>

        <div className="why-adopt-grid">
          {benefits.map(({ title, points }) => (
            <div key={title} className="why-adopt-column">
              <h3 className="why-adopt-column-title">{title}</h3>
              <ul className="why-adopt-points">
                {points.map((point, index) => (
                  <li key={index} className="why-adopt-point">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      </div>
      <section className="embajadores">
        <h2 className="embajadores__title">Meet Our Rescuers</h2>
        <div className="embajadores__grid">

          <div className="embajadores__item">
            <div className="embajadores__item-foto-container">
              <img
                className="embajadores__item-foto"
                src="/assets/rescuer1.jpg"
              />
            </div>
            <div className="embajadores__item-info">
              <h3 className="embajadores__item-info-name">Emma Santoro</h3>
              <p className="embajadores__item-info-description">
                Emma cares for older dogs, giving them love and comfort in their final years. She believes every dog deserves a peaceful home, no matter their age.
              </p>
            </div>
          </div>

          <div className="embajadores__item">
            <div className="embajadores__item-foto-container">
              <img
                className="embajadores__item-foto"
                src="/assets/rescuer2.avif"
              />
            </div>
            <div className="embajadores__item-info">
              <h3 className="embajadores__item-info-name">Carlos Rivera</h3>
              <p className="embajadores__item-info-description">
                Carlos rescues strays from the streets with patience and care. He’s known for gaining the trust of scared animals and helping them feel safe.
              </p>
            </div>
          </div>

          <div className="embajadores__item">
            <div className="embajadores__item-foto-container">
              <img
                className="embajadores__item-foto"
                src="/assets/rescuer3.jpg"
              />
            </div>
            <div className="embajadores__item-info">
              <h3 className="embajadores__item-info-name">Sofia Torres</h3>
              <p className="embajadores__item-info-description">
                Sofia fosters animals in recovery, offering medical support and a calm home where they can heal and grow stronger.
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
