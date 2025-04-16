import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/detailbengkel.css";
import customMarker from "../assets/location.png";
import { getBengkelById } from "./HandleApi";

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

  if (loading) return <p>Loading...</p>;
  if (!bengkel) return <p>Bengkel tidak ditemukan.</p>;

  return (
    <div className="bengkeldetail-container">
      <Link
        to="/caribengkel"
        className="btn btn-secondary"
        style={{ marginBottom: "1rem" }}
      >
        &larr; Kembali
      </Link>

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

      <div style={{ height: "300px", marginTop: "1rem" }}>
        <MapContainer
          center={[bengkel.lat, bengkel.long]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
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
    </div>
  );
}
