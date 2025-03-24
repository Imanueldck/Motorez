import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>BengkelFinder</h2>
          <p>Membantu Anda menemukan bengkel terbaik di Kota Semarang.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>
            <FaMapMarkerAlt /> Jl. Pahlawan No. 123, Semarang
          </p>
          <p>
            <FaPhoneAlt /> +62 812 3456 7890
          </p>
          <p>
            <FaEnvelope /> info@bengkelfinder.com
          </p>
        </div>

        <div className="footer-socials">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BengkelFinder. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
