import { useEffect, useState } from "react";
import {
  getAllLayanan,
  createLayanan,
  updateLayanan,
  deleteLayanan,
} from "./HandleApi_owner"; // Sesuaikan path jika perlu
import "./css/managelayanan.css";
import Swal from "sweetalert2";

export default function ManageLayanan() {
  const [layananList, setLayananList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchLayanan();
  }, []);

  const fetchLayanan = async () => {
    try {
      const data = await getAllLayanan();
      setLayananList(data);
    } catch (error) {
      Swal.fire("Error", error?.message || "Terjadi kesalahan", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.deskripsi || !formData.harga) {
      Swal.fire("Peringatan", "Harap isi semua field", "warning");
      return;
    }

    try {
      if (editId) {
        await updateLayanan(editId, formData);
        Swal.fire("Success", "Layanan berhasil diperbarui", "success");
      } else {
        await createLayanan(formData);
        Swal.fire("Success", "Layanan berhasil ditambahkan", "success");
      }
      setFormData({ nama: "", deskripsi: "", harga: "" });
      setEditId(null);
      fetchLayanan();
    } catch (error) {
      Swal.fire("Error", error, "error");
    }
  };

  const handleEdit = (layanan) => {
    setFormData({
      nama: layanan.nama,
      deskripsi: layanan.deskripsi,
      harga: layanan.harga,
    });
    setEditId(layanan.id);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus layanan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteLayanan(id);
        Swal.fire("Success", "Layanan berhasil dihapus", "success");
        fetchLayanan();
      } catch (error) {
        Swal.fire("Error", error, "error");
      }
    }
  };

  return (
    <div className="layanan-container">
      <h2 className="layanan-title">Kelola Layanan</h2>

      <form onSubmit={handleSubmit} className="layanan-form">
        <div className="layanan-form-group">
          <label className="layanan-label">Nama Layanan</label>
          <input
            type="text"
            className="layanan-input"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
          />
        </div>

        <div className="layanan-form-group">
          <label className="layanan-label">Deskripsi</label>
          <textarea
            className="layanan-textarea"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="layanan-form-group">
          <label className="layanan-label">Harga</label>
          <input
            type="number"
            className="layanan-input"
            name="harga"
            value={formData.harga}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="layanan-button">
          {editId ? "Update" : "Tambah"} Layanan
        </button>
      </form>

      <h4 className="layanan-subtitle">Daftar Layanan</h4>
      {layananList.length === 0 ? (
        <p className="layanan-empty">Belum ada layanan.</p>
      ) : (
        <table className="layanan-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Harga (Rp)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {layananList.map((layanan) => (
              <tr key={layanan.id}>
                <td>{layanan.nama}</td>
                <td>{layanan.deskripsi}</td>
                <td>{layanan.harga}</td>
                <td>
                  <button
                    className="layanan-btn-edit"
                    onClick={() => handleEdit(layanan)}
                  >
                    Edit
                  </button>
                  <button
                    className="layanan-btn-delete"
                    onClick={() => handleDelete(layanan.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
