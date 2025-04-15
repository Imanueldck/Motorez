import { useState } from "react";
import "../styles/dashboardPemilik.css";
import ProfilePemilik from "./ProfilePemilik";
import ManageBengkel from "./ManageBengkel"; // Halaman untuk Tambah, Edit, Delete Bengkel

export default function DashboardPemilik() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

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
            onClick={() => setActivePage("profile")}
          >
            <i className="fas fa-user"></i>
            {isSidebarOpen && <span>Profil</span>}
          </button>

          <button className="nav-item-pemilik logout-pemilik">
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
        ) : (
          <ProfilePemilik />
        )}
      </div>
    </div>
  );
}
