import { useEffect, useState } from "react";
import { getAllBengkel } from "./HandleApi";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/caribengkel.css";
import customMarker from "../assets/location.png"; // Gambar marker custom

const customIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function Bengkel() {
  const [bengkels, setBengkels] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Ambil lokasi user
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Ambil data bengkel dari API
  useEffect(() => {
    const fetchData = async () => {
      if (!userPosition) return;

      try {
        const data = await getAllBengkel(userPosition[0], userPosition[1]);
        const filtered = data.filter((b) => b.status === 1);
        setBengkels(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userPosition]);

  const getAverageRating = (ulasan) => {
    if (!ulasan || ulasan.length === 0) return 0;
    const total = ulasan.reduce((sum, u) => sum + u.stars, 0);
    return total / ulasan.length;
  };

  const filteredBengkels = bengkels.filter((bengkel) => {
    const keyword = searchTerm.toLowerCase();
    return (
      bengkel.nama.toLowerCase().includes(keyword) ||
      (bengkel.alamat?.toLowerCase().includes(keyword) ?? false)
    );
  });

  return (
    <div className="caribengkel-container">
      {/* Hero Section dengan Search */}
      <div className="caribengkel-hero">
        <div className="caribengkel-content">
          <h1>Cari Bengkel Terdekat</h1>
          <p>
            Temukan bengkel motor terpercaya di sekitarmu. Cek detail
            dan lokasi sekarang juga!
          </p>
          <input
            type="text"
            placeholder="Cari nama atau alamat bengkel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-hero"
          />
        </div>
      </div>

      {/* Map Section */}
      <div
        className="map-container"
        style={{ height: "400px", margin: "2rem 0" }}
      >
        {userPosition && (
          <MapContainer
            center={userPosition}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />

            {/* Lokasi user */}
            <Marker position={userPosition}>
              <Popup>
                <strong>Posisi Anda Saat Ini</strong>
              </Popup>
            </Marker>

            {/* Marker hasil pencarian (atau semua jika kosong) */}
            {(searchTerm ? filteredBengkels : bengkels).map((bengkel) => (
              <Marker
                key={bengkel.id}
                position={[bengkel.lat, bengkel.long]}
                icon={customIcon}
              >
                <Popup>
                  <strong>{bengkel.nama}</strong>
                  <br />
                  {bengkel.deskripsi}
                  <br />
                  {bengkel.jam_buka} - {bengkel.jam_selesai}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Container Hasil Pencarian */}
      {searchTerm && filteredBengkels.length > 0 && (
        <div className="hasil-pencarian-container">
          <h4>Hasil Pencarian:</h4>
          <div className="daftarbengkel-card-container">
            {filteredBengkels.map((bengkel) => (
              <div
                key={bengkel.id}
                className="daftarbengkel-card"
                onClick={() => navigate(`/bengkel/${bengkel.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={bengkel.image || "/placeholder.jpg"}
                  alt={bengkel.nama}
                  className="daftarbengkel-image"
                />
                <div className="daftarbengkel-card-body">
                  <h5 className="daftarbengkel-title">{bengkel.nama}</h5>
                  <p className="mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={
                          star <= Math.round(bengkel.ulasan_avg_stars ?? 0)
                            ? "fas fa-star text-warning"
                            : "far fa-star text-warning"
                        }
                        style={{ marginRight: "2px" }}
                      ></i>
                    ))}
                    <span className="ms-1">
                      ({(bengkel.ulasan_avg_stars ?? 0).toFixed(1)})
                    </span>
                  </p>
                  <p>
                    <strong>Alamat:</strong> {bengkel.alamat}
                  </p>
                </div>
                <p>
                  <strong>Jarak:</strong> {bengkel.distance} meters
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daftar Bengkel Terdekat */}
      {!searchTerm && (
        <div className="daftarbengkel-container my-4">
          <h3 className="daftar-bengkel-judul">Daftar Bengkel Terdekat</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="daftarbengkel-card-container">
              {bengkels.map((bengkel) => {
                const avgRating = getAverageRating(bengkel.ulasan);
                return (
                  <div
                    key={bengkel.id}
                    className="daftarbengkel-card"
                    onClick={() => navigate(`/bengkel/${bengkel.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={bengkel.image || "/placeholder.jpg"}
                      alt={bengkel.nama}
                      className="daftarbengkel-image"
                    />
                   <div className="daftarbengkel-card-body">
                      <h5 className="daftarbengkel-title">{bengkel.nama}</h5>

                      {/* Rating */}
                      <p className="mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={
                              star <= Math.round(bengkel.ulasan_avg_stars ?? 0)
                                ? "fas fa-star text-warning"
                                : "far fa-star text-warning"
                            }
                            style={{ marginRight: "2px" }}
                          ></i>
                        ))}
                        <span className="ms-1">
                          ({(bengkel.ulasan_avg_stars ?? 0).toFixed(1)})
                        </span>
                      </p>

                      {/* Info Kiri (Alamat, Jam, Jarak) */}
                      <div className="daftarbengkel-info-list">
                        <p>
                          <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                          {bengkel.alamat}
                        </p>
                        <p>
                          <i className="fas fa-clock me-2 text-primary"></i>
                          {bengkel.jam_buka.slice(0, 5)} - {bengkel.jam_selesai.slice(0, 5)}
                        </p>
                        <p>
                          <i className="fas fa-location-arrow me-2 text-success"></i>
                          {bengkel.distance} meters
                        </p>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
