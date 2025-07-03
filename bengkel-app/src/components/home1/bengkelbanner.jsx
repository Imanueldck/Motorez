import React from "react";
import "../../styles/bengkelBanner.css";

const BengkelBanner = () => {
  return (
    <div className="bengkel-banner">
      <div className="bengkel-overlay" />
      <div className="bengkel-content">
        <h1>
          Temukan <span className="highlight">Bengkel Terdekat</span> dengan
          Cepat & Mudah!
        </h1>
      </div>
    </div>
  );
};

export default BengkelBanner;
