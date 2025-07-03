import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaWrench,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import "../styles/navbar.css";
import logo from "../image/logo.png";
import { logoutUser, getUserProfile } from "../pages/HandleApi";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isSidebarDropdownOpen, setIsSidebarDropdownOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

      <nav className="navbar-home">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Motorez Logo" className="logo-image" />
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
            <Link to="/kontak">Contact</Link>
          </li>
        </ul>

        <div className="navbar-auth">
          {isLoading ? (
            <span className="loading-text">Loading...</span>
          ) : user ? (
            <div className="dropdown-container" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="dropdown-button-custom"
              >
                <img
                  src={
                    user && user.image
                      ? user.image
                      : "/assets/img/user2-160x160.jpg"
                  }
                  className="user-image-custom"
                  alt="User"
                />
                <span className="user-name-custom">{user.name}</span>
                <svg
                  className="dropdown-icon"
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5.5 7l4.5 4.5L14.5 7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu-custom">
                  <Link
                    to="/profile"
                    className="dropdown-item-custom"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/riwayat-booking"
                    className="dropdown-item-custom"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Riwayat Booking
                  </Link>
                  <hr></hr>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                    className="dropdown-item-custom logout"
                  >
                    Logout
                  </button>
                </div>
              )}
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
            <Link to="/kontak" onClick={toggleSidebar}>
              Contact
            </Link>
          </li>
          {isLoading ? null : user ? (
            <li>
              <div className="navbar-user-area-side">
                <div
                  className="navbar-user dropdown-toggle"
                  onClick={() =>
                    setIsSidebarDropdownOpen(!isSidebarDropdownOpen)
                  }
                >
                  <FaUserCircle className="user-icon" />

                  <span>{user.name}</span>
                </div>

                {isSidebarDropdownOpen && (
                  <ul className="dropdown-sidebar-menu">
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => {
                          setIsSidebarDropdownOpen(false);
                          toggleSidebar();
                        }}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/riwayat-booking"
                        onClick={() => {
                          setIsSidebarDropdownOpen(false);
                          toggleSidebar();
                        }}
                      >
                        Riwayat Booking
                      </Link>
                    </li>
                    <li>
                      <button
                        className="logout-sidebar"
                        onClick={() => {
                          toggleSidebar();
                          handleLogout();
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </li>
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
          <div className="modal-contentt" onClick={(e) => e.stopPropagation()}>
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
