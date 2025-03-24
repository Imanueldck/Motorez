import axios from "axios";

const API_URL = "https://dashing-heron-precious.ngrok-free.app/api";

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData);
    console.log("Login Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await axios.post(`${API_URL}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true", // Add this if using ngrok
      },
    });

    // Remove token from local storage
    localStorage.removeItem("token");

    // Redirect to login page
    // window.location.href = "/login"; // or use useNavigate() if inside a component
  } catch (error) {
    console.error("Logout Error:", error);
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
