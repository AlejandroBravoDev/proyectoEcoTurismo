import React, { useState } from "react";
import SearchBarStyles from "./lugares.module.css";
import data from "./municipios.json"; // Importamos el JSON

function SelectorMunicipios() {
  const [selected, setSelected] = useState(null);

  const handleChange = (e) => {
    const id = parseInt(e.target.value);
    const municipio = data.Municipios.find((m) => m.id === id);
    setSelected(municipio);
  };

  return (
    <div className={SearchBarStyles.searchBarContainer}>
      <h1>¿A donde deseas ir?</h1>
      <p>Descubre los mejores lugares ecoturisticos de Risaralda</p>

      <div className={SearchBarStyles.searchBar}>
        <div className={SearchBarStyles.searchInput}>
          <input type="text" placeholder="Buscar" />
          <button>
            <i className="fas fa-search"></i> {/* Icono de lupa */}
          </button>
        </div>
        <select
          onChange={handleChange}
          defaultValue=""
          className={SearchBarStyles.filter}
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

        <select name="" id="" className={SearchBarStyles.filter}>
          <option value="">Categorias</option>
        </select>
      </div>
    </div>
  );
}

export default SelectorMunicipios;
