import React from "react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa6";
import "../styles/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-heading">Follow us on social media for more updates!</p>
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="social-icon" /> Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="social-icon" /> Instagram
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
            <FaTiktok className="social-icon" /> TikTok
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        © {currentYear} Find A Pet. All rights reserved.
      </div>
    </footer>
  );
}
