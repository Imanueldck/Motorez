import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", photo: "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    axios
      .get("https://dashing-heron-precious.ngrok-free.app/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      })
      .then((response) => {
        console.log("User Data:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        localStorage.removeItem("token");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .put("https://dashing-heron-precious.ngrok-free.app/api/profile", { name: user.name, email: user.email, password }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setMessage("Profil berhasil diperbarui!");
        fetchUser();
      })
      .catch((error) => {
        setMessage("Gagal memperbarui profil.");
        console.error("Error updating profile:", error);
      });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadPhoto = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    const token = localStorage.getItem("token");

    axios
      .post("https://dashing-heron-precious.ngrok-free.app/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setMessage("Foto berhasil diperbarui!");
        fetchUser();
      })
      .catch((error) => {
        setMessage("Gagal mengunggah foto.");
        console.error("Error uploading photo:", error);
      });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Profil Saya</h2>
      {message && <p className="message">{message}</p>}

      <div className="profile-picture">
  {user.image ? (
    <img
      src={user.image.includes("http") ? user.image :`https://dashing-heron-precious.ngrok-free.app/storage/${user.image}`}
      alt="Profile"
      className="user-photo"
      onError={(e) => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }} // Fallback if image fails to load
    />
  ) : (
    <p>Tidak ada foto</p>
  )}
</div>


      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label>Nama :</label>
          <input type="text" value={user.name || ""} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
        </div>

        <div className="form-group">
          <label>Email :</label>
          <input type="email" value={user.email || ""} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
        </div>

        <div className="form-group">
          <label>Password Baru :</label>
          <input type="password" placeholder="Isi jika ingin mengganti password" onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="submit" className="save-btn">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
};

export default Profile;