import React, { useEffect } from "react";
import $ from "jquery";
import "admin-lte/dist/js/adminlte.min.js"; // Impor AdminLTE setelah jQuery

const DashboardPemilik = () => {
  useEffect(() => {
    // Pastikan AdminLTE sudah di-load
    if (window.AdminLTE) {
      window.AdminLTE.SidebarToggleHandler.call($(".main-sidebar"));
    }
  }, []);

  // Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login/pemilik";
  };

  return (
    <div className="wrapper">
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button">
              <i className="fas fa-bars"></i>
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a href="#" className="nav-link">
              Home
            </a>
          </li>
        </ul>

        {/* Tombol Logout */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button className="btn btn-danger" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        <a href="#" className="brand-link">
          <span className="brand-text font-weight-light">Dashboard Bengkel</span>
        </a>

        <div className="sidebar">
          <nav className="mt-2">
            <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
              <li className="nav-item">
                <a href="#" className="nav-link active">
                  <i className="nav-icon fas fa-tachometer-alt"></i>
                  <p>Dashboard</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-tools"></i>
                  <p>Kelola Layanan</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-users"></i>
                  <p>Daftar Pelanggan</p>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0">Dashboard Pemilik Bengkel</h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                  <div className="inner">
                    <h3>150</h3>
                    <p>Pesanan Baru</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>200</h3>
                    <p>Total Pelanggan</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-user"></i>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>20</h3>
                    <p>Layanan Aktif</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-cogs"></i>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h3>10</h3>
                    <p>Kritik & Saran</p>
                  </div>
                  <div className="icon">
                    <i className="fas fa-comments"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPemilik;
