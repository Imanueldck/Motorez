import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../styles/footer.css";
import logo from "../image/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img
            src={logo}
            alt="Logo BengkelFinder"
            className="footer-logo-img"
          />

          <p>Membantu Anda menemukan bengkel terbaik di dekat anda.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/caribengkel">Temukan Bengkel</a>
            </li>
            <li>
              <a href="/kemitraan">Kemitraan Bengkel</a>
            </li>
            <li>
              <a href="/kontak">Hubungi Kami</a>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>
            <FaMapMarkerAlt /> Jl. Pahlawan No. 123, Semarang
          </p>
          <p>
            <FaPhoneAlt /> +62 123 456 789
          </p>
          <p>
            <FaEnvelope /> motorez@gmail.com
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
