import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8000/api";

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
