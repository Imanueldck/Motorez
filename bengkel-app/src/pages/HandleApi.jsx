import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "https://api.motorez.my.id/api";

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

export const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData);

    const token = response?.data?.access_token;
    if (token) {
      localStorage.setItem("token", token); // Store token for future requests
    }

    return "Login Berhasil";
  } catch (err) {
    throw err.response?.data?.message || "Invalid credentials";
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
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
    throw err.response?.data?.message || "Logout failed";
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (err) {
    localStorage.removeItem("token");
    throw err.response?.data?.message || "Failed to fetch user data";
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("no_hp", formData.no_hp);
    if (formData.password) data.append("password", formData.password);
    if (formData.image) data.append("image", formData.image);

    const response = await axios.post(`${API_URL}/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    Swal.fire("Success", "Profile updated successfully!", "success");
    return response.data.data;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    throw err.response?.data?.message || "Update failed";
  }
};

export const getAllBengkel = async (lat, long) => {
  try {
    const response = await axios.get(`${API_URL}/bengkel`, {
      params: {
        lat,
        long,
      },
    });
    return response.data.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch all bengkel data";
  }
};

export const getDetailBengkel = async (id, lat, long) => {
  try {
    const response = await axios.get(`${API_URL}/bengkel/${id}`, {
      params: {
        lat: lat,
        long: long,
      },
    });
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.error("Bengkel tidak ditemukan.");
      return null;
    }
    console.error("Error in getDetailBengkel:", err);
    return null;
  }
};

export const getLayananBengkel = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/bengkel/layanan/${id}`);
    return response.data.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return [];
    }
    console.error("Error in getLayananBengkel:", err);
    return [];
  }
};

export const getBooking = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/user/booking_servis`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch user data";
  }
};

export const getDetailBooking = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/booking_servis/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch user data";
  }
};

export const postBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/user/input/booking_servis`,
      bookingData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Booking berhasil!",
      timer: 2000,
      showConfirmButton: false,
    });
    return response.data.data;
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Gagal",
      text: error.response?.data?.message || "Terjadi kesalahan saat booking.",
    });
    throw error.response?.data?.message || "Terjadi kesalahan saat booking.";
  }
};

export const deleteBooking = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data booking yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return null; // batal dihapus
    }

    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_URL}/user/delete/booking_servis/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Booking berhasil dihapus.",
      timer: 1500,
      showConfirmButton: false,
    });

    return response.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message || "Gagal menghapus booking.",
    });
    throw err.response?.data?.message || "Gagal menghapus booking.";
  }
};

export const updateBooking = async (id, data) => {
  try {
    const token = localStorage.getItem("token");

    // Prepare payload by excluding null or empty tgl_ambil/jam_ambil
    const payload = { ...data };
    if (!payload.tgl_ambil) delete payload.tgl_ambil;
    if (!payload.jam_ambil) delete payload.jam_ambil;

    const response = await axios.put(
      `${API_URL}/user/update/booking_servis/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Booking berhasil diupdate.",
      timer: 1500,
      showConfirmButton: false,
    });
    return response.data.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message || "Gagal menghapus booking.",
    });
    throw err.response?.data?.message || "Failed to update booking status";
  }
};

export const inputUlasan = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.post(
      `${API_URL}/user/input/ulasan_bengkel`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

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
