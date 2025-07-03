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

    // Ambil semua id sparepart dari detail_servis
    const existingSparepartIds = booking.detail_servis
      .filter((item) => item.type === "sparepart" && item.sparepart)
      .map((item) => item.sparepart.id);

    setDetailServis(existingSparepartIds);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setStatusUpdate("");
    setDetailServis([]);
  };

  const handleServisChange = (index, sparepartId) => {
    const updated = [...detailServis];
    updated[index] = parseInt(sparepartId);
    setDetailServis(updated);
  };

  const addServisItem = () => {
    setDetailServis([...detailServis, ""]);
  };

  const handleDeleteServisItem = (index) => {
    const updated = [...detailServis];
    updated.splice(index, 1);
    setDetailServis(updated);
  };

  const handleSave = async () => {
    try {
      console.log(detailServis);

      await updateBookingStatus(selectedBooking.id, {
        status: statusUpdate,
        sparepart_ids: detailServis,
      });

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
                <p className="text-secondary">
                  <strong>Kendaraan:</strong>{" "}
                  {selectedBooking.jenis_kendaraan ||
                    selectedBooking.nama_kendaraan}
                </p>
                <p className="text-secondary">
                  <strong>Plat:</strong> {selectedBooking.plat}
                </p>
                <p className="text-secondary">
                  <strong>Keluhan:</strong> {selectedBooking.keluhan}
                </p>
                <p className="text-secondary">
                  <strong>Tanggal Booking:</strong>{" "}
                  {selectedBooking.tgl_booking
                    ? new Date(selectedBooking.tgl_booking).toLocaleDateString()
                    : "-"}
                </p>
                <p className="text-secondary">
                  <strong>Jam Booking:</strong>{" "}
                  {selectedBooking.jam_booking || "-"}
                </p>
                <p className="text-secondary">
                  <strong>Tanggal Ambil:</strong>{" "}
                  {selectedBooking.tgl_ambil
                    ? new Date(selectedBooking.tgl_ambil).toLocaleDateString()
                    : "-"}
                </p>
                <p className="text-secondary">
                  <strong>Jam Ambil:</strong> {selectedBooking.jam_ambil || "-"}
                </p>

                <div>
                  <strong className="text-secondary">
                    Jenis Layanan & Sparepart:
                  </strong>
                  {selectedBooking.detail_servis.length === 0 ? (
                    <p className="text-muted">
                      Tidak ada layanan atau sparepart.
                    </p>
                  ) : (
                    <table className="table table-bordered table-sm mt-2">
                      <thead className="table-light">
                        <tr>
                          <th>Tipe</th>
                          <th>Nama</th>
                          <th>Deskripsi</th>
                          <th>Harga</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBooking.detail_servis.map((item) => {
                          const nama =
                            item.layanan?.nama || item.sparepart?.nama || "-";
                          const deskripsi =
                            item.layanan?.deskripsi ||
                            item.sparepart?.deskripsi ||
                            "-";
                          const harga = parseInt(
                            item.layanan?.harga || item.sparepart?.harga || 0
                          );

                          return (
                            <tr key={item.id}>
                              <td>{item.type}</td>
                              <td>{nama}</td>
                              <td>{deskripsi}</td>
                              <td>Rp {harga.toLocaleString("id-ID")}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end fw-bold">
                            Total Harga
                          </td>
                          <td className="fw-bold text-success">
                            Rp{" "}
                            {selectedBooking.detail_servis
                              .reduce((total, item) => {
                                const harga = parseInt(
                                  item.layanan?.harga ||
                                    item.sparepart?.harga ||
                                    0
                                );
                                return total + harga;
                              }, 0)
                              .toLocaleString("id-ID")}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
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

                {parseInt(statusUpdate) >= 1 && (
                  <>
                    <h5 className="text-secondary">Tambah Sparepart</h5>
                    {detailServis.map((spId, index) => (
                      <div className="row mb-2" key={index}>
                        <div className="col-md-8">
                          <label className="form-label text-warning">
                            Sparepart
                          </label>
                          <select
                            className="form-control"
                            value={spId}
                            onChange={(e) =>
                              handleServisChange(index, e.target.value)
                            }
                          >
                            <option value="">-- Pilih Sparepart --</option>
                            {spareparts.map((sp) => (
                              <option key={sp.id} value={sp.id}>
                                {sp.nama} - Rp{" "}
                                {parseFloat(sp.harga).toLocaleString("id-ID")}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4 d-flex align-items-end">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteServisItem(index)}
                          >
                            Hapus
                          </button>
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
