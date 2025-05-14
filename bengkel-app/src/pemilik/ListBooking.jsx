import { useEffect, useState } from "react";
import {
  getBooking,
  updateBookingStatus,
  getAllSpareparts,
} from "./HandleApi_owner";
import "./css/listpemilik.css";

export default function ListBooking() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [detailServis, setDetailServis] = useState([]);
  const [spareparts, setSpareparts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingData = await getBooking();
        const sparepartData = await getAllSpareparts();
        setBookings(bookingData);
        setSpareparts(sparepartData);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
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

  const handleServisChange = (index, value) => {
    const updated = [...detailServis];
    const selectedSp = spareparts.find((sp) => sp.nama === value);
    updated[index].sparepart = value;
    updated[index].harga_sparepart = selectedSp ? selectedSp.harga : 0;
    setDetailServis(updated);
  };

  const addServisItem = () => {
    setDetailServis([...detailServis, { sparepart: "", harga_sparepart: 0 }]);
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
                    <th>Status</th>
                    <th>Tanggal Booking</th>
                    <th>Jam Booking</th>
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
                        {booking.tgl_booking
                          ? new Date(booking.tgl_booking).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{booking.jam_booking || "-"}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => openModal(booking)}
                        >
                          Detail
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

      {/* Modal Detail */}
      {selectedBooking && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-primary">
                  Detail Booking: {selectedBooking.nama}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Kendaraan:</strong>{" "}
                  {selectedBooking.jenis_kendaraan ||
                    selectedBooking.nama_kendaraan}
                </p>
                <p>
                  <strong>Plat:</strong> {selectedBooking.plat}
                </p>
                <p>
                  <strong>Keluhan:</strong> {selectedBooking.keluhan}
                </p>
                <p>
                  <strong>Tanggal Booking:</strong>{" "}
                  {selectedBooking.tgl_booking
                    ? new Date(selectedBooking.tgl_booking).toLocaleDateString()
                    : "-"}
                </p>
                <p>
                  <strong>Jam Booking:</strong>{" "}
                  {selectedBooking.jam_booking || "-"}
                </p>
                <p>
                  <strong>Tanggal Ambil:</strong>{" "}
                  {selectedBooking.tgl_ambil
                    ? new Date(selectedBooking.tgl_ambil).toLocaleDateString()
                    : "-"}
                </p>
                <p>
                  <strong>Jam Ambil:</strong> {selectedBooking.jam_ambil || "-"}
                </p>
                <div>
                  <strong>Jenis Layanan:</strong>
                  {selectedBooking.jenis_layanan?.length > 0 ? (
                    <ul>
                      {selectedBooking.jenis_layanan.map((layanan, i) => (
                        <li key={i}>
                          {layanan.layanan} - Rp{" "}
                          {parseFloat(layanan.harga_layanan).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>-</p>
                  )}
                </div>

                <div className="mb-3 mt-3">
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

                {parseInt(statusUpdate) >= 2 && (
                  <>
                    <h5 className="text-info">Detail Servis</h5>
                    {detailServis.map((item, index) => (
                      <div className="row mb-2" key={index}>
                        <div className="col-md-8">
                          <label className="form-label text-warning">
                            Sparepart
                          </label>
                          <select
                            className="form-control"
                            value={item.sparepart}
                            onChange={(e) =>
                              handleServisChange(index, e.target.value)
                            }
                          >
                            <option value="">-- Pilih Sparepart --</option>
                            {spareparts.map((sp) => (
                              <option key={sp.id} value={sp.nama}>
                                {sp.nama} - Rp{" "}
                                {parseFloat(sp.harga).toLocaleString()}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    <button
                      className="btn btn-sm btn-secondary mt-2"
                      onClick={addServisItem}
                    >
                      + Tambah Sparepart
                    </button>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Tutup
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
