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
  getBengkelById,
  getAllBengkel,
  getLayananByBengkelId,
} from "./HandleApi";

// Komponen untuk memaksa map merespon perubahan ukuran
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

// Custom icon
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
        const data = await getBengkelById(id);
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
        const data = await getLayananByBengkelId(id);
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

      <div className="detail-card mb-4">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={bengkel.image || "/placeholder.jpg"}
              className="detail-image"
              alt={bengkel.nama}
            />
          </div>
          <div className="col-md-8">
            <div className="detail-card-body">
              <h2 className="detail-title">{bengkel.nama}</h2>
              <p>
                <strong>Deskripsi:</strong> {bengkel.deskripsi}
              </p>
              <p>
                <strong>Jam Operasional:</strong> {bengkel.jam_buka} -{" "}
                {bengkel.jam_selesai}
              </p>
              <p>
                <strong>Alamat:</strong> {bengkel.alamat}
              </p>
              <p>
                <strong>Kontak:</strong> {bengkel.telepon}
              </p>
              <div className="text">
                <Link
                  to={`/booking/${id}`}
                  className="btn btn-primary detail-service-btn"
                >
                  Ingin Service?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3" id="bengkelTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "layanan" ? "active" : ""}`}
            id="layanan-tab"
            type="button"
            role="tab"
            onClick={() => setActiveTab("layanan")}
          >
            Layanan
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === "lokasi" ? "active" : ""}`}
            id="lokasi-tab"
            type="button"
            role="tab"
            onClick={() => setActiveTab("lokasi")}
          >
            Lokasi Bengkel
          </button>
        </li>
      </ul>

      <div className="tab-content" id="bengkelTabContent">
        {/* Tab Layanan */}
        <div
          className={`tab-pane fade ${
            activeTab === "layanan" ? "show active" : ""
          }`}
          id="layanan"
          role="tabpanel"
          aria-labelledby="layanan-tab"
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
          id="lokasi"
          role="tabpanel"
          aria-labelledby="lokasi-tab"
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
      </div>

      {/* Rekomendasi Bengkel */}
      <div className="mt-5">
        <h3>Rekomendasi Bengkel Lainnya</h3>
        <div className="row">
          {rekomendasi.map((item) => (
            <div className="col-md-4 mb-3" key={item.id}>
              <div
                className="detail-rekomendasi-card"
                onClick={() => goToDetail(item.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={item.image || "/placeholder.jpg"}
                  className="detail-rekomendasi-image"
                  alt={item.nama}
                />
                <div className="detail-rekomendasi-body">
                  <h5>{item.nama}</h5>
                  <p>{item.alamat}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // cegah klik card juga
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
