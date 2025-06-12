import React, { useEffect, useRef, useState, useContext } from "react";
import '../styles/About.css';
import emailjs from '@emailjs/browser'; 
import ChatPanel from "../components/ChatPanel";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer"; 



export default function About() {
  const bottomTextRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 } 
    );

    if (bottomTextRef.current) {
      observer.observe(bottomTextRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all fields.");
      return;
    }

    setSending(true);

    emailjs.send(
      'service_hvtxrls',  
      'template_tqp5l9d',
      {
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'findapet12@gmail.com',
      },
      'jCBokUUmgVzXlmPSG'   
    )
    .then(() => {
      setSending(false);
      setSendSuccess(true);
      setFormData({ email: '', subject: '', message: '' });
    })
    .catch(() => {
      setSending(false);
      setSendSuccess(false);
    });
  };

  const contactRef = useRef(null);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setContactVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (contactRef.current) {
      observer.observe(contactRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const faqRef = useRef(null);
  const [faqVisible, setFaqVisible] = useState(false);

  useEffect(() => {
    const observerFaq = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFaqVisible(true);
          observerFaq.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (faqRef.current) {
      observerFaq.observe(faqRef.current);
    }

    return () => observerFaq.disconnect();
  }, []);

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How does the adoption process work on this platform?",
      answer:
        "Once you find a pet you're interested in, you can contact the responsible association directly. They will guide you through the process, which may include an interview, a questionnaire, and in some cases, a home visit.",
    },
    {
      question: "What are the requirements to adopt a pet?",
      answer:
        "Each association has its own criteria, but in general, you must be of legal age, demonstrate financial stability, and provide a safe and suitable environment for the pet.",
    },
    {
      question: "How much does it cost to adopt a pet?",
      answer:
        "Most associations ask for a donation or adoption fee to cover vaccinations, sterilization, and other veterinary care. The amount varies depending on the animal and the association.",
    },
    {
      question: "Can I adopt if I live in a small apartment or a rented home?",
      answer:
        "Yes, as long as you can offer a suitable environment. It's important to have the landlord’s permission if you're renting, and the space should be appropriate for the type of animal.",
    },
    {
      question: "Can I adopt a puppy or a kitten?",
      answer:
        "Yes, although puppies and kittens tend to be in high demand. Some associations prefer to give them to families with previous experience or enough time to care for and train them properly.",
    },
    {
      question: "Can I adopt more than one pet at a time?",
      answer:
        "It depends on the association and your personal situation. In some cases, adopting animals together is recommended if they already share a bond.",
    },
    {
      question: "Does the association do follow-ups after adoption?",
      answer:
        "Yes. Many associations carry out post-adoption follow-ups to make sure everything is going well and to offer support if needed.",
    },
    {
      question: "What happens if I can no longer care for the animal?",
      answer:
        "You should contact the association. Typically, they will help manage the animal’s rehoming or guide you on the steps to take.",
    },
    {
      question: "What kind of support will I receive after adopting?",
      answer:
        "Associations usually offer advice, basic veterinary guidance, and in some cases, support with training and behavioral issues.",
    },
  ];

  

  return (
    <>
    <div className="about-full">
      <nav className={`navbar ${menuOpen ? "expanded" : ""}`}>
          <div className="navbar-top">
            <h1 className="logo">Pawfect Match 🐾</h1>
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
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/pets" onClick={() => setMenuOpen(false)}>
              Pet List
            </Link>
          </div>
        </nav>

      <div className="about-page">
        <section className="about-section">
          <div className="about-top">
            <img 
              src="/assets/aboutdog.webp" 
              className="about-image"
            />
            <div className="about-top-text">
              <h1>About FindAPet</h1>
              <p>
                At FindAPet, our mission is simple: to connect loving animals in need of a home with families ready to welcome them with open arms. We believe every animal deserves to feel safe, loved, and part of a family.
              </p>
              <p>
                In Spain, it is estimated that around <strong>286,000 dogs and cats</strong> are abandoned every year. This heartbreaking number keeps Spain at the top of the list for pet abandonment in Europe.
              </p>
            </div>
          </div>
          
          <div 
            className={`about-bottom-text ${isVisible ? "visible" : ""}`} 
            ref={bottomTextRef}
          >
            
          <p>
            From the beginning, our vision was to be a bridge between animal shelters and families ready to adopt. We’re proud to say we succeeded—shelters and families alike have welcomed us warmly.
          </p>
          <p>
            Today, FindAPet is a growing community of hope, compassion, and second chances. Through technology and love, we make adoption a beautiful experience for pets and people alike.
          </p>
          </div>
        </section>

        <section
            className={`contact-section ${contactVisible ? "visible" : ""}`}
            ref={contactRef}
          >
          <div className="contact-container">
            <h2>Contact Us</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>
                Your Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Subject:
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Subject"
                />
              </label>
              <label>
                Message:
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message here..."
                />
              </label>
              <button type="submit" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            {sendSuccess === true && (
              <p className="success-msg">Message sent successfully!</p>
            )}
            {sendSuccess === false && (
              <p className="error-msg">Failed to send message. Please try again.</p>
            )}
          </div>
        </section>

        <section
          className={`faq-section ${faqVisible ? "visible" : ""}`}
          ref={faqRef}
        >
          <h2>FAQ</h2>
          <div className="faq-container">
            <div className="faq-list">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => handleToggle(index)}
                >
                  <div className="faq-question">{item.question}</div>
                  {activeIndex === index && (
                    <div className="faq-answer">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
    </>
  );
}
