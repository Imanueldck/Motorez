import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8000/api";
// === CRUD Layanan ===
const SERVICE_URL = `${API_URL}/owner/service`;

export const getBengkelOwner = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/owner/bengkel`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch bengkel data";
  }
};

export const insertBengkel = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const submitData = new FormData();
    for (const key in formData) {
      submitData.append(key, formData[key]);
    }

    const response = await axios.post(`${API_URL}/bengkel`, submitData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    Swal.fire("Success", "Bengkel added successfully!", "success");
    return response.data;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    throw err.response?.data?.message || "Insert failed";
  }
};
// DELETE BENGKEL
export const deleteBengkel = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    // Mengirim request DELETE untuk menghapus bengkel berdasarkan ID
    const response = await axios.delete(`${API_URL}/bengkel/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    Swal.fire("Success", "Bengkel deleted successfully!", "success");
    return response.data;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
    throw err.response?.data?.message || "Delete failed";
  }
};
// edit BENGKEL
export const updateBengkel = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const data = new FormData();

    data.append("nama", formData.nama);
    data.append("deskripsi", formData.deskripsi);
    data.append("jam_buka", formData.jam_buka);
    data.append("jam_selesai", formData.jam_selesai);
    data.append("lat", formData.lat);
    data.append("long", formData.long);

    if (formData.image) {
      data.append("image", formData.image); // hanya jika ada file gambar
    }

    const response = await axios.post(`${API_URL}/bengkel/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    Swal.fire("Success", "Bengkel updated successfully!", "success");
    return response.data;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    throw err.response?.data?.message || "Update failed";
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
export const getBooking = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/owner/booking-servis`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);

    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch user data";
  }
};
export const updateBookingStatus = async (id, data) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/booking-servis/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Ambil semua layanan
export const getAllLayanan = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(SERVICE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Gagal mengambil data layanan";
  }
};

// Tambah layanan baru
export const createLayanan = async (data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.post(SERVICE_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Gagal menambahkan layanan";
  }
};

// Update layanan
export const updateLayanan = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.put(`${SERVICE_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Gagal mengubah layanan";
  }
};

// Hapus layanan
export const deleteLayanan = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.delete(`${SERVICE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Gagal menghapus layanan";
  }
};

// SPAREPART
export const getAllSpareparts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/owner/sparepart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch sparepart data";
  }
};
export const createSparepart = async (data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.post(`${API_URL}/owner/sparepart`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Swal.fire("Success", "Sparepart added successfully!", "success");
    return response.data;
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Failed to add sparepart",
      "error"
    );
    throw err.response?.data?.message || "Failed to add sparepart";
  }
};
export const updateSparepart = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.put(`${API_URL}/owner/sparepart/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Swal.fire("Success", "Sparepart updated successfully!", "success");
    return response.data;
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Failed to update sparepart",
      "error"
    );
    throw err.response?.data?.message || "Failed to update sparepart";
  }
};
export const deleteSparepart = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.delete(`${API_URL}/owner/sparepart/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Swal.fire("Success", "Sparepart deleted successfully!", "success");
    return response.data;
  } catch (err) {
    Swal.fire(
      "Error",
      err.response?.data?.message || "Failed to delete sparepart",
      "error"
    );
    throw err.response?.data?.message || "Failed to delete sparepart";
  }
};
