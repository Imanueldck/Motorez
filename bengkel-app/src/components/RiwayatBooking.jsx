import { useState, useEffect } from "react";
import { getBooking, updateBooking } from "../pages/HandleApi";
import { NavLink } from "react-router-dom";
import "../styles/riwayatbooking.css";

export default function RiwayatBooking() {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    jenis_kendaraan: "",
    plat: "",
    keluhan: "",
  });

  const Navbar = () => {
    return (
      <nav className="profile-navbar">
        <div className="profile-navbar-container">
          <ul className="profile-navbar-links">
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "profile-navbar-link active"
                    : "profile-navbar-link"
                }
              >
                Profil Saya
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/riwayat-booking"
                className={({ isActive }) =>
                  isActive
                    ? "profile-navbar-link active"
                    : "profile-navbar-link"
                }
              >
                Riwayat Booking
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    );
  };
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

  return (
    <div>
      <Navbar />
      <div className="riwayatbooking-container">
        <h2 className="riwayatbooking-title">Riwayat Booking</h2>
        <div className="riwayatbooking-card">
          <div className="riwayatbooking-card-body">
            {bookings.length > 0 ? (
              <div className="riwayatbooking-table-wrapper">
                <table className="riwayatbooking-table table table-bordered">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Jenis Kendaraan</th>
                      <th>Plat</th>
                      <th>Keluhan</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Terakhir Diperbarui</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={booking.id}>
                        <td>{index + 1}</td>
                        <td>{booking.nama}</td>
                        {editingId === booking.id ? (
                          <>
                            <td>
                              <input
                                name="jenis_kendaraan"
                                value={editForm.jenis_kendaraan}
                                onChange={handleEditChange}
                                className="form-control"
                              />
                            </td>
                            <td>
                              <input
                                name="plat"
                                value={editForm.plat}
                                onChange={handleEditChange}
                                className="form-control"
                              />
                            </td>
                            <td>
                              <input
                                name="keluhan"
                                value={editForm.keluhan}
                                onChange={handleEditChange}
                                className="form-control"
                              />
                            </td>
                            <td>{booking.status}</td>
                            <td>
                              {new Date(booking.created_at).toLocaleString()}
                            </td>
                            <td>
                              {new Date(booking.updated_at).toLocaleString()}
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleUpdateSubmit(booking.id)}
                              >
                                Simpan
                              </button>
                              <button
                                className="btn btn-secondary btn-sm mt-2"
                                onClick={() => setEditingId(null)}
                              >
                                Batal
                              </button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{booking.jenis_kendaraan}</td>
                            <td>{booking.plat}</td>
                            <td>{booking.keluhan}</td>
                            <td>{booking.status}</td>
                            <td>
                              {new Date(booking.created_at).toLocaleString()}
                            </td>
                            <td>
                              {new Date(booking.updated_at).toLocaleString()}
                            </td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => startEdit(booking)}
                              >
                                Edit
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="riwayatbooking-empty">Tidak ada booking servis.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
