import { useState } from "react";
import "./css/dashboardPemilik.css";
import ProfilePemilik from "./profilePemilik";
import ManageBengkel from "./ManageBengkel";
import ManageLayanan from "./ManageLayanan";
import ManageSperpart from "./ManageSperpart";
import ListBooking from "./ListBooking";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./HandleApi_owner"; // Impor logoutUser

export default function DashboardPemilik() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk handle logout
  const handleLogout = async () => {
    try {
      await logoutUser(); // Panggil fungsi logout
      navigate("/login/pemilik"); // Arahkan ke halaman login setelah logout
    } catch (err) {
      console.error("Logout error:", err); // Jika ada error, tampilkan di console
    }
  };

  return (
    <div className="dashboard-pemilik-container">
      {/* Sidebar */}
      <div
        className={`sidebar-pemilik ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <button
          className="toggle-btn-pemilik"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <div className="nav-buttons-pemilik">
          <button
            className="nav-item-pemilik"
            onClick={() => setActivePage("dashboard")}
          >
            <i className="fas fa-home"></i>
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          <button
            className="nav-item-pemilik"
            onClick={() => setActivePage("manageBengkel")}
          >
            <i className="fas fa-tools"></i>
            {isSidebarOpen && <span>Kelola Bengkel</span>}
          </button>
          <button
            className="nav-item-pemilik"
            onClick={() => setActivePage("manageLayanan")}
          >
            <i className="fas fa-cogs"></i>
            {isSidebarOpen && <span>Kelola Layanan</span>}
          </button>
          <button
            className="nav-item-pemilik"
            onClick={() => setActivePage("manageSperpart")}
          >
            <i className="fas fa-wrench"></i>
            {isSidebarOpen && <span>Kelola Sperpart</span>}
          </button>
          <button
            className="nav-item-pemilik"
            onClick={() => setActivePage("listBooking")}
          >
            <i className="fas fa-list"></i>
            {isSidebarOpen && <span>Daftar Booking</span>}
          </button>
          <button
            className="nav-item-pemilik"
            onClick={() => setActivePage("profile")}
          >
            <i className="fas fa-user"></i>
            {isSidebarOpen && <span>Profil</span>}
          </button>

          {/* Tombol logout */}
          <button
            className="nav-item-pemilik logout-pemilik"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            {isSidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`main-content-pemilik ${isSidebarOpen ? "open" : "closed"}`}
      >
        {activePage === "dashboard" ? (
          <>
            <h1 className="dashboard-title-pemilik">Dashboard Admin Bengkel</h1>
            <div className="stats-pemilik">
              <div className="stat-card-pemilik">Total Pelanggan: 120</div>
              <div className="stat-card-pemilik">Total Reservasi: 45</div>
              <div className="stat-card-pemilik">
                Pendapatan Bulan Ini: Rp 10.000.000
              </div>
            </div>
          </>
        ) : activePage === "manageBengkel" ? (
          <ManageBengkel />
        ) : activePage === "manageLayanan" ? (
          <ManageLayanan />
        ) : activePage === "manageSperpart" ? (
          <ManageSperpart />
        ) : activePage === "listBooking" ? (
          <ListBooking />
        ) : (
          <ProfilePemilik />
        )}
      </div>
    </div>
  );
}
