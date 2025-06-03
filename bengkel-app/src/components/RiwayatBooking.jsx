import { useState, useEffect, useRef } from "react";
import {
  getBooking,
  updateBooking,
  getDetailBooking,
  inputUlasan,
} from "../pages/HandleApi";
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
    jam_ambil: "",
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    komentar: "",
    rating: 5,
  });

  const detailModalRef = useRef(null);
  const reviewModalRef = useRef(null);

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
    const tglAmbil = booking.tgl_ambil ? new Date(booking.tgl_ambil) : null;
    setEditForm({
      nama_kendaraan: booking.nama_kendaraan,
      plat: booking.plat,
      keluhan: booking.keluhan,
      tgl_ambil: tglAmbil ? tglAmbil.toISOString().slice(0, 10) : "",
      jam_ambil: booking.jam_ambil || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (id) => {
    const fullTglAmbil = `${editForm.tgl_ambil}T${editForm.jam_ambil}:00`;
    try {
      await updateBooking(id, { ...editForm, tgl_ambil: fullTglAmbil });
      alert("Booking berhasil diperbarui!");
      setEditingId(null);
      const refreshed = await getBooking();
      setBookings(refreshed);
    } catch (err) {
      console.error("Gagal memperbarui booking:", err);
      alert("Terjadi kesalahan saat memperbarui booking.");
    }
  };

  const openDetailModal = async (booking) => {
    try {
      const detailData = await getDetailBooking(booking.id);
      setSelectedBooking(detailData);
      const modal = new Modal(detailModalRef.current);
      modal.show();
    } catch (error) {
      console.error("Gagal mengambil detail booking:", error);
      alert("Gagal mengambil detail booking.");
    }
  };
  const openReviewModal = (booking) => {
    setSelectedReview(booking);
    setReviewForm({ komentar: "", rating: 5 });
    const modal = new Modal(reviewModalRef.current);
    modal.show();
  };

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = async () => {
    try {
      await inputUlasan({
        booking_servis_id: selectedReview.id, // ✅ sesuaikan dengan field yang diminta backend
        bengkel_id: selectedReview.bengkel_id,
        review: reviewForm.komentar,
        stars: parseInt(reviewForm.rating), // ✅ jika backend pakai 'stars' bukan 'rating'
      });

      const modal = Modal.getInstance(reviewModalRef.current);
      modal.hide();
    } catch (err) {
      console.error("Gagal mengirim ulasan:", err);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "badge bg-warning text-dark";
      case 1:
        return "badge bg-primary text-white";
      case 2:
        return "badge bg-info text-white";
      case 3:
        return "badge bg-success text-white";
      default:
        return "badge bg-secondary text-white";
    }
  };

  const formatRupiah = (angka) =>
    `Rp ${parseFloat(angka).toLocaleString("id-ID", {
      minimumFractionDigits: 0,
    })}`;

  // Fungsi total harga + format rupiah
  const getTotalHargaRupiah = (booking) => {
    if (!booking) return "Rp 0";

    const totalHarga =
      booking?.detail_servis?.reduce((total, item) => {
        if (item.layanan) return total + parseFloat(item.layanan.harga);
        if (item.sparepart) return total + parseFloat(item.sparepart.harga);
        return total;
      }, 0) || 0;

    return formatRupiah(totalHarga);
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
                        Nama Kendaraan
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
                    <div className="mb-3">
                      <label className="form-label-riwayat">
                        Tanggal Pengambilan
                      </label>
                      <input
                        type="date"
                        name="tgl_ambil"
                        value={editForm.tgl_ambil}
                        onChange={handleEditChange}
                        className="form-control form-input"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label-riwayat">
                        Jam Pengambilan
                      </label>
                      <input
                        type="time"
                        name="jam_ambil"
                        value={editForm.jam_ambil}
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
                    <p className="booking-info">
                      <strong>Total Harga:</strong>{" "}
                      {getTotalHargaRupiah(booking)}
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
                    {booking.status === 3 && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => openReviewModal(booking)}
                      >
                        Beri Ulasan
                      </button>
                    )}
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
                  <span style={{ color: "#333" }}> {selectedBooking.nama}</span>
                </p>
                <p>
                  <strong style={{ color: "#007bff" }}>Jenis Kendaraan:</strong>{" "}
                  <span style={{ color: "#333" }}>
                    {selectedBooking.nama_kendaraan}
                  </span>
                </p>
                <p>
                  <strong style={{ color: "#007bff" }}>Plat:</strong>{" "}
                  <span style={{ color: "#333" }}>{selectedBooking.plat}</span>
                </p>
                <p>
                  <strong style={{ color: "#007bff" }}>Keluhan:</strong>{" "}
                  <span style={{ color: "#333" }}>
                    {selectedBooking.keluhan}
                  </span>
                </p>
                <p>
                  <strong style={{ color: "#007bff" }}>Tanggal Diambil:</strong>
                  <span style={{ color: "#333", marginLeft: "8px" }}>
                    {selectedBooking.tgl_ambil
                      ? new Date(selectedBooking.tgl_ambil).toLocaleDateString(
                          "id-ID"
                        )
                      : "-"}
                  </span>
                </p>
                <p>
                  <strong style={{ color: "#007bff" }}>Jam Diambil:</strong>
                  <span style={{ color: "#333", marginLeft: "8px" }}>
                    {selectedBooking.jam_ambil || "-"}
                  </span>
                </p>
                <p className="booking-status">
                  <strong style={{ color: "#007bff" }}>Status:</strong>
                  <span
                    className={`ms-2 ${getStatusClass(selectedBooking.status)}`}
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

                {/* Detail Servis */}
                {selectedBooking.detail_servis &&
                selectedBooking.detail_servis.length > 0 ? (
                  <>
                    <h5 style={{ color: "#007bff" }}>Detail Servis</h5>
                    <table className="table table-bordered">
                      <thead style={{ backgroundColor: "#f1f1f1" }}>
                        <tr>
                          <th>Sparepart</th>
                          <th>Harga</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBooking.detail_servis.length === 0 ? (
                          <tr>
                            <td colSpan="4" className="text-center">
                              Tidak ada layanan atau sparepart.
                            </td>
                          </tr>
                        ) : (
                          selectedBooking.detail_servis.map((item) => (
                            <tr key={item.id}>
                              <td>{item.type}</td>
                              <td>
                                {item.layanan?.nama ||
                                  item.sparepart?.nama ||
                                  "-"}
                              </td>
                              <td>
                                {item.layanan?.deskripsi ||
                                  item.sparepart?.deskripsi ||
                                  "-"}
                              </td>
                              <td>
                                Rp{" "}
                                {item.layanan?.harga || item.sparepart?.harga
                                  ? parseInt(
                                      item.layanan?.harga ||
                                        item.sparepart?.harga
                                    ).toLocaleString("id-ID")
                                  : "0"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p>Tidak ada detail servis.</p>
                )}

                {/* Detail Jenis Layanan */}
                {selectedBooking.jenis_layanan &&
                selectedBooking.jenis_layanan.length > 0 ? (
                  <>
                    <h5 style={{ color: "#007bff" }}>Jenis Layanan</h5>
                    <table className="table table-bordered">
                      <thead style={{ backgroundColor: "#f1f1f1" }}>
                        <tr>
                          <th>Layanan</th>
                          <th>Harga</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBooking.jenis_layanan.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.layanan?.nama || "-"}</td>
                            <td>
                              {formatRupiah(
                                item.harga_layanan || item.layanan?.harga || 0
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <p>Tidak ada jenis layanan.</p>
                )}

                <p>
                  <strong style={{ color: "#007bff" }}>Total Harga:</strong>{" "}
                  {getTotalHargaRupiah(selectedBooking)}
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
      {/* MODAL REVIEW */}
      <div
        className="modal fade"
        ref={reviewModalRef}
        tabIndex="-1"
        aria-labelledby="reviewModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title" id="reviewModalLabel">
                Beri Ulasan
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Bintang rating */}
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <div>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      onClick={() =>
                        setReviewForm((prev) => ({ ...prev, rating: num }))
                      }
                      style={{
                        cursor: "pointer",
                        fontSize: "1.8rem",
                        color: reviewForm.rating >= num ? "#ffc107" : "#e4e5e9",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Komentar */}
              <div className="mb-3">
                <label htmlFor="komentar" className="form-label">
                  Komentar
                </label>
                <textarea
                  name="komentar"
                  value={reviewForm.komentar}
                  onChange={handleReviewChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmitReview}
              >
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
