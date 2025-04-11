import { useState, useEffect } from "react";
import axios from "axios";
import L from "leaflet";
import "../styles/caribengkel.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import customMarker from "../assets/location.png"; // Gambar marker custom kamu

const customIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [32, 32], // Ukuran ikon
  iconAnchor: [16, 32], // Titik yang menempel di posisi koordinat
  popupAnchor: [0, -32], // Posisi popup relatif terhadap ikon
});

export default function CariBengkel() {
  const [searchLocation, setSearchLocation] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lokasi pengguna (dummy)
    const dummyLat = -6.984383;
    const dummyLng = 110.409871;
    setUserLocation({ latitude: dummyLat, longitude: dummyLng });

    // Data bengkel dummy
    const dummyWorkshops = [
      {
        id: 1,
        name: "Bengkel Motor Jaya",
        address: "Jl. Diponegoro No.123",
        latitude: -6.984383,
        longitude: 110.409871,
      },
      {
        id: 2,
        name: "Bengkel Yamaha Sejahtera",
        address: "Jl. Imam Bonjol No.77 Jakarta",
        latitude: -6.98219,
        longitude: 110.414321,
      },
      {
        id: 3,
        name: "Bengkel Honda Hebat",
        address: "Jl. Gajah Mada No.45 Semarang",
        latitude: -6.9865,
        longitude: 110.4075,
      },
    ];

    // Simulasikan set data dari backend
    setWorkshops(dummyWorkshops);
  }, []);

  // Filter berdasarkan pencarian manual (input teks)
  const filteredWorkshops = workshops.filter((bengkel) => bengkel.address.toLowerCase().includes(searchLocation.toLowerCase()));

  return (
    <div className="caribengkel-container">
      {/* Hero Section */}
      <section className="caribengkel-hero">
        <h1>Cari Bengkel Berdasarkan Lokasi</h1>
        <p>Masukkan lokasi untuk menemukan bengkel terdekat.</p>

        {/* Lokasi Pengguna */}
        {userLocation.latitude && userLocation.longitude ? (
          <p>
            Lokasi Anda: {userLocation.latitude}, {userLocation.longitude}
          </p>
        ) : (
          <p>{error ? `Error: ${error}` : "Mendeteksi lokasi..."}</p>
        )}

        {/* Input pencarian */}
        <div className="caribengkel-search">
          <input type="text" placeholder="Masukkan lokasi..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
        </div>
      </section>

      {/* Peta */}
      {userLocation.latitude && userLocation.longitude && (
        <div className="caribengkel-map">
          <MapContainer center={[userLocation.latitude, userLocation.longitude]} zoom={14} style={{ height: "400px", width: "100%" }}>
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Marker Pengguna */}
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={customIcon}>
              <Popup>Lokasi Anda Sekarang</Popup>
            </Marker>

            {/* Marker Bengkel */}
            {filteredWorkshops.map((bengkel) => (
              <Marker key={bengkel.id} position={[bengkel.latitude, bengkel.longitude]} icon={customIcon}>
                <Popup>
                  <strong>{bengkel.name}</strong>
                  <br />
                  {bengkel.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Daftar Bengkel */}
      <div className="caribengkel-list">
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map((bengkel) => (
            <div key={bengkel.id} className="caribengkel-card">
              <h3>{bengkel.name}</h3>
              <p>{bengkel.address}</p>
            </div>
          ))
        ) : (
          <p className="caribengkel-notfound">Bengkel tidak ditemukan di lokasi tersebut.</p>
        )}
      </div>
    </div>
  );
}
