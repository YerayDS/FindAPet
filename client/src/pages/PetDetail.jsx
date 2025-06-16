import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaArrowLeft, FaTrash, FaHeart} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import "../styles/PetDetail.css";
import { FaWrench } from "react-icons/fa";
import { useAdoption } from "../context/AdoptionContext";
import { MessageCircle } from "lucide-react"; 
import ChatPanel from "../components/ChatPanel";







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
  const { successfulAdoptions, incrementAdoptions } = useAdoption();
  const [chatOpen, setChatOpen] = useState(false);
  const [chat, setChat] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;




  console.log("Successful adoptions:", successfulAdoptions);


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

  const toggleChat = () => setChatOpen(prev => !prev);


  useEffect(() => {
    fetch(`${API_URL}/api/pets/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Pet not found");
        return res.json();
      })
      .then((data) => {
        setPet(data);
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

  const handleGeneralInfoChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleHealthChange = (e) => {
    const { name, checked } = e.target;
    setHealthStatus((prev) => ({ ...prev, [name]: checked }));
  };

  const [editedPet, setEditedPet] = useState({}); 

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

      const response = await fetch(`${API_URL}/api/pets/${id}`, {
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
      setIsEditing(false);  
    } catch (error) {
      alert(`Failed to update pet info: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pets/${pet._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Error details:", data);
        throw new Error("Failed to delete pet");
      }

      navigate("/pets");
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("An error occurred while deleting the pet.");
    }
  };


  const handleAdopt = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pets/${pet._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        console.error("Error details:", data);
        throw new Error("Failed to delete pet");
      }

      incrementAdoptions();

      navigate("/pets");
    } catch (error) {
      console.error("Error adopting pet:", error);
      alert("An error occurred while processing the adoption.");
    }
  };

  const handleStartChat = async () => {
    if (chatOpen) {
      setChatOpen(false);
      setSelectedChat(null);
      return;
    }

    if (!token || !pet?.owner) return;

    try {
      const response = await fetch(`${API_URL}/api/chats/get-or-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otherUserId: pet.owner }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No se pudo crear el chat");
      }

      const chatData = await response.json();

      console.log("Chat creado o recuperado:", chatData);
      setSelectedChat(chatData);
      setChatOpen(true);
    } catch (error) {
      console.error("Error iniciando chat:", error);
      alert("Hubo un problema al iniciar el chat.");
    }
  };


  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <>
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

                {user && (
                  <ChatPanel />
                )}

                <button
                  onClick={() => {
                    setChatOpen(false); 
                    setChat(null);      
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
        {chatOpen && !selectedChat && (
          <div>
            <p>You don't have any open chat.</p>
            <button onClick={() => setChatOpen(false)}>Close chat</button>
          </div>
        )}

         
      </nav>

      <div className="pet-detail-container" style={{ position: "relative" }}>
        <div className="top-right-buttons">
          {canEdit && !isEditing && pet.owner === user.id && (
            <button
              className="heart-button-icon"
              onClick={handleAdopt}
              aria-label="Adopt pet"
              type="button"
            >
              <FaHeart size={20} />
            </button>
          )}

          {canEdit && !isEditing && pet.owner === user.id && (
            <button
              className="delete-button"
              onClick={handleDelete}
              aria-label="Delete pet"
              type="button"
            >
              <FaTrash size={20} />
            </button>
          )}

          {canEdit && !isEditing && pet.owner === user.id && (
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
          src={`${API_URL}${pet.photo}`}
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
                    <p>
                      Age: {
                        pet.age < 1 
                          ? `${Math.round(pet.age * 12)} months` 
                          : `${pet.age} years`
                      }
                    </p>
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

          

          {user?.role === "adopt" && pet.owner !== user.id && (
            <div className="chat-panel-wrapper">
              <ChatPanel isInPetDetail={true} targetUserId={pet.owner} />
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
}
