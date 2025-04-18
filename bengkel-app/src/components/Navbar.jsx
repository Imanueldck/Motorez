import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaWrench,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/navbar.css";
import { logoutUser, getUserProfile } from "../pages/HandleApi";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const userData = await getUserProfile();
      setUser(userData);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <div className="top-bar">
        <div className="contact-info">
          <span>📞 +62 812-3456-7890</span>
          <span>✉️ info@motorez.com</span>
        </div>
      </div>

      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <FaWrench /> Motorez
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/caribengkel">Temukan Bengkel</Link>
          </li>
          <li>
            <Link to="/kemitraan">Kemitraan Bengkel</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

        <div className="navbar-auth">
          {isLoading ? (
            <span className="loading-text">Loading...</span>
          ) : user ? (
            <div className="profile-menu">
              <Link to="/profile" className="profile-link">
                <FaUserCircle className="profile-icon" />
                <span className="profile-name">{user.name}</span>
              </Link>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="auth-btn" onClick={toggleModal}>
              <FaUser /> Masuk / Daftar
            </button>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>
          <FaTimes />
        </button>
        <ul>
          <li>
            <Link to="/" onClick={toggleSidebar}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/caribengkel" onClick={toggleSidebar}>
              Temukan Bengkel
            </Link>
          </li>
          <li>
            <Link to="/kemitraan" onClick={toggleSidebar}>
              Kemitraan Bengkel
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={toggleSidebar}>
              Contact
            </Link>
          </li>
          {isLoading ? null : user ? (
            <>
              <li className="sidebar-user">
                <FaUserCircle className="sidebar-icon" />
                <span>{user.name}</span>
              </li>
              <li>
                <button
                  className="logout-btn"
                  onClick={() => {
                    toggleSidebar();
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button className="auth-btn" onClick={toggleModal}>
                Masuk / Daftar
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleModal}>
              <FaTimes />
            </button>
            <h2>Masuk Sebagai</h2>
            <p>Pilih jenis akun untuk login</p>
            <div className="login-options">
              <Link
                to="/login/pelanggan"
                className="login-option pelanggan"
                onClick={toggleModal}
              >
                <FaUser />
                <span>Pelanggan</span>
              </Link>
              <Link
                to="/login/pemilik"
                className="login-option bengkel"
                onClick={toggleModal}
              >
                <FaWrench />
                <span>Pemilik Bengkel</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
