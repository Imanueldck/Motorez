import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/detailbengkel.css";
import customMarker from "../assets/location.png";
import { getBengkelById, getAllBengkel } from "./HandleApi";

// Custom icon
const customIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function BengkelDetail() {
  const { id } = useParams();
  const [bengkel, setBengkel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rekomendasi, setRekomendasi] = useState([]);

  useEffect(() => {
    const fetchBengkel = async () => {
      try {
        const data = await getBengkelById(id);
        setBengkel(data);
      } catch (error) {
        console.error("Gagal memuat data bengkel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBengkel();
  }, [id]); // Hanya memanggil fetchBengkel saat ID berubah

  useEffect(() => {
    const fetchRekomendasi = async () => {
      if (!bengkel) return; // Tunggu data bengkel utama

      try {
        const all = await getAllBengkel(bengkel.lat, bengkel.long);
        const filtered = all.filter((item) => item.id !== id);
        setRekomendasi(filtered.slice(0, 3)); // Ambil 3 rekomendasi
      } catch (error) {
        console.error("Gagal memuat rekomendasi:", error);
      }
    };

    if (bengkel) fetchRekomendasi();
  }, [bengkel, id]); // Memanggil fetchRekomendasi saat bengkel sudah ada
  const openNavigation = (lat, long) => {
    const url = `https://www.google.com/maps?q=${lat},${long}`;
    window.open(url, "_blank"); // Membuka Google Maps di tab baru
  };

  if (loading) return <p>Loading...</p>;
  if (!bengkel) return <p>Bengkel tidak ditemukan.</p>;

  return (
    <>
      {/* Detail Bengkel */}
      <div className="bengkeldetail-container">
        <Link
          to="/caribengkel"
          className="btn btn-secondary"
          style={{ marginBottom: "1rem" }}
        >
          &larr; Kembali
        </Link>

        <div className="bengkeldetail-header">
          <div className="bengkel-image">
            <img src={bengkel.image || "/placeholder.jpg"} alt={bengkel.nama} />
          </div>
          <div className="bengkel-info">
            <h2>{bengkel.nama}</h2>
            <p>
              <strong>Deskripsi:</strong> {bengkel.deskripsi}
            </p>
            <p>
              <strong>Jam Operasional:</strong> {bengkel.jam_buka} -{" "}
              {bengkel.jam_selesai}
            </p>
            <p>
              <strong>Alamat:</strong> {bengkel.alamat || "Tidak tersedia"}
            </p>
            <p>
              <strong>Kontak:</strong> {bengkel.telepon || "Tidak tersedia"}
            </p>
            <button
              onClick={() => openNavigation(bengkel.lat, bengkel.long)}
              className="btn btn-info"
              style={{ marginTop: "1rem" }}
            >
              Arahkan ke Bengkel
            </button>
          </div>
        </div>

        <div className="bengkeldetail-map">
          <MapContainer
            center={[bengkel.lat, bengkel.long]}
            zoom={20}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            <Marker position={[bengkel.lat, bengkel.long]} icon={customIcon}>
              <Popup>
                <strong>{bengkel.nama}</strong>
                <br />
                {bengkel.deskripsi}
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="service-button">
          <Link to={`/booking/${id}`} className="btn btn-primary">
            Ingin Service?
          </Link>
        </div>
      </div>

      {/* Rekomendasi Bengkel */}
      {/* Rekomendasi Bengkel */}
      <div className="rekomendasi-wrapper">
        <h3 className="rekomendasi-title">Rekomendasi Bengkel Lainnya</h3>
        <div className="rekomendasi-list">
          {rekomendasi.map((item) => (
            <Link
              to={`/bengkel/${item.id}`}
              key={item.id}
              className="rekomendasi-card"
            >
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.nama}
                className="rekomendasi-image"
              />
              <div className="rekomendasi-info">
                <h4>{item.nama}</h4>
                <p>{item.alamat}</p>
                <button
                  onClick={(e) => {
                    e.preventDefault(); // supaya tidak trigger <Link>
                    openNavigation(item.lat, item.long);
                  }}
                  className="btn btn-info"
                >
                  Arahkan ke Bengkel
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
