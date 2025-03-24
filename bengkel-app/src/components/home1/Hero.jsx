import React from "react";
import heroImage from "../../assets/hero.jpg";
import "../../styles/Hero.css";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Temukan Bengkel Motor Dekat Lokasimu</h1>
        <p className="hero-subtitle">
          Motorez menyediakan <a href="#bengkel-list">100+ pilihan bengkel</a> untuk memperbaiki kendaraanmu.
        </p>
        <button className="hero-button">Cari bengkel terdekat</button>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Hero" />
      </div>
    </div>
  );
};

export default HeroSection;
