import { useEffect, useState } from "react";
import { getAllBengkel } from "./HandleApi";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/caribengkel.css";
import customMarker from "../assets/location.png"; // Gambar marker custom

// Custom Icon untuk bengkel
const customIcon = new L.Icon({
  iconUrl: customMarker,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function Bengkel() {
  const [bengkels, setBengkels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState(null);
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

  // Ambil data bengkel
  useEffect(() => {
    const fetchData = async () => {
      if (!userPosition) return; // Tunggu sampai userPosition tersedia

      try {
        const data = await getAllBengkel(userPosition[0], userPosition[1]);
        setBengkels(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userPosition]);

  return (
    <div className="caribengkel-container">
      {/* Hero Section */}
      <div className="caribengkel-hero">
        <div className="caribengkel-content">
          <h1>Cari Bengkel Terdekat</h1>
          <p>
            Temukan bengkel motor dan mobil terpercaya di sekitarmu. Cek detail
            dan lokasi sekarang juga!
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div
        className="map-container"
        style={{ height: "400px", margin: "2rem 0" }}
      >
        {/* Render map hanya setelah posisi user tersedia */}
        {userPosition && (
          <MapContainer
            center={userPosition} // Posisi peta mengikuti lokasi user
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />

            {/* Marker lokasi user */}
            <Marker position={userPosition}>
              <Popup>
                <strong>Posisi Anda Saat Ini</strong>
              </Popup>
            </Marker>

            {/* Marker untuk setiap bengkel */}
            {bengkels.map((bengkel) => (
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

      {/* Card Daftar Bengkel */}
      <div className="card container">
        <div className="card-header">
          <h3 className="card-title">Daftar Bengkel</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Deskripsi</th>
                  <th>Jam Buka</th>
                  <th>Jam Tutup</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Distance</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {bengkels.map((bengkel) => (
                  <tr key={bengkel.id}>
                    <td>{bengkel.id}</td>
                    <td>{bengkel.nama}</td>
                    <td>{bengkel.deskripsi}</td>
                    <td>{bengkel.jam_buka}</td>
                    <td>{bengkel.jam_selesai}</td>
                    <td>{bengkel.lat}</td>
                    <td>{bengkel.long}</td>
                    <td>{bengkel.distance} meters</td>
                    <td>
                      <Link
                        to={`/bengkel/${bengkel.id}`}
                        className="btn btn-primary"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
