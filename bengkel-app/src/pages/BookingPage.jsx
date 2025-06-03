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
  const [jamOptions, setJamOptions] = useState([]);

  const [form, setForm] = useState({
    nama_kendaraan: "",
    plat: "",
    keluhan: "",
    tgl_booking: "",
    jam_booking: "",
    jenis_layanan: "", // single select, jadi string id layanan
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

        if (data.jam_buka && data.jam_selesai) {
          const generated = generateJamOptions(data.jam_buka, data.jam_selesai);
          setJamOptions(generated);
        }
      } catch {
        Swal.fire("Error", "Gagal mengambil data bengkel", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBengkel();
  }, [id, navigate]);

  const generateJamOptions = (jamBuka, jamTutup) => {
    const options = [];
    const [startHour] = jamBuka.split(":").map(Number);
    const [endHour] = jamTutup.split(":").map(Number);

    for (let hour = startHour; hour < endHour; hour++) {
      const jam = hour.toString().padStart(2, "0") + ":00";
      options.push(jam);
    }
    return options;
  };

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

    const selectedDate = new Date(form.tgl_booking);
    const today = new Date();

    const isToday =
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate();

    if (isToday) {
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

    if (!form.jenis_layanan) {
      Swal.fire({
        icon: "warning",
        title: "Layanan belum dipilih",
        text: "Silakan pilih layanan terlebih dahulu.",
      });
      return;
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

  const formatDateTime = (date) => {
    const pad = (n) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const now = new Date();
  const minDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 jam
  const maxDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 hari

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!bengkel)
    return <div className="text-center mt-5">Bengkel tidak ditemukan.</div>;

  return (
    <div className="bookingpage-container">
      <div className="bookingpage-card">
        <div className="card-body">
          <h2 className="bookingpage-title">
            Booking Service di {bengkel?.nama || "Bengkel"}
          </h2>
          <form onSubmit={handleSubmit} className="bookingpage-form">
            <div className="mb-3">
              <label className="bookingpage-label">Nama Kendaraan</label>
              <input
                type="text"
                name="nama_kendaraan"
                className="bookingpage-input"
                value={form.nama_kendaraan}
                onChange={handleChange}
                placeholder="Contoh: Toyota Avanza"
                required
              />
            </div>

            <div className="mb-3">
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

            <div className="mb-3">
              <label className="bookingpage-label">Tanggal Booking</label>
              <input
                type="date"
                name="tgl_booking"
                className="bookingpage-input"
                value={form.tgl_booking}
                onChange={handleChange}
                min={formatDateTime(minDate).split("T")[0]}
                max={formatDateTime(maxDate).split("T")[0]}
                required
              />
            </div>

            <div className="mb-3">
              <label className="bookingpage-label">Jam Booking</label>
              <select
                className="bookingpage-input"
                name="jam_booking"
                value={form.jam_booking}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Jam --</option>
                {jamOptions.map((jam) => (
                  <option key={jam} value={jam}>
                    {jam}
                  </option>
                ))}
              </select>
            </div>

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
                    {item.nama} - Rp
                    {parseInt(item.harga).toLocaleString("id-ID")}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="bookingpage-button">
              Kirim Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
