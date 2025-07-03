// ContactUsNoForm.jsx

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "../styles/kontak.css";

export default function Kontak() {
  return (
    <div className="kontak-container">
      {/* Hero */}
      <div className="kontak-hero">
        <h1 className="kontak-title">Hubungi Kami</h1>
        <p className="kontak-subtitle">
          Kami siap melayani Anda dengan sepenuh hati. Temukan informasi kontak
          kami di bawah ini.
        </p>
      </div>

      {/* Info Kontak */}
      <div className="kontak-info">
        <div className="kontak-grid">
          <div className="kontak-card">
            <FaMapMarkerAlt className="kontak-icon" />
            <h3 className="kontak-heading">Alamat</h3>
            <p className="kontak-text">Jl. Teknologi No. 88, Jakarta</p>
          </div>
          <div className="kontak-card">
            <FaPhoneAlt className="kontak-icon" />
            <h3 className="kontak-heading">Telepon</h3>
            <p className="kontak-text">+62 812 3456 7890</p>
          </div>
          <div className="kontak-card">
            <FaEnvelope className="kontak-icon" />
            <h3 className="kontak-heading">Email</h3>
            <p className="kontak-text">support@bengkelkita.com</p>
          </div>
        </div>
      </div>

      {/* Sosial Media */}
      <div className="kontak-sosmed">
        <h2 className="sosmed-title">Ikuti Kami di Sosial Media</h2>
        <div className="sosmed-icons">
          <a href="#">
            <FaFacebookF />
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
  );
}
