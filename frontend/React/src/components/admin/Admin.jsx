import adminStyles from "./admin.module.css";
import data from "../Lugares/municipios.json";
import React, { useState } from "react";
function Admin() {
  const [selected, setSelected] = useState(null);

  const handleChange = (e) => {
    const id = parseInt(e.target.value);
    const municipio = data.Municipios.find((m) => m.id === id);
    setSelected(municipio);
  };
  return (
    <>
      <div className={adminStyles.searchBarContainer}>
        <h1>Administra (Lugares, Usuarios u Hospedajes)</h1>
        <p>Descubre los mejores lugares ecoturisticos de Risaralda</p>

        <div className={adminStyles.searchBar}>
          <div className={adminStyles.searchInput}>
            <input type="text" placeholder="Buscar" />
            <button>
              <i className="fas fa-search"></i> {/* Icono de lupa */}
            </button>
          </div>
          <select
            onChange={handleChange}
            defaultValue=""
            className={adminStyles.filter}
          >
            <option value="" disabled>
              Municipios
            </option>
            {data.Municipios.map((muni) => (
              <option key={muni.id} value={muni.id}>
                {muni.nombre}
              </option>
            ))}
          </select>

          <select name="" id="" className={adminStyles.filter}>
            <option value="">Categorias</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default Admin;
