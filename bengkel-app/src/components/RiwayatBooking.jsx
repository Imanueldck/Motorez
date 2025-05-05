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
    jenis_kendaraan: "",
    plat: "",
    keluhan: "",
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
      jenis_kendaraan: booking.jenis_kendaraan,
      plat: booking.plat,
      keluhan: booking.keluhan,
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

  const statusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "badge bg-success";
      case "proses":
        return "badge bg-warning text-dark";
      case "pending":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
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
                        name="jenis_kendaraan"
                        value={editForm.jenis_kendaraan}
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
                      <strong>Jenis Kendaraan:</strong>{" "}
                      {booking.jenis_kendaraan}
                    </p>
                    <p className="booking-info">
                      <strong>Plat:</strong> {booking.plat}
                    </p>
                    <p className="booking-info">
                      <strong>Keluhan:</strong> {booking.keluhan}
                    </p>
                    <p className="booking-status">
                      <strong>Status:</strong>{" "}
                      <span className={statusColor(booking.status)}>
                        {booking.status}
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
          <div className="modal-content">
            <div className="modal-header">
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
                  <strong>Nama:</strong> {selectedBooking.nama}
                </p>
                <p>
                  <strong>Jenis Kendaraan:</strong>{" "}
                  {selectedBooking.jenis_kendaraan}
                </p>
                <p>
                  <strong>Plat:</strong> {selectedBooking.plat}
                </p>
                <p>
                  <strong>Keluhan:</strong> {selectedBooking.keluhan}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={statusColor(selectedBooking.status)}>
                    {selectedBooking.status}
                  </span>
                </p>
                <p>
                  <strong>Deskripsi Service:</strong>{" "}
                  {selectedBooking.deskripsi_service || "Belum ada deskripsi"}
                </p>
              </div>
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
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
