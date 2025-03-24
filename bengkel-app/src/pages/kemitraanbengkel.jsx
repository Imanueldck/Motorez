import React from "react";
import { Link } from "react-router-dom";
import "../styles/kemitraan.css";

const KemitraanBengkel = () => {
  return (
    <div className="kemitraan-page">
      <section className="kemitraan-hero">
        <div className="hero-content">
          <h1>Bergabung Bersama Motorez</h1>
          <p>Tingkatkan visibilitas dan jangkauan pelanggan bengkel Anda dengan layanan online kami.</p>
          <button className="btn-cta">
            <Link to="/register/pemilik" style={{ textDecoration: "none", color: "white" }}>
              Daftar Sekarang
            </Link>
          </button>
        </div>
      </section>

      <section className="kemitraan-benefits">
        <h2>Keuntungan Bergabung</h2>
        <div className="keuntungan-cards">
          <div className="kemitraan-card">
            <h3>Jangkauan Luas</h3>
            <p>Perluas jangkauan bengkel Anda ke pelanggan baru di seluruh kota Semarang.</p>
          </div>
          <div className="kemitraan-card">
            <h3>Promosi Gratis</h3>
            <p>Dapatkan promosi gratis di website kami untuk meningkatkan visibilitas.</p>
          </div>
          <div className="kemitraan-card">
            <h3>Pemesanan Online</h3>
            <p>Mempermudah pelanggan dalam melakukan reservasi layanan bengkel Anda secara online.</p>
          </div>
          <div className="kemitraan-card">
            <h3>Dukungan Teknis</h3>
            <p>Kami menyediakan dukungan teknis penuh untuk kenyamanan bisnis Anda.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Siap Menjadi Mitra Kami?</h2>
          <p>Bergabunglah sekarang dan nikmati berbagai manfaat bagi bisnis bengkel Anda.</p>
          <button className="btn-cta">Gabung Sekarang</button>
        </div>
      </section>
    </div>
  );
};

export default KemitraanBengkel;
