import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/auth.css";
import { loginUser } from "./HandleApi";

const LoginPemilik = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await loginUser(formData); // ini akan return token atau null jika role tidak sesuai

      // Ambil user dari localStorage
      const user = JSON.parse(localStorage.getItem("user"));

      if (token && user?.role === "owner_bengkel") {
        localStorage.setItem("token", token);
        await Swal.fire("Berhasil", "Login berhasil!", "success");
        navigate("/dashboard-pemilik");
      } else {
        // Jika bukan owner_bengkel
        await Swal.fire(
          "Akses Ditolak",
          "Anda bukan pemilik bengkel!",
          "error"
        );
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Login gagal:", error);
      Swal.fire("Gagal", error || "Login gagal. Coba lagi!", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h2 className="login-title">Masuk sebagai Pemilik Bengkel</h2>
          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <input
                type="email"
                name="email"
                className="login-input"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="login-input-group">
              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <p className="forgot-password">
              <a href="#">Lupa kata sandi anda?</a>
            </p>
            <button className="login-button" type="submit">
              Masuk
            </button>
          </form>
        </div>
        <div className="login-right">
          <h3 className="welcome-text">Halo, Pemilik Bengkel!</h3>
          <p className="signup-text">
            Daftarkan diri anda dan mulai gunakan layanan kami segera
          </p>
          <Link to="/register/pemilik" className="signup-button">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPemilik;
