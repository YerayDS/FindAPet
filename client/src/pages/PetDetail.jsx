import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import "../styles/PetDetail.css";
import { FaWrench } from "react-icons/fa";


export default function PetDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para campos editables
  const [generalInfo, setGeneralInfo] = useState({
    age: "",
    size: "",
    gender: "",
    breed: "",
    province: "",
  });

  const [healthStatus, setHealthStatus] = useState({
    vaccinated: false,
    microchip: false,
    dewormed: false,
    healthy: false,
  });

  const [aboutMe, setAboutMe] = useState("");

  const canEdit = user?.role === "give_for_adoption";

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    fetch(`http://localhost:4000/api/pets/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Pet not found");
        return res.json();
      })
      .then((data) => {
        setPet(data);
        // Inicializamos estados editables con los datos recibidos
        setGeneralInfo({
          age: data.age || "",
          size: data.size || "",
          gender: data.gender || "",
          breed: data.breed || "",
          province: data.province || "",
        });
        setHealthStatus({
          vaccinated: data.vaccinated || false,
          microchip: data.microchip || false,
          dewormed: data.dewormed || false,
          healthy: data.healthy || false,
        });
        setAboutMe(data.about || "");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Función para manejar cambios en generalInfo
  const handleGeneralInfoChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Función para manejar cambios en healthStatus (checkboxes)
  const handleHealthChange = (e) => {
    const { name, checked } = e.target;
    setHealthStatus((prev) => ({ ...prev, [name]: checked }));
  };

  // Función para guardar cambios en backend
  const [editedPet, setEditedPet] = useState({}); // Para guardar los cambios del formulario

  const handleSave = async () => {
    try {
      const editedPet = {
        ...generalInfo,
        vaccinated: !!healthStatus.vaccinated,
        microchip: !!healthStatus.microchip,
        dewormed: !!healthStatus.dewormed,
        healthy: !!healthStatus.healthy,
        about: aboutMe,
      };
      console.log("Token:", user.token);

      const response = await fetch(`http://localhost:4000/api/pets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedPet),
      });

      if (!response.ok) {
        let errorMessage = "Unknown error";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const text = await response.text();
          errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      const updatedPet = await response.json();
      setPet(updatedPet);
      setIsEditing(false);  // cerrar modo edición al guardar
      alert("Pet info updated successfully!");
    } catch (error) {
      alert(`Failed to update pet info: ${error.message}`);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <>
      {/* NAVBAR */}
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
          <Link to="/pets" onClick={() => setMenuOpen(false)}>
            Pet List
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
        </div>
      </nav>

      <div className="pet-detail-container" style={{ position: "relative" }}>
        <div className="top-right-buttons">
          {canEdit && !isEditing && (
            <button
              className="edit-button-icon"
              onClick={() => setIsEditing(true)}
              aria-label="Edit pet info"
              type="button"
            >
              <FaWrench size={20} />
            </button>
          )}

          <button
            className="back-button"
            onClick={() => navigate("/pets")}
            type="button"
            aria-label="Go back to pet list"
          >
            <FaArrowLeft size={24} />
          </button>
        </div>

        <img
          src={`http://localhost:4000${pet.photo}`}
          alt={pet.name}
          className="pet-photo"
        />
        <div className="pet-info">
          <h2 className="pet-name">{pet.name}</h2>

          <div className="info-columns">
            <div className="pet-detail">
              <h3 className="info-title">General Information</h3>
              <div className="info-detail">
                {canEdit && isEditing ? (
                  <>
                    <label>
                      Age:{" "}
                      <input
                        type="number"
                        name="age"
                        value={generalInfo.age}
                        onChange={handleGeneralInfoChange}
                      />
                    </label>
                    <label>
                      Size:{" "}
                      <input
                        type="text"
                        name="size"
                        value={generalInfo.size}
                        onChange={handleGeneralInfoChange}
                      />
                    </label>
                    <label>
                      Gender:{" "}
                      <input
                        type="text"
                        name="gender"
                        value={generalInfo.gender}
                        onChange={handleGeneralInfoChange}
                      />
                    </label>
                    <label>
                      Breed:{" "}
                      <input
                        type="text"
                        name="breed"
                        value={generalInfo.breed}
                        onChange={handleGeneralInfoChange}
                      />
                    </label>
                    <label>
                      Province:{" "}
                      <input
                        type="text"
                        name="province"
                        value={generalInfo.province}
                        onChange={handleGeneralInfoChange}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <p>Age: {pet.age} years</p>
                    <p>Size: {pet.size}</p>
                    <p>Gender: {pet.gender}</p>
                    <p>Breed: {pet.breed}</p>
                    <p>Province: {pet.province}</p>
                  </>
                )}
              </div>
            </div>

            <div className="health-status">
              <h3 className="info-title">Health Status</h3>
              <div className="info-detail">
                {canEdit && isEditing ? (
                  <>
                    <label>
                      Vaccinated:{" "}
                      <select
                        name="vaccinated"
                        value={healthStatus.vaccinated ? "Yes" : "No"}
                        onChange={(e) =>
                          setHealthStatus((prev) => ({
                            ...prev,
                            vaccinated: e.target.value === "Yes",
                          }))
                        }
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </label>
                    <label>
                      Microchipped:{" "}
                      <select
                        name="microchip"
                        value={healthStatus.microchip ? "Yes" : "No"}
                        onChange={(e) =>
                          setHealthStatus((prev) => ({
                            ...prev,
                            microchip: e.target.value === "Yes",
                          }))
                        }
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </label>
                    <label>
                      Dewormed:{" "}
                      <select
                        name="dewormed"
                        value={healthStatus.dewormed ? "Yes" : "No"}
                        onChange={(e) =>
                          setHealthStatus((prev) => ({
                            ...prev,
                            dewormed: e.target.value === "Yes",
                          }))
                        }
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </label>
                    <label>
                      Healthy:{" "}
                      <select
                        name="healthy"
                        value={healthStatus.healthy ? "Yes" : "No"}
                        onChange={(e) =>
                          setHealthStatus((prev) => ({
                            ...prev,
                            healthy: e.target.value === "Yes",
                          }))
                        }
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </label>
                  </>
                ) : (
                  <>
                    <p>Vaccinated: {pet.vaccinated ? "Yes" : "No"}</p>
                    <p>Microchipped: {pet.microchip ? "Yes" : "No"}</p>
                    <p>Dewormed: {pet.dewormed ? "Yes" : "No"}</p>
                    <p>Healthy: {pet.healthy ? "Yes" : "No"}</p>
                  </>
                )}
              </div>

              {/* Botones Save / Cancel justo aquí */}
              {canEdit && isEditing && (
                <div className="action-buttons" style={{ marginTop: "1rem" }}>
                  <button className="save-button" onClick={handleSave}>
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => {
                      setGeneralInfo({
                        age: pet.age || "",
                        size: pet.size || "",
                        gender: pet.gender || "",
                        breed: pet.breed || "",
                        province: pet.province || "",
                      });
                      setHealthStatus({
                        vaccinated: pet.vaccinated || false,
                        microchip: pet.microchip || false,
                        dewormed: pet.dewormed || false,
                        healthy: pet.healthy || false,
                      });
                      setAboutMe(pet.about || "");
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="about-me-section">
            <h3 className="info-title">About Me</h3>
            {canEdit && isEditing ? (
              <textarea
                className="about-me-text"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            ) : (
              <textarea
                className="about-me-text readonly"
                value={pet.about || "No information available about me."}
                readOnly
              />
            )}
          </div>

          

          <button className="chat-button">Chat</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
