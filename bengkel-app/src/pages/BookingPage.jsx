import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBengkelById, postBooking } from "./HandleApi";
import Swal from "sweetalert2";
import "../styles/BookingPage.css"; // Import CSS eksternal

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bengkel, setBengkel] = useState(null);
  const [form, setForm] = useState({
    jenis_kendaraan: "",
    plat: "",
    keluhan: "",
  });
  const [loading, setLoading] = useState(true);

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      bengkel_id: id,
      status: "pending",
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

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!bengkel)
    return <div className="text-center mt-5">Bengkel tidak ditemukan.</div>;

  return (
    <div className="bookingpage-container container mt-5">
      <div className="bookingpage-card card shadow">
        <div className="card-body">
          <h2 className="bookingpage-title card-title mb-4">
            Booking Service di {bengkel?.nama || "Bengkel"}
          </h2>
          <div className="form-group mb-3">
            <form onSubmit={handleSubmit} className="bookingpage-form mt-5">
              <div className="mb-3">
                <label className="bookingpage-label form-label">
                  Jenis Kendaraan :
                </label>
                <input
                  type="text"
                  name="jenis_kendaraan"
                  className="bookingpage-input form-control"
                  value={form.jenis_kendaraan}
                  onChange={handleChange}
                  placeholder="Contoh: Motor, Mobil"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="bookingpage-label form-label">
                  Plat Nomor :
                </label>
                <input
                  type="text"
                  name="plat"
                  className="bookingpage-input form-control"
                  value={form.plat}
                  onChange={handleChange}
                  placeholder="Contoh: B 1234 ABC"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="bookingpage-label form-label">
                  Keluhan / Catatan :
                </label>
                <textarea
                  name="keluhan"
                  className="bookingpage-textarea form-control"
                  rows={4}
                  value={form.keluhan}
                  onChange={handleChange}
                  placeholder="Contoh: Ganti oli, rem bunyi, dll"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bookingpage-button btn btn-primary"
              >
                Kirim Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
