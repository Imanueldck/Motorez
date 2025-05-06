import { useState, useEffect, useRef } from "react";
import { getBooking, updateBooking } from "../pages/HandleApi";
import { NavLink } from "react-router-dom";
import { Modal } from "bootstrap";
import "../styles/riwayatbooking.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function RiwayatBooking() {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    nama_kendaraan: "",
    plat: "",
    keluhan: "",
    tgl_ambil: "",
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const detailModalRef = useRef(null);

  const Navbar = () => (
    <nav className="profile-navbar">
      <div className="profile-navbar-container">
        <ul className="profile-navbar-links">
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "profile-navbar-link active" : "profile-navbar-link"
              }
            >
              Profil Saya
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/riwayat-booking"
              className={({ isActive }) =>
                isActive ? "profile-navbar-link active" : "profile-navbar-link"
              }
            >
              Riwayat Booking
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBooking();
        setBookings(response);
      } catch (error) {
        console.error("Gagal mengambil data booking:", error);
      }
    };

    fetchBookings();
  }, []);

  const startEdit = (booking) => {
    setEditingId(booking.id);
    setEditForm({
      nama_kendaraan: booking.nama_kendaraan,
      plat: booking.plat,
      keluhan: booking.keluhan,
      tgl_ambil: booking.tgl_ambil
        ? new Date(booking.tgl_ambil).toISOString().slice(0, 16)
        : "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (id) => {
    try {
      await updateBooking(id, editForm);
      alert("Booking berhasil diperbarui!");
      setEditingId(null);

      const refreshed = await getBooking();
      setBookings(refreshed);
    } catch (err) {
      console.error("Gagal memperbarui booking:", err);
      alert("Terjadi kesalahan saat memperbarui booking.");
    }
  };

  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    const modal = new Modal(detailModalRef.current);
    modal.show();
  };

  // Get status label and color based on the status
  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "badge bg-warning text-dark"; // Pending
      case 1:
        return "badge bg-primary text-white"; // Proses
      case 2:
        return "badge bg-info text-white"; // Menunggu Diambil
      case 3:
        return "badge bg-success text-white"; // Selesai
      default:
        return "badge bg-secondary text-white"; // Unknown
    }
  };

  return (
    <div>
      <Navbar />
      <div className="riwayatbooking-container">
        <h2 className="riwayatbooking-title">Riwayat Booking</h2>
        <div className="riwayatbooking-card-body">
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div
                className="booking-card mb-3 p-3 border rounded shadow-sm"
                key={booking.id}
              >
                <h5 className="mb-4 form-label-riwayat-title">
                  {index + 1}. {booking.nama}
                </h5>
                {editingId === booking.id ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label-riwayat">
                        Jenis Kendaraan
                      </label>
                      <input
                        name="nama_kendaraan"
                        value={editForm.nama_kendaraan}
                        onChange={handleEditChange}
                        className="form-control form-input"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label-riwayat">Plat</label>
                      <input
                        name="plat"
                        value={editForm.plat}
                        onChange={handleEditChange}
                        className="form-control form-input"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label-riwayat">Keluhan</label>
                      <input
                        name="keluhan"
                        value={editForm.keluhan}
                        onChange={handleEditChange}
                        className="form-control form-input"
                      />
                    </div>
                    {/* Input untuk tgl_ambil */}
                    {/* ✅ Tanggal Diambil */}
                    <div className="mb-3">
                      <label className="form-label-riwayat">
                        Tanggal Pengambilan
                      </label>
                      <input
                        type="datetime-local"
                        name="tgl_ambil"
                        value={editForm.tgl_ambil}
                        onChange={handleEditChange}
                        className="form-control form-input"
                      />
                    </div>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleUpdateSubmit(booking.id)}
                    >
                      Simpan
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <p className="booking-info">
                      <strong>Jenis Kendaraan:</strong> {booking.nama_kendaraan}
                    </p>
                    <p className="booking-info">
                      <strong>Plat:</strong> {booking.plat}
                    </p>
                    <p className="booking-info">
                      <strong>Keluhan:</strong> {booking.keluhan}
                    </p>
                    <p className="booking-status">
                      <strong>Status:</strong>
                      <span
                        className={`ms-2 ${getStatusClass(booking.status)}`}
                      >
                        {booking.status === 0
                          ? "Pending"
                          : booking.status === 1
                          ? "Proses"
                          : booking.status === 2
                          ? "Menunggu Diambil"
                          : "Selesai"}
                      </span>
                    </p>

                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => startEdit(booking)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => openDetailModal(booking)}
                    >
                      Detail
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="riwayatbooking-empty">Tidak ada booking servis.</p>
          )}
        </div>
      </div>

      {/* MODAL DETAIL BOOKING */}
      <div
        className="modal fade"
        ref={detailModalRef}
        tabIndex="-1"
        aria-labelledby="detailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content" style={{ backgroundColor: "#f8f9fa" }}>
            <div
              className="modal-header"
              style={{ backgroundColor: "#007bff", color: "white" }}
            >
              <h5 className="modal-title" id="detailModalLabel">
                Detail Booking
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {selectedBooking && (
              <div className="modal-body">
                <p>
                  <strong style={{ color: "#007bff" }}>Nama:</strong>
                  <span style={{ color: "#333" }}>{selectedBooking.nama}</span>
                </p>
                <p>
                  <strong style={{ color: "#007bff" }}>Jenis Kendaraan:</strong>{" "}
                  <span style={{ color: "#333" }}>
                    {selectedBooking.nama_kendaraan}
                  </span>
                </p>
                <p>
                  <strong style={{ color: "#007bff" }}>Plat:</strong>
                  <span style={{ color: "#333" }}>{selectedBooking.plat}</span>
                </p>
                <p>
                  <strong style={{ color: "#007bff" }}>Keluhan:</strong>
                  <span style={{ color: "#333" }}>
                    {selectedBooking.keluhan}
                  </span>
                </p>
                {/* ✅ Tanggal Ambil */}
                <p>
                  <strong style={{ color: "#007bff" }}>Tanggal Diambil:</strong>
                  <span style={{ color: "#333", marginLeft: "8px" }}>
                    {selectedBooking.tgl_ambil
                      ? new Date(selectedBooking.tgl_ambil).toLocaleString(
                          "id-ID",
                          {
                            timeZone: "Asia/Jakarta",
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )
                      : "-"}
                  </span>
                </p>
                <p className="booking-status">
                  <strong style={{ color: "#007bff" }}>Status:</strong>
                  <span
                    className={`ms-2 ${getStatusClass(selectedBooking.status)}`}
                    style={{
                      color:
                        selectedBooking.status === 0
                          ? "orange"
                          : selectedBooking.status === 1
                          ? "blue"
                          : selectedBooking.status === 2
                          ? "green"
                          : "gray",
                    }}
                  >
                    {selectedBooking.status === 0
                      ? "Pending"
                      : selectedBooking.status === 1
                      ? "Proses"
                      : selectedBooking.status === 2
                      ? "Menunggu Diambil"
                      : "Selesai"}
                  </span>
                </p>

                <h5 style={{ color: "#007bff" }}>Detail Servis</h5>
                {Array.isArray(selectedBooking.detail_servis) &&
                selectedBooking.detail_servis.length > 0 ? (
                  <table className="table table-bordered">
                    <thead style={{ backgroundColor: "#f1f1f1" }}>
                      <tr>
                        <th>Sparepart</th>
                        <th>Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBooking.detail_servis.map((item, index) => (
                        <tr key={index}>
                          <td>{item.sparepart}</td>
                          <td>Rp {item.harga.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <strong>Total</strong>
                        </td>
                        <td>
                          <strong>
                            Rp{" "}
                            {selectedBooking.detail_servis
                              .reduce((sum, item) => sum + item.harga, 0)
                              .toLocaleString()}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p style={{ color: "#36454F" }}>Belum ada detail servis</p>
                )}
              </div>
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                style={{ backgroundColor: "#6c757d", color: "white" }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
