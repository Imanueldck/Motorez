import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDetailBengkel,
  postBooking,
  getBooking,
  getLayananBengkel,
} from "./HandleApi";
import Swal from "sweetalert2";
import "../styles/BookingPage.css";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bengkel, setBengkel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [layananOptions, setLayananOptions] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  const [form, setForm] = useState({
    nama_kendaraan: "",
    plat: "",
    keluhan: "",
    tgl_booking: "",
    jam_booking: "",
    jenis_layanan: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu untuk melakukan booking.",
      }).then(() => navigate("/login/pelanggan"));
      return;
    }

    const fetchBengkel = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const data = await getDetailBengkel(id, lat, long);
        setBengkel(data);

        const layanan = await getLayananBengkel(id);
        setLayananOptions(layanan);

        setAvailableDates(Object.keys(data.available_slots || {}));
      } catch {
        Swal.fire("Error", "Gagal mengambil data bengkel", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBengkel();
  }, [id, navigate]);

  useEffect(() => {
    if (bengkel && form.tgl_booking) {
      const slots = bengkel.available_slots[form.tgl_booking] || [];
      setAvailableTimes(slots);
      setForm((prev) => ({
        ...prev,
        jam_booking: "",
      }));
    }
  }, [form.tgl_booking, bengkel]);

  const checkPlat = async (platValue) => {
    try {
      const response = await getBooking();
      const matched = response.find(
        (item) => item.plat.toLowerCase() === platValue.toLowerCase()
      );
      if (matched) {
        setForm((prev) => ({
          ...prev,
          nama_kendaraan: matched.nama_kendaraan || "",
        }));
      }
    } catch (error) {
      console.error("Error checking plat:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "plat") {
      checkPlat(value);
    }
  };

  const handleLayananChange = (e) => {
    setForm((prev) => ({ ...prev, jenis_layanan: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.tgl_booking || !form.jam_booking) {
      Swal.fire({
        icon: "warning",
        title: "Tanggal/Jam belum dipilih",
        text: "Silakan pilih tanggal dan jam booking.",
      });
      return;
    }

    if (!form.jenis_layanan) {
      Swal.fire({
        icon: "warning",
        title: "Layanan belum dipilih",
        text: "Silakan pilih layanan terlebih dahulu.",
      });
      return;
    }

    const selectedDate = new Date(form.tgl_booking);
    const today = new Date();

    const isToday =
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate();

    if (isToday) {
      if (!form.jam_booking) return;

      const [jam, menit] = form.jam_booking.split(":").map(Number);
      const bookingDateTime = new Date();
      bookingDateTime.setHours(jam, menit, 0, 0);

      if (bookingDateTime <= today) {
        Swal.fire({
          icon: "warning",
          title: "Jam tidak valid",
          text: "Jam booking harus lebih dari waktu saat ini",
        });
        return;
      }
    }

    const bookingData = {
      bengkel_id: parseInt(id),
      status: 0,
      nama_kendaraan: form.nama_kendaraan,
      plat: form.plat,
      keluhan: form.keluhan,
      tgl_booking: form.tgl_booking,
      jam_booking: form.jam_booking,
      layanan_id: parseInt(form.jenis_layanan),
    };

    try {
      await postBooking(bookingData);
      await Swal.fire({
        icon: "success",
        title: "Booking Berhasil",
        text: "Booking kamu telah berhasil dikirim!",
      });
      navigate("/caribengkel");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Booking",
        text:
          error?.response?.data?.message ||
          "Terjadi kesalahan saat melakukan booking",
      });
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!bengkel)
    return <div className="text-center mt-5">Bengkel tidak ditemukan.</div>;

return (
  <div className="bookingpage-container">

    {/* Judul */}
    <h2 className="bookingpage-title mb-4">
      Booking Service di {bengkel?.nama || "Bengkel"}
    </h2>

    {/* Informasi Bengkel */}
    <div className="bookinginfo-card mb-4 shadow-sm">
      
        <div className="row align-items-start">
          {/* Kolom Kiri */}
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="bookinginfo-title mb-3">Informasi Bengkel</h5>
            <h4 className="bookinginfo-name mt-2 fw-bold">{bengkel.nama}</h4>
            <p className="bookinginfo-alamat">{bengkel.alamat}</p>
            <p className="bookinginfo-telp">{bengkel.no_hp}</p>
          </div>

          {/* Kolom Kanan */}
          <div className="col-md-6">
            <h5 className="bookinginfo-title2">www</h5>
            <p className="bookinginfo-rating mb-2">
              <i className="fas fa-star text-warning me-1"></i>
              {bengkel.ulasan?.length > 0
                ? (
                    bengkel.ulasan.reduce((acc, item) => acc + item.stars, 0) /
                    bengkel.ulasan.length
                  ).toFixed(1)
                : "0.0"}{" "}
              ({bengkel.ulasan?.length || 0} ulasan)
            </p>
            <p className="bookinginfo-desc text-muted">
              {bengkel.deskripsi || "Professional motorcycle service with experienced mechanics"}
            </p>
          </div>
        </div>
     
    </div>

    {/* Form Booking */}
    <div className="bookingpage-card shadow-sm">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="bookingpage-form">
          {/* Nama dan Plat */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="bookingpage-label">Plat Nomor</label>
              <input
                type="text"
                name="plat"
                className="bookingpage-input"
                value={form.plat}
                onChange={handleChange}
                placeholder="Contoh: B 1234 ABC"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="bookingpage-label">Nama Kendaraan</label>
              <input
                type="text"
                name="nama_kendaraan"
                className="bookingpage-input"
                value={form.nama_kendaraan}
                onChange={handleChange}
                placeholder="Contoh: Honda Beat"
                required
              />
            </div>
          </div>

          {/* Keluhan */}
          <div className="mb-3">
            <label className="bookingpage-label">Keluhan / Catatan</label>
            <textarea
              name="keluhan"
              className="bookingpage-textarea"
              rows={4}
              value={form.keluhan}
              onChange={handleChange}
              placeholder="Contoh: Ganti oli, rem bunyi, dll"
              required
            ></textarea>
          </div>

          {/* Tanggal & Jam Booking */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="bookingpage-label">Tanggal Booking</label>
              <select
                name="tgl_booking"
                className="form-control"
                value={form.tgl_booking}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Tanggal --</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="bookingpage-label">Jam Booking</label>
              <select
                name="jam_booking"
                className="form-control"
                value={form.jam_booking}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Jam --</option>
                {availableTimes.map((slot) => (
                  <option key={slot.jam} value={slot.jam}>
                    {slot.jam} - {slot.jumlah_booking} booking
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Layanan */}
          <div className="mb-3">
            <label className="bookingpage-label">Pilih Layanan</label>
            <select
              className="bookingpage-input"
              name="jenis_layanan"
              value={form.jenis_layanan}
              onChange={handleLayananChange}
              required
            >
              <option value="">-- Pilih Layanan --</option>
              {layananOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama} - Rp{parseInt(item.harga).toLocaleString("id-ID")}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="bookingpage-button w-100 mt-3">
            Kirim Booking
          </button>
        </form>
      </div>
    </div>

  </div>
);


}
