import { useState } from "react";
import "../styles/managebengkel.css";

export default function ManageBengkel() {
  const [bengkels, setBengkels] = useState([
    { id: 1, name: "Bengkel Motor Jaya", location: "Semarang" },
    { id: 2, name: "Bengkel Speed Power", location: "Bandung" },
  ]);
  const [newBengkel, setNewBengkel] = useState({ name: "", location: "" });

  const handleAddBengkel = () => {
    if (newBengkel.name && newBengkel.location) {
      setBengkels([...bengkels, { id: Date.now(), ...newBengkel }]);
      setNewBengkel({ name: "", location: "" });
    }
  };

  const handleDeleteBengkel = (id) => {
    setBengkels(bengkels.filter((bengkel) => bengkel.id !== id));
  };

  return (
    <div className="manage-bengkel-container">
      <h2>Kelola Bengkel</h2>
      <div className="bengkel-form">
        <input type="text" placeholder="Nama Bengkel" value={newBengkel.name} onChange={(e) => setNewBengkel({ ...newBengkel, name: e.target.value })} />
        <input type="text" placeholder="Lokasi" value={newBengkel.location} onChange={(e) => setNewBengkel({ ...newBengkel, location: e.target.value })} />
        <button onClick={handleAddBengkel}>Tambah Bengkel</button>
      </div>

      <div className="bengkel-list">
        {bengkels.map((bengkel) => (
          <div key={bengkel.id} className="bengkel-card">
            <h3>{bengkel.name}</h3>
            <p>{bengkel.location}</p>
            <button onClick={() => handleDeleteBengkel(bengkel.id)}>Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
