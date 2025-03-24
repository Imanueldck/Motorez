import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { loginUser } from "./HandleApi";

const LoginPemilik = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    try {
      const data = await loginUser(formData);
      console.log("Login berhasil:", data);
      alert("Login Berhasil");

      // Simpan token & data user ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Simpan data user

      // Redirect ke halaman Home
      navigate("/dashboard-pemilik");
    } catch (error) {
      console.error("Login gagal:", error);
      alert("Login Gagal, periksa kembali email dan password!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Side - Login Form */}
        <div className="login-left">
          <h2 className="login-title">Masuk sebagai Pemilik Bengkel</h2>
          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <input type="email" name="email" className="login-input" placeholder="Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="login-input-group">
              <input type="password" name="password" className="login-input" placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <p className="forgot-password">
              <a href="#">Lupa kata sandi anda?</a>
            </p>
            <button className="login-button" type="submit">
              Masuk
            </button>
          </form>
        </div>

        {/* Right Side - Sign Up Info */}
        <div className="login-right">
          <h3 className="welcome-text">Halo, Pemilik Bengkel!</h3>
          <p className="signup-text">Daftarkan diri anda dan mulai gunakan layanan kami segera</p>
          <Link to="/register/pemilik" className="signup-button">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPemilik;
