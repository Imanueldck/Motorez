import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../pages/HandleApi";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    image: "",
    no_hp: "",
  });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const Navbar = () => {
    return (
      <nav className="profile-navbar">
        <div className="profile-navbar-container">
          <ul className="profile-navbar-links">
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "profile-navbar-link active"
                    : "profile-navbar-link"
                }
              >
                Profil Saya
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/riwayat-booking"
                className={({ isActive }) =>
                  isActive
                    ? "profile-navbar-link active"
                    : "profile-navbar-link"
                }
              >
                Riwayat Booking
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const profile = await getUserProfile();
      setUser(profile);
    } catch (error) {
      console.error("Gagal ambil profil:", error);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile({
        name: user.name,
        email: user.email,
        password,
        no_hp: user.no_hp,
        image: selectedFile,
      });
      setMessage("Profil berhasil diperbarui!");
      fetchUser();
    } catch (error) {
      setMessage("Gagal memperbarui profil.");
      console.error("Error updating profile:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <h2>Profil Saya</h2>
        {message && <p className="message">{message}</p>}

        <div className="profile-picture">
          {preview ? (
            <img src={preview} alt="Preview" className="user-photo" />
          ) : user.image ? (
            <img
              src={
                user.image.includes("http")
                  ? user.image
                  : `http://localhost:8000/storage/${user.image}`
              }
              alt="Profile"
              className="user-photo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
          ) : (
            <p>Tidak ada foto</p>
          )}
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label>Nama :</label>
            <input
              type="text"
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Email :</label>
            <input
              type="email"
              value={user.email || ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>No. HP :</label>
            <input
              type="text"
              value={user.no_hp || ""}
              onChange={(e) => setUser({ ...user, no_hp: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password Baru :</label>
            <input
              type="password"
              placeholder="Isi jika ingin mengganti password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Ganti Foto Profil :</label>
            <input type="file" onChange={handleFileChange} />
          </div>

          <button type="submit" className="save-btn">
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
