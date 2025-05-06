// src/components/ListBookingPemilik.jsx
import { useEffect, useState } from "react";
import { getBooking, updateBookingStatus } from "./HandleApi_owner";
import "./css/listpemilik.css";

export default function ListBooking() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [detailServis, setDetailServis] = useState([]);

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

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setStatusUpdate(booking.status);
    setDetailServis(booking.detail_servis || []);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setStatusUpdate("");
    setDetailServis([]);
  };

  const handleServisChange = (index, field, value) => {
    const updated = [...detailServis];
    updated[index][field] = field === "harga" ? parseInt(value) : value;
    setDetailServis(updated);
  };

  const addServisItem = () => {
    setDetailServis([...detailServis, { sparepart: "", harga: 0 }]);
  };

  const handleSave = async () => {
    try {
      if (parseInt(statusUpdate) < 2) {
        await updateBookingStatus(selectedBooking.id, { status: statusUpdate });
      } else {
        await updateBookingStatus(selectedBooking.id, {
          status: statusUpdate,
          detail_servis: detailServis,
        });
      }

      alert("Status dan detail servis diperbarui");
      const refreshed = await getBooking();
      setBookings(refreshed);
      closeModal();
    } catch (err) {
      console.error("Gagal memperbarui status:", err);
      alert("Terjadi kesalahan saat memperbarui.");
    }
  };

  return (
    <div className="list-booking-pemilik">
      <h2 className="list-booking-title">Daftar Booking</h2>
      <div className="list-booking-card">
        <div className="list-booking-card-body">
          {bookings.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Jenis Kendaraan</th>
                    <th>Plat</th>
                    <th>Keluhan</th>
                    <th>Status</th>
                    <th>Tanggal Booking</th>
                    <th>Tanggal Ambil</th>
                    <th>Detail Servis</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{booking.nama}</td>
                      <td>
                        {booking.jenis_kendaraan || booking.nama_kendaraan}
                      </td>
                      <td>{booking.plat}</td>
                      <td>{booking.keluhan}</td>
                      <td>
                        <span
                          className={`badge ${
                            booking.status === 0
                              ? "bg-warning"
                              : booking.status === 1
                              ? "bg-primary"
                              : booking.status === 2
                              ? "bg-info"
                              : "bg-success"
                          }`}
                        >
                          {
                            [
                              "Pending",
                              "Proses",
                              "Menunggu Diambil",
                              "Selesai",
                            ][booking.status]
                          }
                        </span>
                      </td>
                      <td>
                        {new Date(
                          booking.tgl_booking || booking.created_at
                        ).toLocaleString()}
                      </td>
                      <td>
                        {booking.tgl_ambil
                          ? new Date(booking.tgl_ambil).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        {booking.detail_servis?.length > 0 ? (
                          <>
                            <ul>
                              {booking.detail_servis.map((item, i) => (
                                <li key={i}>
                                  {item.sparepart} - Rp{" "}
                                  {item.harga.toLocaleString()}
                                </li>
                              ))}
                            </ul>
                            <strong>
                              Total: Rp{" "}
                              {booking.detail_servis
                                .reduce((sum, item) => sum + item.harga, 0)
                                .toLocaleString()}
                            </strong>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openModal(booking)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="list-booking-empty">Tidak ada data booking.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedBooking && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-primary">
                  Edit Booking: {selectedBooking.nama}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label text-success">Status</label>
                  <select
                    className="form-control"
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(parseInt(e.target.value))}
                  >
                    <option value={0}>Pending</option>
                    <option value={1}>Proses</option>
                    <option value={2}>Menunggu Diambil</option>
                    <option value={3}>Selesai</option>
                  </select>
                </div>

                <h5 className="text-info">Detail Servis</h5>
                {detailServis.map((item, index) => (
                  <div className="row mb-2" key={index}>
                    <div className="col-md-6">
                      <label className="form-label text-warning">
                        Sparepart
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Sparepart"
                        value={item.sparepart}
                        onChange={(e) =>
                          handleServisChange(index, "sparepart", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-warning">Harga</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Harga"
                        value={item.harga}
                        onChange={(e) =>
                          handleServisChange(index, "harga", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-sm btn-secondary mt-2"
                  onClick={addServisItem}
                >
                  + Tambah Sparepart
                </button>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Batal
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
