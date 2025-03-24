import { FaTools, FaClock, FaThumbsUp, FaUserShield } from "react-icons/fa";
import "../../styles/whychoose.css";

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      <div className="container">
        <h2 className="section-title">Why Choose Us?</h2>
        <p className="section-subtitle">Keunggulan Kami untuk Anda</p>
        <div className="features-grid">
          <div className="feature-card">
            <FaTools className="feature-icon" />
            <h3>Professional Service</h3>
            <p>Layanan bengkel terpercaya dengan teknisi berpengalaman.</p>
          </div>
          <div className="feature-card">
            <FaClock className="feature-icon" />
            <h3>Quick & Efficient</h3>
            <p>Proses cepat tanpa mengorbankan kualitas hasil kerja.</p>
          </div>
          <div className="feature-card">
            <FaThumbsUp className="feature-icon" />
            <h3>High Customer Satisfaction</h3>
            <p>Kami mengutamakan kepuasan pelanggan dengan layanan terbaik.</p>
          </div>
          <div className="feature-card">
            <FaUserShield className="feature-icon" />
            <h3>Trusted & Secure</h3>
            <p>Keamanan kendaraan Anda adalah prioritas utama kami.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
