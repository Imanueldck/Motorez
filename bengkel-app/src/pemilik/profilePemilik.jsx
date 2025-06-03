import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../pages/HandleApi";
import { NavLink } from "react-router-dom";
import "./css/profilePemilik.css";

export default function ProfilePemilik() {
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

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const profileData = await getUserProfile();
      setUser(profileData);
    } catch (error) {
      setMessage("Gagal mengambil data profil.");
      console.error("Error fetching profile:", error);
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
        no_hp: user.no_hp,
        password,
        image: selectedFile,
      });
      setMessage("Profil berhasil diperbarui!");
      fetchUser();
      setPassword(""); // reset password input setelah submit
      setSelectedFile(null);
      setPreview(null);
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
    <div className="profile-pemilik-container">
      <h2>Profil Pemilik Bengkel</h2>

      {message && <p className="message">{message}</p>}

      <div className="profile-picture">
        {preview ? (
          <img src={preview} alt="Preview" className="user-photo" />
        ) : user.image ? (
          <img
            src={
              user.image.includes("http")
                ? user.image
                : `https://dashing-heron-precious.ngrok-free.app/storage/${user.image}`
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

      <form onSubmit={handleUpdateProfile} className="profile-pemilik-form">
        <div className="form-group-pemilik">
          <label>Nama Lengkap</label>
          <input
            type="text"
            value={user.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group-pemilik">
          <label>Email</label>
          <input
            type="email"
            value={user.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group-pemilik">
          <label>No. HP</label>
          <input
            type="text"
            value={user.no_hp || ""}
            onChange={(e) => setUser({ ...user, no_hp: e.target.value })}
            required
          />
        </div>

        <div className="form-group-pemilik">
          <label>Password Baru</label>
          <input
            type="password"
            placeholder="Isi jika ingin mengganti password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group-pemilik">
          <label>Ganti Foto Profil</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <button type="submit" className="save-btn-pemilik">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
