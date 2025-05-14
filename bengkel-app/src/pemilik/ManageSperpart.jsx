import { useEffect, useState } from "react";
import {
  getAllSpareparts,
  createSparepart,
  updateSparepart,
  deleteSparepart,
} from "./HandleApi_owner";
import "./css/managesparepart.css";
import Swal from "sweetalert2";

export default function ManageSparepart() {
  const [sparepartList, setSparepartList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSpareparts();
  }, []);

  const fetchSpareparts = async () => {
    try {
      const data = await getAllSpareparts();
      setSparepartList(data);
    } catch (error) {
      Swal.fire("Error", error.message || error, "error");
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
        await updateSparepart(editId, formData);
        Swal.fire("Success", "Sparepart berhasil diperbarui", "success");
      } else {
        await createSparepart(formData);
        Swal.fire("Success", "Sparepart berhasil ditambahkan", "success");
      }

      setFormData({ nama: "", deskripsi: "", harga: "" });
      setEditId(null);
      fetchSpareparts();
    } catch (error) {
      Swal.fire("Error", error.message || error, "error");
    }
  };

  const handleEdit = (sp) => {
    setFormData({
      nama: sp.nama,
      deskripsi: sp.deskripsi,
      harga: sp.harga,
    });
    setEditId(sp.id);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus sparepart ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteSparepart(id);
        Swal.fire("Success", "Sparepart berhasil dihapus", "success");
        fetchSpareparts();
      } catch (error) {
        Swal.fire("Error", error.message || error, "error");
      }
    }
  };

  return (
    <div className="sparepart-container">
      <h2 className="sparepart-title">Kelola Sparepart</h2>

      <form onSubmit={handleSubmit} className="sparepart-form">
        <div className="sparepart-form-group">
          <label className="sparepart-label">Nama Sparepart</label>
          <input
            type="text"
            className="sparepart-input"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
          />
        </div>

        <div className="sparepart-form-group">
          <label className="sparepart-label">Deskripsi</label>
          <textarea
            className="sparepart-textarea"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="sparepart-form-group">
          <label className="sparepart-label">Harga</label>
          <input
            type="number"
            className="sparepart-input"
            name="harga"
            value={formData.harga}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="sparepart-button">
          {editId ? "Update" : "Tambah"} Sparepart
        </button>
      </form>

      <h4 className="sparepart-subtitle">Daftar Sparepart</h4>
      {sparepartList.length === 0 ? (
        <p className="sparepart-empty">Belum ada sparepart.</p>
      ) : (
        <table className="sparepart-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Deskripsi</th>
              <th>Harga (Rp)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sparepartList.map((sp) => (
              <tr key={sp.id}>
                <td>{sp.nama}</td>
                <td>{sp.deskripsi}</td>
                <td>{sp.harga}</td>
                <td>
                  <button
                    className="sparepart-btn-edit"
                    onClick={() => handleEdit(sp)}
                  >
                    Edit
                  </button>
                  <button
                    className="sparepart-btn-delete"
                    onClick={() => handleDelete(sp.id)}
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
