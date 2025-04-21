import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBengkelById } from "./HandleApi";

export default function BookingPage() {
  const { id } = useParams(); // ID bengkel dari URL
  const navigate = useNavigate();
  const [bengkel, setBengkel] = useState(null);
  const [form, setForm] = useState({
    tanggal: "",
    jam: "",
    keluhan: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBengkel = async () => {
      try {
        const data = await getBengkelById(id);
        setBengkel(data);
      } catch (error) {
        console.error("Gagal mengambil data bengkel:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBengkel();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Di sini kamu bisa kirim ke endpoint booking Laravel kamu
    const bookingData = {
      bengkel_id: id,
      ...form,
    };

    console.log("Booking data:", bookingData);

    // Simulasi sukses booking
    alert("Booking berhasil dikirim!");
    navigate("/caribengkel"); // Redirect ke halaman pencarian bengkel
  };

  if (loading) return <p>Loading...</p>;
  if (!bengkel) return <p>Bengkel tidak ditemukan.</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">
        Booking Service di {bengkel.nama}
      </h2>
      <p className="text-gray-600 mb-1">
        <strong>Alamat:</strong> {bengkel.alamat}
      </p>
      <p className="text-gray-600 mb-4">
        <strong>Jam Operasional:</strong> {bengkel.jam_buka} -{" "}
        {bengkel.jam_selesai}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Tanggal Service</label>
          <input
            type="date"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Jam Service</label>
          <input
            type="time"
            name="jam"
            value={form.jam}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Keluhan / Catatan</label>
          <textarea
            name="keluhan"
            value={form.keluhan}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded px-3 py-2"
            placeholder="Contoh: Ganti oli, suara mesin kasar, dsb."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Kirim Booking
        </button>
      </form>
    </div>
  );
}
