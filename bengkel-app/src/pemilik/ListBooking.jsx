// src/components/ListBookingPemilik.jsx
import { useEffect, useState } from "react";
import { getBooking, updateBookingStatus } from "./HandleApi_owner"; // Ganti dengan API yang sesuai
import "./css/listpemilik.css";

export default function ListBooking() {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getBooking();
        setBookings(result);
      } catch (err) {
        console.error("Gagal mengambil data booking:", err);
      }
    };

    fetchData();
  }, []);
  const startEdit = (booking) => {
    setEditingId(booking.id);
    setEditStatus(booking.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditStatus("");
  };

  const handleUpdateStatus = async (id) => {
    try {
      await updateBookingStatus(id, { status: editStatus });
      alert("Status berhasil diperbarui!");
      setEditingId(null);

      // Refresh data
      const updated = await getBooking();
      setBookings(updated);
    } catch (err) {
      console.error("Gagal update status:", err);
      alert("Gagal memperbarui status.");
    }
  };

  return (
    <div className="list-booking-pemilik">
      <h2 className="list-booking-title">Daftar Booking</h2>
      <div className="list-booking-card">
        <div className="list-booking-card-body">
          {bookings.length > 0 ? (
            <div className="list-booking-table-wrapper">
              <div className="table-responsive">
                <table className="list-booking-table table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>Jenis Kendaraan</th>
                      <th>Plat</th>
                      <th>Keluhan</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={booking.id}>
                        <td>{index + 1}</td>
                        <td>{booking.nama}</td>
                        <td>{booking.jenis_kendaraan}</td>
                        <td>{booking.plat}</td>
                        <td>{booking.keluhan}</td>
                        <td>
                          {editingId === booking.id ? (
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="form-control"
                            >
                              <option value="pending">Pending</option>
                              <option value="onprogress">Proses</option>
                              <option value="completed">Selesai</option>
                            </select>
                          ) : (
                            booking.status
                          )}
                        </td>
                        <td>{new Date(booking.created_at).toLocaleString()}</td>
                        <td>
                          {editingId === booking.id ? (
                            <>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleUpdateStatus(booking.id)}
                              >
                                Simpan
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={cancelEdit}
                              >
                                Batal
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => startEdit(booking)}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="list-booking-empty">Tidak ada data booking.</p>
          )}
        </div>
      </div>
    </div>
  );
}
