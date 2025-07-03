import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/kemitraan.css";
import ilustrasion from "../assets/rockers-rafiki.png";
import {
  FaMapMarkedAlt,
  FaBullhorn,
  FaCalendarCheck,
  FaTools,
} from "react-icons/fa";

const KemitraanBengkel = () => {
  useEffect(() => {
    const accordions = document.querySelectorAll(".accordion-title");
    accordions.forEach((btn) => {
      const icon = btn.querySelector(".accordion-icon");
      btn.nextElementSibling.style.display = "none";
      icon.textContent = "+";
    });
  }, []);

  const toggleAccordion = (e) => {
    const button = e.currentTarget;
    const content = button.nextElementSibling;
    const icon = button.querySelector(".accordion-icon");

    const isOpen = content.style.display === "block";

    document.querySelectorAll(".accordion-content").forEach((c) => {
      c.style.display = "none";
    });

    document.querySelectorAll(".accordion-icon").forEach((i) => {
      i.textContent = "+";
    });

    if (!isOpen) {
      content.style.display = "block";
      icon.textContent = "-";
    }
  };

  return (
    <div className="kemitraan-page">
      <section className="kemitraan-hero-v2">
        <div className="hero-inner">
          <div className="text-left">
            <h1>
              Bergabung Bersama <span className="highlight">Motorez</span>
            </h1>
            <p>
              Tingkatkan visibilitas dan jangkauan pelanggan bengkel Anda dengan
              layanan online kami.
            </p>
            <Link to="/register/pemilik" className="btn-modern">
              Daftar Sekarang
            </Link>
          </div>
          <div className="hero-image">
            <img src={ilustrasion} alt="Garage Illustration" />
          </div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 320">
          <path
            fill="#f5f5f5"
            fillOpacity="1"
            d="M0,160L60,160C120,160,240,160,360,170.7C480,181,600,203,720,202.7C840,203,960,181,1080,154.7C1200,128,1320,96,1380,80L1440,64V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
          ></path>
        </svg>
      </section>

      <section className="kemitraan-benefits">
        <h2>Keuntungan Bergabung</h2>
        <div className="keuntungan-cards">
          <div className="kemitraan-card">
            <div className="icon-circle">
              <FaMapMarkedAlt />
            </div>
            <h3>Jangkauan Luas</h3>
            <p>
              Perluas jangkauan bengkel Anda ke pelanggan baru di seluruh kota
              Semarang.
            </p>
          </div>
          <div className="kemitraan-card">
            <div className="icon-circle">
              <FaBullhorn />
            </div>
            <h3>Promosi Gratis</h3>
            <p>
              Dapatkan promosi gratis di website kami untuk meningkatkan
              visibilitas.
            </p>
          </div>
          <div className="kemitraan-card">
            <div className="icon-circle">
              <FaCalendarCheck />
            </div>
            <h3>Pemesanan Online</h3>
            <p>
              Mempermudah pelanggan dalam melakukan reservasi layanan bengkel
              Anda secara online.
            </p>
          </div>
          <div className="kemitraan-card">
            <div className="icon-circle">
              <FaTools />
            </div>
            <h3>Dukungan Teknis</h3>
            <p>
              Kami menyediakan dukungan teknis penuh untuk kenyamanan bisnis
              Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="kemitraan-faq">
        <h2>Pertanyaan yang Sering Diajukan</h2>
        <div className="accordion-faq">
          <div className="accordion-item">
            <button className="accordion-title" onClick={toggleAccordion}>
              Apa syarat untuk bergabung sebagai mitra Motorez?
              <span className="accordion-icon">+</span>
            </button>
            <div className="accordion-content">
              <p>
                Anda hanya perlu memiliki bengkel yang beroperasi aktif dan
                informasi layanan yang jelas.
              </p>
            </div>
          </div>

          <div className="accordion-item">
            <button className="accordion-title" onClick={toggleAccordion}>
              Apakah ada biaya untuk menjadi mitra?
              <span className="accordion-icon">+</span>
            </button>
            <div className="accordion-content">
              <p>
                Tidak. Pendaftaran sebagai mitra di Motorez saat ini gratis.
              </p>
            </div>
          </div>

          <div className="accordion-item">
            <button className="accordion-title" onClick={toggleAccordion}>
              Bagaimana cara menerima pemesanan dari pelanggan?
              <span className="accordion-icon">+</span>
            </button>
            <div className="accordion-content">
              <p>
                Anda akan mendapatkan akses ke dashboard untuk melihat dan
                mengelola pemesanan yang masuk.
              </p>
            </div>
          </div>

          <div className="accordion-item">
            <button className="accordion-title" onClick={toggleAccordion}>
              Apakah saya bisa mengubah informasi bengkel saya?
              <span className="accordion-icon">+</span>
            </button>
            <div className="accordion-content">
              <p>
                Tentu saja. Anda bisa memperbarui informasi bengkel melalui
                dashboard pemilik.
              </p>
            </div>
          </div>

          <div className="accordion-item">
            <button className="accordion-title" onClick={toggleAccordion}>
              Bagaimana jika saya mengalami kendala teknis?
              <span className="accordion-icon">+</span>
            </button>
            <div className="accordion-content">
              <p>
                Tim dukungan kami selalu siap membantu Anda kapan saja jika
                mengalami masalah teknis.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Siap Menjadi Mitra Kami?</h2>
          <p>
            Bergabunglah sekarang dan nikmati berbagai manfaat bagi bisnis
            bengkel Anda.
          </p>
          <button className="btn-cta">Gabung Sekarang</button>
        </div>
      </section>
    </div>
  );
};

export default KemitraanBengkel;
