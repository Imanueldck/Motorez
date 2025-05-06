import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBengkelById, postBooking } from "./HandleApi";
import Swal from "sweetalert2";
import "../styles/BookingPage.css";

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bengkel, setBengkel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nama_kendaraan: "",
    plat: "",
    keluhan: "",
    tgl_booking: "",
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
      } catch {
        Swal.fire("Error", "Gagal mengambil data bengkel", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBengkel();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        text: error?.message || "Terjadi kesalahan saat melakukan booking",
      });
    }
  };

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
              <label className="bookingpage-label">Tanggal & Jam Booking</label>
              <input
                type="datetime-local"
                name="tgl_booking"
                className="bookingpage-input"
                value={form.tgl_booking}
                onChange={handleChange}
                required
              />
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
