import { useState } from "react";
import "../styles/profilePemilik.css";

export default function ProfilePemilik() {
  const [profile, setProfile] = useState({
    name: "Admin Bengkel",
    email: "admin@bengkel.com",
    password: "",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profil berhasil diperbarui!");
  };

  return (
    <div className="profile-pemilik-container">
      <h2>Profil Pemilik Bengkel</h2>
      <form onSubmit={handleSubmit} className="profile-pemilik-form">
        <div className="form-group-pemilik">
          <label>Nama Lengkap</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} required />
        </div>
        <div className="form-group-pemilik">
          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} required />
        </div>
        <div className="form-group-pemilik">
          <label>Password Baru</label>
          <input type="password" name="password" placeholder="******" onChange={handleChange} />
        </div>
        <button type="submit" className="save-btn-pemilik">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
