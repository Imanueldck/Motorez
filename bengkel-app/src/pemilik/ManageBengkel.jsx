import { useState, useEffect } from "react";
import {
  getBengkelOwner,
  insertBengkel,
  deleteBengkel,
  updateBengkel,
} from "./HandleApi_owner";
import Swal from "sweetalert2";

const ManageBengkel = () => {
  const [bengkel, setBengkel] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    jam_buka: "",
    jam_selesai: "",
    lat: "",
    long: "",
    image: null,
  });

  useEffect(() => {
    fetchBengkelData();
  }, []);

  const fetchBengkelData = async () => {
    setLoading(true);
    try {
      const data = await getBengkelOwner();
      if (data) setBengkel(data);
    } catch (err) {
      setError("Gagal memuat data bengkel.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing && bengkel?.id) {
        await updateBengkel(bengkel.id, formData);
      } else {
        await insertBengkel(formData);
      }

      setSuccess("Bengkel berhasil disimpan!");
      setError("");
      setEditing(false);
      fetchBengkelData();
    } catch (error) {
      setError(error.toString());
      setSuccess("");
    }
  };

  const handleDelete = async () => {
    if (!bengkel?.id) return;

    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus bengkel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteBengkel(bengkel.id);
        setBengkel(null);
        setSuccess("Bengkel berhasil dihapus.");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = () => {
    if (bengkel) {
      setFormData({
        nama: bengkel.nama,
        deskripsi: bengkel.deskripsi,
        jam_buka: bengkel.jam_buka,
        jam_selesai: bengkel.jam_selesai,
        lat: bengkel.lat,
        long: bengkel.long,
        image: null,
      });
      setImagePreview(bengkel.image);
      setEditing(true);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Memuat data bengkel...</p>
      </div>
    );
  }

  return (
    <section className="content">
      <div className="container-fluid">
        {bengkel && !editing ? (
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3 className="card-title">Detail Bengkel</h3>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={handleEdit}
                >
                  Edit Bengkel
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleDelete}
                >
                  Hapus Bengkel
                </button>
              </div>
            </div>
            <div className="card-body">
              <h4>{bengkel.nama}</h4>
              <p>{bengkel.deskripsi}</p>
              <p>
                <strong>Jam:</strong> {bengkel.jam_buka} - {bengkel.jam_selesai}
              </p>
              <p>
                <strong>Lokasi:</strong> {bengkel.lat}, {bengkel.long}
              </p>
              {bengkel.image && (
                <img
                  src={bengkel.image}
                  alt="Bengkel"
                  className="img-fluid"
                  style={{ maxHeight: "300px" }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">
                {editing ? "Edit Bengkel" : "Daftarkan Bengkel Anda"}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                <div className="form-group">
                  <label>Nama Bengkel</label>
                  <input
                    type="text"
                    name="nama"
                    className="form-control"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    className="form-control"
                    rows="3"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Jam Buka</label>
                  <input
                    type="time"
                    name="jam_buka"
                    className="form-control"
                    value={formData.jam_buka}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Jam Selesai</label>
                  <input
                    type="time"
                    name="jam_selesai"
                    className="form-control"
                    value={formData.jam_selesai}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    className="form-control"
                    value={formData.lat}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="long"
                    className="form-control"
                    value={formData.long}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Gambar Bengkel</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-fluid"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <button type="submit" className="btn btn-primary">
                  {editing ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageBengkel;
