import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://newapi.test/api";

// --- BENGKEL ---
export const getBengkelOwner = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/admin_bengkel/bengkel`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
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

    const response = await axios.post(
      `${API_URL}/admin_bengkel/input/bengkel`,
      submitData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    Swal.fire("Success", "Bengkel added successfully!", "success");
    return response.data.data;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Insert failed", "error");
    throw err.response?.data?.message || "Insert failed";
  }
};

export const deleteBengkel = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.delete(
      `${API_URL}/admin_bengkel/delete/bengkel/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire("Success", "Bengkel deleted successfully!", "success");
    return response.data;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Delete failed", "error");
    throw err.response?.data?.message || "Delete failed";
  }
};

export const updateBengkel = async (id, formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const submitData = new FormData();
    for (const key in formData) {
      if (key === "image" && !formData[key]) continue;
      submitData.append(key, formData[key]);
    }

    const response = await axios.post(
      `${API_URL}/admin_bengkel/update/bengkel/${id}`,
      submitData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    Swal.fire("Success", "Bengkel updated successfully!", "success");
    return response.data.data;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    throw err.response?.data?.message || "Update failed";
  }
};
export const updateBengkelStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.post(
      `${API_URL}/admin_bengkel/update/bengkel/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire("Success", "Status bengkel updated successfully!", "success");
    return response.data.data;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.message || "Update failed", "error");
    throw err.response?.data?.message || "Update failed";
  }
};
// --- LOGOUT ---
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

// --- BOOKING ---
export const getBooking = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(
      `${API_URL}/admin_bengkel/booking_servis`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch booking data";
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
    throw err.response?.data?.message || "Failed to fetch booking detail";
  }
};

export const updateBookingStatus = async (id, data) => {
  try {
    const token = localStorage.getItem("token");

    const payload = { ...data };
    if (!payload.status) delete payload.status;
    if (!payload.sparepart_ids) delete payload.sparepart_ids;

    const response = await axios.put(
      `${API_URL}/admin_bengkel/update/booking_servis/${id}`,
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
      text: err.response?.data?.message || "Gagal mengupdate booking.",
    });
    throw err.response?.data?.message || "Failed to update booking";
  }
};

// --- LAYANAN ---
// Ambil semua layanan (GET)
export const getAllLayanan = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/admin_bengkel/layanan`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message || "Gagal mengambil layanan.",
    });
    throw err;
  }
};

// Tambah layanan (POST)
export const createLayanan = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/admin_bengkel/input/layanan`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Layanan berhasil ditambahkan.",
      timer: 1500,
      showConfirmButton: false,
    });

    return response.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message || "Gagal menambah layanan.",
    });
    throw err;
  }
};

// Update layanan (PUT)
export const updateLayanan = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/admin_bengkel/update/layanan/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Layanan berhasil diperbarui.",
      timer: 1500,
      showConfirmButton: false,
    });

    return response.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message || "Gagal mengupdate layanan.",
    });
    throw err;
  }
};

// Hapus layanan (DELETE)
export const deleteLayanan = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data layanan yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return null;
    }

    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_URL}/admin_bengkel/delete/layanan/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Layanan berhasil dihapus.",
      timer: 1500,
      showConfirmButton: false,
    });

    return response.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message || "Gagal menghapus layanan.",
    });
    throw err;
  }
};

// --- SPAREPART ---
export const getAllSpareparts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    const response = await axios.get(`${API_URL}/admin_bengkel/sparepart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch sparepart data";
  }
};

export const createSparepart = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/admin_bengkel/input/sparepart`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Sparepart berhasil ditambahkan.",
      timer: 1500,
      showConfirmButton: false,
    });

    return response.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message || "Gagal menambah sparepart.",
    });
    throw err;
  }
};

export const updateSparepart = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/admin_bengkel/update/sparepart/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Sparepart berhasil diperbarui.",
      timer: 1500,
      showConfirmButton: false,
    });

    return response.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message || "Gagal mengupdate sparepart.",
    });
    throw err;
  }
};

export const deleteSparepart = async (id) => {
  try {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data sparepart yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) {
      return null;
    }

    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_URL}/admin_bengkel/delete/sparepart/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Sparepart berhasil dihapus.",
      timer: 1500,
      showConfirmButton: false,
    });

    return response.data;
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err.response?.data?.message || "Gagal menghapus sparepart.",
    });
    throw err;
  }
};
