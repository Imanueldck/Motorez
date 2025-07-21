// ...semua import tetap
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/detailbengkel.css";
import customMarker from "../assets/location.png";
import {
  getDetailBengkel,
  getAllBengkel,
  getLayananBengkel,
} from "./HandleApi";

// MapResizer
function MapResizer({ trigger }) {
  const map = useMap();
  useEffect(() => {
    if (trigger) {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }
  }, [trigger, map]);
  return null;
}

// Custom Marker
const customIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function BengkelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bengkel, setBengkel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [layanan, setLayanan] = useState([]);
  const [rekomendasi, setRekomendasi] = useState([]);
  const [activeTab, setActiveTab] = useState("layanan");

  useEffect(() => {
    const fetchBengkel = async () => {
      try {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const data = await getDetailBengkel(id, lat, long);
        setBengkel(data);
      } catch (error) {
        console.error("Gagal memuat data bengkel:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBengkel();
  }, [id]);

  useEffect(() => {
    const fetchRekomendasi = async () => {
      if (!bengkel) return;
      try {
        const all = await getAllBengkel(bengkel.lat, bengkel.long);
        const filtered = all.filter((item) => item.id !== id);
        setRekomendasi(filtered.slice(0, 3));
      } catch (error) {
        console.error("Gagal memuat rekomendasi:", error);
      }
    };
    if (bengkel) fetchRekomendasi();
  }, [bengkel, id]);

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const data = await getLayananBengkel(id);
        setLayanan(data);
      } catch (error) {
        console.error("Gagal memuat layanan:", error);
      }
    };
    if (bengkel) fetchLayanan();
  }, [bengkel, id]);

  const openNavigation = (lat, long) => {
    const url = `https://www.google.com/maps?q=${lat},${long}`;
    window.open(url, "_blank");
  };

  const goToDetail = (bengkelId) => {
    navigate(`/bengkel/${bengkelId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!bengkel) return <p>Bengkel tidak ditemukan.</p>;

  return (
    <div className="detail-container py-4">
      <Link to="/caribengkel" className="btn btn-secondary mb-3">
        &larr; Kembali
      </Link>

          {/* Kartu Informasi Bengkel */}
    <div className="card shadow-sm mb-5">
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={bengkel.image || "/placeholder.jpg"}
            className="img-fluid rounded-start h-100 object-fit-cover"
            alt={bengkel.nama}
          />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h2 className="fw-bold mb-2 text-primary">{bengkel.nama}</h2>
            <p className="mb-2"><strong>Deskripsi:</strong> {bengkel.deskripsi}</p>
            <p className="mb-2">
              <strong>Jam Operasional:</strong> 
              <span className="badge bg-success mx-2">{bengkel.jam_buka}</span> - 
              <span className="badge bg-danger mx-2">{bengkel.jam_selesai}</span>
            </p>
            <p className="mb-3"><strong>Alamat:</strong> {bengkel.alamat}</p>
           <Link to={`/booking/${id}`} className="btn-booking-service">
  <i className="fas fa-calendar-check me-2"></i> Ingin Service?
</Link>

          </div>
        </div>
      </div>
    </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3" id="bengkelTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "layanan" ? "active" : ""}`}
            onClick={() => setActiveTab("layanan")}
          >
            Layanan
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "lokasi" ? "active" : ""}`}
            onClick={() => setActiveTab("lokasi")}
          >
            Lokasi Bengkel
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "ulasan" ? "active" : ""}`}
            onClick={() => setActiveTab("ulasan")}
          >
            Ulasan
          </button>
        </li>
      </ul>

      <div className="tab-content" id="bengkelTabContent">
        {/* Tab Layanan */}
        <div
          className={`tab-pane fade ${
            activeTab === "layanan" ? "show active" : ""
          }`}
        >
          <h5>Daftar Layanan Tersedia:</h5>
          {layanan.length === 0 ? (
            <p>Tidak ada layanan tersedia.</p>
          ) : (
            <ul className="detail-layanan-list">
              {layanan.map((item) => (
                <li key={item.id}>
                  <strong>{item.nama}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tab Lokasi */}
        <div
          className={`tab-pane fade ${
            activeTab === "lokasi" ? "show active" : ""
          }`}
        >
          {bengkel.lat && bengkel.long && (
            <MapContainer
              center={[bengkel.lat, bengkel.long]}
              zoom={15}
              style={{ height: "300px", width: "100%" }}
              className="detail-map-container"
            >
              <MapResizer trigger={activeTab === "lokasi"} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[bengkel.lat, bengkel.long]} icon={customIcon}>
                <Popup>
                  <strong>{bengkel.nama}</strong>
                  <br />
                  {bengkel.deskripsi}
                </Popup>
              </Marker>
            </MapContainer>
          )}
          <div className="mt-3">
            <button
              onClick={() => openNavigation(bengkel.lat, bengkel.long)}
              className="btn detail-btn-info"
            >
              Arahkan ke Bengkel
            </button>
          </div>
        </div>

        {/* Tab Ulasan */}
        <div
          className={`tab-pane fade ${
            activeTab === "ulasan" ? "show active" : ""
          }`}
        >
          <h5>Ulasan Pelanggan:</h5>
          {!bengkel.ulasan || bengkel.ulasan.length === 0 ? (
            <p>Belum ada ulasan.</p>
          ) : (
            <ul className="list-group">
              {bengkel.ulasan.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex align-items-start"
                >
                  <img
                    src={item.user?.image || "/user-placeholder.jpg"}
                    alt="User"
                    className="rounded-circle me-3"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <strong>{item.user?.name || "Anonim"}</strong> -{" "}
                    <span>{Array(item.stars).fill("⭐").join("")}</span>
                    <p className="mb-1">{item.review}</p>
                    <small className="text-muted">
                      {new Date(item.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Rekomendasi */}
<div className="rekomendasi-bengkel">
  <h3>Rekomendasi Bengkel Lainnya</h3>
  <div className="row">
    {rekomendasi.map((item) => (
      <div className="col-md-4 mb-3" key={item.id}>
        <div
          className="rekomendasi-bengkel-card"
          onClick={() => goToDetail(item.id)}
          style={{ cursor: "pointer" }}
        >
          <img
            src={item.image || "/placeholder.jpg"}
            className="rekomendasi-bengkel-image"
            alt={item.nama}
          />
          <div className="rekomendasi-bengkel-body">
            <h5>{item.nama}</h5>
            <p>{item.alamat}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openNavigation(item.lat, item.long);
              }}
              className="btn detail-btn-info"
            >
              Arahkan ke Bengkel
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
