import React from "react";
import CountUp from "react-countup";
import "../../styles/counter.css";

const CounterBox = ({ iconClass, end, label }) => (
  <div className="counter-box">
    <div className="icon">
      <i className={iconClass}></i>
    </div>
    <h2 className="counter">
      <CountUp end={end} duration={5} />+
    </h2>
    <p>{label}</p>
  </div>
);

const Counter = () => {
  return (
    <section className="counter-section">
      <div className="container-counter">
        <div className="row-counter">
          <CounterBox
            iconClass="fas fa-users"
            end={1500}
            label="Pelanggan Puas"
          />
          <CounterBox
            iconClass="fas fa-motorcycle"
            end={50}
            label="Bengkel Terdaftar"
          />
          <CounterBox
            iconClass="fas fa-tools"
            end={120}
            label="Mekanik Aktif"
          />
        </div>
      </div>
    </section>
  );
};

export default Counter;
