import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
      .get("https://097a-2404-8000-1038-82-1c9c-9cab-3316-4a37.ngrok-free.app/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("User Data:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .put("https://097a-2404-8000-1038-82-1c9c-9cab-3316-4a37.ngrok-free.app/api/user/update", { name: user.name, email: user.email, password }, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        setMessage("Profil berhasil diperbarui!");
      })
      .catch((error) => {
        setMessage("Gagal memperbarui profil.");
        console.error("Error updating profile:", error);
      });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Profil Saya</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleUpdateProfile}>
        <div className="form-group">
          <label>Nama :</label>
          <input type="text" value={user?.name || ""} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
        </div>

        <div className="form-group">
          <label>Email :</label>
          <input type="email" value={user?.email || ""} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
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
