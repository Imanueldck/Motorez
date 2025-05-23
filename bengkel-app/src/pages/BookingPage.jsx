import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBengkelById,
  postBooking,
  getBooking,
  getLayananByBengkelId,
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
    jenis_layanan: [],
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
        const data = await getBengkelById(id);
        setBengkel(data);

        const layanan = await getLayananByBengkelId(id);
        setLayananOptions(layanan);

        // Generate jam booking dari jam buka dan tutup
        if (data.jam_buka && data.jam_selesai) {
          const generated = generateJamOptions(data.jam_buka, data.jam_selesai);
          setJamOptions(generated);
          console.log("Jam buka/tutup:", data.jam_buka, data.jam_selesai);
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "plat") {
      try {
        const response = await getBooking();
        const matched = response.find(
          (item) => item.plat.toLowerCase() === value.toLowerCase()
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
    }
  };

  const handleLayananChange = (e) => {
    const selected = layananOptions.find(
      (l) => l.id === parseInt(e.target.value)
    );
    if (selected) {
      const alreadySelected = form.jenis_layanan.find(
        (l) => l.layanan === selected.nama
      );
      if (!alreadySelected) {
        setForm((prev) => ({
          ...prev,
          jenis_layanan: [
            ...prev.jenis_layanan,
            {
              layanan: selected.nama,
              harga_layanan: selected.harga,
            },
          ],
        }));
      }
    }
  };
  const handleRemoveLayanan = (index) => {
    setForm((prev) => {
      const newLayanan = prev.jenis_layanan.filter((_, i) => i !== index);
      return { ...prev, jenis_layanan: newLayanan };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi jam jika tanggal booking adalah hari ini
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

    const bookingData = {
      bengkel_id: parseInt(id),
      status: 0,
      ...form,
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
        text: error || "Terjadi kesalahan saat melakukan booking",
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
                onChange={handleLayananChange}
              >
                <option value="">-- Pilih Layanan --</option>
                {layananOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nama} - Rp{parseInt(item.harga).toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            {form.jenis_layanan.length > 0 && (
              <div className="mb-3">
                <label className="bookingpage-label">
                  Layanan yang Dipilih:
                </label>
                <ul className="selected-services-list">
                  {form.jenis_layanan.map((item, index) => (
                    <li key={index}>
                      {item.layanan} - Rp
                      {parseInt(item.harga_layanan).toLocaleString()}
                      <button
                        type="button"
                        className="remove-service-button"
                        onClick={() => handleRemoveLayanan(index)}
                      >
                        Hapus
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button type="submit" className="bookingpage-button">
              Kirim Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
