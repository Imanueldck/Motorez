// ContactUs.jsx

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "../styles/kontak.css";

export default function Kontak() {
  return (
    <div className="kontak-container flex flex-col">
      {/* Hero Section */}
      <div className="kontak-hero relative bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="kontak-title text-4xl font-bold mb-4">Hubungi Kami</h1>
        <p className="kontak-subtitle text-lg max-w-2xl mx-auto">
          Punya pertanyaan, saran, atau butuh bantuan? Tim kami siap membantu
          Anda!
        </p>
        <div className="absolute inset-0 bg-blue-700 opacity-20 -z-10"></div>
      </div>

      {/* Info Kontak */}
      <div className="kontak-info bg-white py-12 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="kontak-info-item">
            <FaMapMarkerAlt className="mx-auto mb-2 text-blue-600 text-2xl" />
            <h3 className="kontak-info-title font-semibold text-lg">Alamat</h3>
            <p className="kontak-info-text text-gray-600">
              Jl. Teknologi No. 88, Jakarta
            </p>
          </div>
          <div className="kontak-info-item">
            <FaPhoneAlt className="mx-auto mb-2 text-blue-600 text-2xl" />
            <h3 className="kontak-info-title font-semibold text-lg">Telepon</h3>
            <p className="kontak-info-text text-gray-600">+62 812 3456 7890</p>
          </div>
          <div className="kontak-info-item">
            <FaEnvelope className="mx-auto mb-2 text-blue-600 text-2xl" />
            <h3 className="kontak-info-title font-semibold text-lg">Email</h3>
            <p className="kontak-info-text text-gray-600">
              support@bengkelkita.com
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="kontak-form-wrapper py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="kontak-form-title text-2xl font-semibold text-gray-800 mb-6">
            Kirim Pesan
          </h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Nama
              </label>
              <input
                type="text"
                className="kontak-input p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nama lengkap"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                className="kontak-input p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Email aktif"
              />
            </div>
            <div className="md:col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">
                Pesan
              </label>
              <textarea
                rows="5"
                className="kontak-input p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Tulis pesan Anda di sini..."
              ></textarea>
            </div>
            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                className="kontak-button bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Kirim Pesan
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Social Media */}
      <div className="kontak-sosmed bg-white py-10 text-center">
        <p className="text-gray-700 font-semibold mb-4">
          Ikuti kami di sosial media
        </p>
        <div className="flex justify-center gap-6 text-blue-600 text-xl">
          <a href="#" className="hover:text-blue-800">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-pink-500">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-sky-500">
            <FaTwitter />
          </a>
        </div>
      </div>
    </div>
  );
}
