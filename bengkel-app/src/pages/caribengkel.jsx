import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/caribengkel.css"; // Pastikan file CSS ada di folder styles

export default function CariBengkel() {
  const [searchLocation, setSearchLocation] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  // Ambil lokasi pengguna saat halaman dimuat
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          // Opsi: Kirim lokasi ke backend untuk mencari bengkel terdekat
          axios
            .get(`https://api.example.com/bengkel?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
            .then((response) => {
              setWorkshops(response.data);
            })
            .catch((error) => {
              console.error("Error fetching workshops:", error);
            });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  }, []);

  // Filter bengkel berdasarkan input pencarian
  const filteredWorkshops = workshops.filter((bengkel) => bengkel.address.toLowerCase().includes(searchLocation.toLowerCase()));

  return (
    <div className="caribengkel-container">
      {/* Section Hero */}
      <section className="caribengkel-hero">
        <h1>Cari Bengkel Berdasarkan Lokasi</h1>
        <p>Masukkan lokasi untuk menemukan bengkel terdekat.</p>

        {/* Tampilkan lokasi pengguna jika tersedia */}
        {userLocation.latitude && userLocation.longitude ? (
          <p>
            Lokasi Anda: {userLocation.latitude}, {userLocation.longitude}
          </p>
        ) : (
          <p>{error ? `Error: ${error}` : "Mendeteksi lokasi..."}</p>
        )}

        {/* Search Bar */}
        <div className="caribengkel-search">
          <input type="text" placeholder="Masukkan lokasi..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} />
        </div>
      </section>

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
