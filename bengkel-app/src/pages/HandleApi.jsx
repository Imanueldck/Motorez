import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8000/api"; // Ganti dengan URL kamu jika pakai ngrok

// REGISTER
export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);

    await Swal.fire({
      icon: "success",
      title: "Success!",
      text: response?.data?.message || "Registration successful!",
    });

    return response?.data?.message || "Registration successful!";
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: err.response?.data?.message || "Registration failed",
    });

    throw err.response?.data?.message || "Registration failed";
  }
};

// LOGIN
export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData);
    const token = response?.data?.access_token;

    if (token) {
      localStorage.setItem("token", token);
    }

    await Swal.fire({
      icon: "success",
      title: "Welcome!",
      text: "Login successful!",
    });

    return token;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: err.response?.data?.message || "Invalid credentials",
    });

    throw err.response?.data?.message || "Invalid credentials";
  }
};

// LOGOUT
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.removeItem("token");

    Swal.fire({
      icon: "success",
      title: "Logged out",
      text: "You have been successfully logged out!",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Logout Failed",
      text: err.response?.data?.message || "Logout failed",
    });

    throw err.response?.data?.message || "Logout failed";
  }
};

// GET PROFILE
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    localStorage.removeItem("token");

    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || "Failed to fetch user data",
    });

    throw err.response?.data?.message || "Failed to fetch user data";
  }
};

// UPDATE PROFILE
export const updateUserProfile = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.password) data.append("password", formData.password);
    if (formData.image) data.append("image", formData.image);

    const response = await axios.post(`${API_URL}/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    Swal.fire("Success", "Profile updated successfully!", "success");
    return response.data;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    throw err.response?.data?.message || "Update failed";
  }
};
// get all bengkel
export const getAllBengkel = async (lats, longs) => {
  try {
    const response = await axios.get(`${API_URL}/bengkel`, {
      params: {
        lat: lats,
        long: longs,
      },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch all bengkel data";
  }
};
// deatil bengkel
export const getDetailBengkel = async (id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/bengkel/${id}`);
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch all bengkel data";
  }
};
