import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../pages/HandleApi";
import "../styles/profilePemilik.css";

export default function ProfilePemilik() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const [selectedFile, setSelectedFile] = useState(null); // State untuk menyimpan file gambar
  const [previewImage, setPreviewImage] = useState(null); // State untuk menyimpan preview gambar
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const profileData = await getUserProfile();
      setProfile({
        name: profileData.name,
        email: profileData.email,
        image: profileData.image || "", // Pastikan image di-set jika ada
      });
    } catch (error) {
      setMessage("Gagal mengambil data profil.");
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Meng-handle submit form untuk update profil
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUserProfile({
        name: profile.name,
        email: profile.email,
        password: profile.password,
        image: selectedFile, // Mengirimkan gambar baru jika ada
      });

      setMessage("Profil berhasil diperbarui!");
      fetchUser(); // Menarik ulang profil setelah update
    } catch (error) {
      setMessage("Gagal memperbarui profil.");
      console.error("Error updating profile:", error);
    }
  };

  // Meng-handle perubahan gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Membaca file gambar dan menampilkan preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result); // Menyimpan hasil preview gambar
    };
    if (file) {
      reader.readAsDataURL(file); // Membaca gambar sebagai URL
    }
  };

  // Jika data sedang dimuat
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-pemilik-container">
      <h2>Profil Pemilik Bengkel</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="profile-pemilik-form">
        <div className="form-group-pemilik">
          <label>Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group-pemilik">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group-pemilik">
          <label>Password Baru</label>
          <input
            type="password"
            name="password"
            placeholder="******"
            onChange={handleChange}
          />
        </div>

        {/* Menambahkan Input untuk Gambar Profil */}
        <div className="form-group-pemilik">
          <label>Ganti Foto Profil</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        {/* Menampilkan Preview Foto Profil jika ada */}
        {previewImage ? (
          <div className="image-preview-container">
            <img src={previewImage} alt="Preview" className="image-preview" />
          </div>
        ) : (
          profile.image && (
            <div className="image-preview-container">
              <img
                src={
                  profile.image.includes("http")
                    ? profile.image
                    : `https://dashing-heron-precious.ngrok-free.app/storage/${profile.image}`
                }
                alt="Profile"
                className="image-preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }} // Fallback jika gambar gagal dimuat
              />
            </div>
          )
        )}

        <button type="submit" className="save-btn-pemilik">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
