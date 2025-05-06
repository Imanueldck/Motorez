import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./HandleApi"; // Sesuaikan path jika perlu
import "../styles/register.css"; // Pastikan file CSS tersedia

const RegisterPelanggan = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    no_hp: "",
    role: "user", // Default role pelanggan
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi semua field harus terisi
    const { name, email, password, no_hp } = formData;
    if (!name || !email || !password || !no_hp) {
      alert("Semua field harus diisi!");
      return;
    }

    try {
      await registerUser(formData); // Fungsi API
      alert("Registrasi berhasil! Silakan login.");
      navigate("/login/pelanggan"); // Redirect ke halaman login pelanggan
    } catch (error) {
      alert("Gagal mendaftar: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        {/* Bagian Kiri - Arahkan ke Login */}
        <div className="register-left">
          <h3 className="welcome-text">Halo, Teman!</h3>
          <p className="signup-text">Sudah punya akun? Masuk di sini.</p>
          <Link to="/login/pelanggan" className="signup-button">
            Masuk
          </Link>
        </div>

        {/* Bagian Kanan - Form Pendaftaran */}
        <div className="register-right">
          <h1 className="register-title">Daftar sebagai Pelanggan</h1>
          <form onSubmit={handleSubmit}>
            <div className="register-input-group">
              <label className="auth-label">Nama</label>
              <input
                type="text"
                name="name"
                className="register-input"
                placeholder="Masukkan nama Anda"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-input-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                name="email"
                className="register-input"
                placeholder="Masukkan email Anda"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-input-group">
              <label className="auth-label">Password</label>
              <input
                type="password"
                name="password"
                className="register-input"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-input-group">
              <label className="auth-label">No. HP</label>
              <input
                type="text"
                name="no_hp"
                className="register-input"
                placeholder="Masukkan nomor HP Anda"
                value={formData.no_hp}
                onChange={handleChange}
                required
              />
            </div>

            <button className="register-button" type="submit">
              Daftar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPelanggan;
