import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "admin-lte/dist/css/adminlte.min.css";
import "admin-lte/dist/js/adminlte.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import KemitraanBengkel from "./pages/kemitraanbengkel";
import Kontak from "./pages/kontak";
import CariBengkel from "./pages/caribengkel";
import Footer from "./components/Footer";
import RegisterPelanggan from "./pages/RegisterPelanggan";
import RegisterPemilik from "./pages/RegisterPemilik";
import LoginPelanggan from "./pages/LoginPelanggan";
import LoginPemilik from "./pages/LoginPemilik";
import DashboardPemilik from "./pemilik/DashboardPemilik";
import Profile from "./components/Profile";
import "leaflet/dist/leaflet.css";
import BengkelDetail from "./pages/BengkelDetail";
import BookingPage from "./pages/bookingpage";
import RiwayatBooking from "./components/RiwayatBooking";

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/dashboard-pemilik");

  return (
    <div>
      {!hideHeaderFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/caribengkel" element={<CariBengkel />} />
        <Route path="/kemitraan" element={<KemitraanBengkel />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<h1>Contact Page</h1>} />
        <Route path="/register/pelanggan" element={<RegisterPelanggan />} />
        <Route path="/register/pemilik" element={<RegisterPemilik />} />
        <Route path="/login/pelanggan" element={<LoginPelanggan />} />
        <Route path="/login/pemilik" element={<LoginPemilik />} />
        <Route path="/dashboard-pemilik" element={<DashboardPemilik />} />
        <Route path="/bengkel/:id" element={<BengkelDetail />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/riwayat-booking" element={<RiwayatBooking />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
