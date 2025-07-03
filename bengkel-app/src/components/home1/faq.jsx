import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/faq.css";
import faq from "../../assets/faq.jpg";
const faqs = [
  {
    question: "Bagaimana cara menemukan bengkel terdekat?",
    answer:
      "Cukup masukkan lokasi Anda di kolom pencarian, dan sistem kami akan menampilkan bengkel terdekat dengan detailnya.",
  },
  {
    question: "Apakah layanan ini gratis?",
    answer:
      "Ya, Motorez menyediakan layanan pencarian bengkel secara gratis tanpa biaya tambahan.",
  },
  {
    question: "Bagaimana jika bengkel tidak sesuai dengan informasi?",
    answer:
      "Anda dapat melaporkan bengkel tersebut melalui fitur kontak kami untuk segera kami tindak lanjuti.",
  },
  {
    question: "Apakah Motorez tersedia di seluruh Indonesia?",
    answer:
      "Saat ini kami fokus di Kota Semarang, namun akan segera berkembang ke kota-kota lain di Indonesia.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      <div className="faq-wrapper">
        <div className="faq-title">
          <h2>Frequently Asked Questions</h2>
          <img className="faq-image" src={faq} alt="faq" />
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h4>{faq.question}</h4>
                {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </div>
              {activeIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
