import axios from "axios";

const API_URL = "https://097a-2404-8000-1038-82-1c9c-9cab-3316-4a37.ngrok-free.app/api";

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData);
    console.log("Login Response:", response.data); // Debugging response
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    window.location.reload(); // Reload agar useEffect di Profile terpanggil
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fungsi untuk update profil
export const updateProfile = async (token, name, email, password) => {
  try {
    const response = await axios.put(
      `${API_URL}/profile`,
      { name, email, password },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pastikan ada token untuk autentikasi
          "Content-Type": "application/json",
        },
      }
    );
    console.log("User Data:", response.data); // Debugging
    if (response.data && response.data.name) {
      setUser(response.data);
    } else {
      console.warn("Data pengguna tidak ditemukan.");
    }
  } catch (error) {
    console.error("Gagal memperbarui profil:", error.response?.data || error.message);
    throw error;
  }
};
