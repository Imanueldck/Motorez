import { useState, useEffect } from "react";
import {
  getBengkelOwner,
  insertBengkel,
  deleteBengkel,
  updateBengkel,
  getAllLayanan,
  getAllSpareparts,
  updateBengkelStatus,
} from "./HandleApi_owner";
import Swal from "sweetalert2";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Komponen untuk memilih lokasi dengan klik
const LocationPicker = ({ setLatLong }) => {
  useMapEvents({
    click(e) {
      setLatLong({ lat: e.latlng.lat, long: e.latlng.lng });
    },
  });
  return null;
};

// Komponen untuk memindahkan peta ke koordinat terbaru
const SetMapCenter = ({ lat, long }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && long) {
      map.setView([lat, long], 16);
    }
  }, [lat, long, map]);
  return null;
};

const ManageBengkel = () => {
  const [bengkel, setBengkel] = useState(null);
  const [layanan, setLayanan] = useState([]);
  const [sparepart, setSparepart] = useState([]);
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
    alamat: "",
    lat: "",
    long: "",
    image: null,
  });

  useEffect(() => {
    fetchBengkelData();
  }, []);

  useEffect(() => {
    if (!bengkel) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          }));
        },
        (err) => {
          console.error("Gagal mendapatkan lokasi:", err);
        }
      );
    }
  }, [bengkel]);

  const fetchBengkelData = async () => {
    setLoading(true);
    try {
      const data = await getBengkelOwner();
      if (data) setBengkel(data);
      const layananData = await getAllLayanan();
      const sparepartData = await getAllSpareparts();
      setLayanan(layananData);
      setSparepart(sparepartData);
    } catch (err) {
      setError("Silahkan daftarkan bengkel anda");
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

  const handleToggleStatus = async () => {
    if (layanan.length === 0 || sparepart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak bisa update status",
        text: "Layanan dan sparepart harus tersedia sebelum mengubah status bengkel.",
      });
      return;
    }
    try {
      const updatedStatus = !bengkel.status;
      await updateBengkelStatus(bengkel.id, Boolean(updatedStatus));
      setBengkel((prev) => ({
        ...prev,
        status: updatedStatus,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUseMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        setFormData((prev) => ({ ...prev, lat, long }));
      },
      (err) => {
        Swal.fire("Gagal", "Gagal mengambil lokasi Anda", "error");
      }
    );
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
        alamat: bengkel.alamat || "",
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
              <div className="d-flex flex-wrap gap-2 mt-2">
                <button className="btn btn-warning btn-sm" onClick={handleEdit}>
                  Edit Bengkel
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleDelete}
                >
                  Hapus Bengkel
                </button>

                <button
                  className={`btn btn-sm ${
                    bengkel.status ? "btn-success" : "btn-danger"
                  }`}
                  onClick={handleToggleStatus}
                >
                  <i
                    className={`fas ${
                      bengkel.status ? "fa-toggle-on" : "fa-toggle-off"
                    } me-1`}
                  ></i>
                  {bengkel.status ? "Buka" : "Tutup"}
                </button>

                <button
                  className="btn btn-info btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#ulasanModal"
                >
                  Lihat Ulasan
                </button>
              </div>
            </div>
            <div className="card-body">
              <h4>{bengkel.nama}</h4>
              <p>{bengkel.deskripsi}</p>
              <p>
                <strong>Alamat:</strong> {bengkel.alamat}
              </p>
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
                  <label>Alamat</label>
                  <input
                    type="text"
                    name="alamat"
                    className="form-control"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    required
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
                  <label>Lokasi Bengkel (Klik di Peta)</label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary mb-2"
                    onClick={handleUseMyLocation}
                  >
                    Gunakan Lokasi Saya
                  </button>

                  <MapContainer
                    center={[formData.lat || -6.2, formData.long || 106.8]}
                    zoom={13}
                    style={{ height: "300px", width: "100%" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker
                      setLatLong={({ lat, long }) =>
                        setFormData((prev) => ({ ...prev, lat, long }))
                      }
                    />
                    <SetMapCenter lat={formData.lat} long={formData.long} />
                    {formData.lat && formData.long && (
                      <Marker position={[formData.lat, formData.long]} />
                    )}
                  </MapContainer>
                </div>

                <div className="form-group">
                  <label>Latitude</label>
                  <input
                    type="number"
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
      {/* Modal Ulasan Bengkel */}
      <div
        className="modal fade"
        id="ulasanModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="ulasanModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="ulasanModalLabel"
                style={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  color: "#343a40",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Ulasan Bengkel
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {bengkel?.ulasan?.length > 0 ? (
                <div className="list-group">
                  {bengkel.ulasan.map((ul) => (
                    <div key={ul.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              ul.user?.image
                                ? ul.user.image
                                : "/assets/img/user2-160x160.jpg"
                            }
                            alt={ul.user?.name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginRight: 10,
                            }}
                          />
                          <div>
                            <strong>{ul.user?.name}</strong>
                            <div style={{ color: "#ffc107" }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`fa-star ${
                                    star <= ul.stars
                                      ? "fas text-warning"
                                      : "far text-muted"
                                  }`}
                                  style={{ marginRight: "2px" }}
                                ></i>
                              ))}
                            </div>
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date(ul.created_at).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                      <p className="mb-0">{ul.review}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Belum ada ulasan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  z;
};

export default ManageBengkel;
