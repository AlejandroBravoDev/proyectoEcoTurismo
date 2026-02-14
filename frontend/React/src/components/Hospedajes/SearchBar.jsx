import React, { useState } from "react";
import styles from "./Hospedajes.module.css";

function SearchBar({ municipios, onSearchSubmit, onMunicipioChange, currentMunicipioId }) {
  const [localSearch, setLocalSearch] = useState("");

  const handleSearch = () => {
    onSearchSubmit(localSearch);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.searchContainer}>
        <h2>¿En dónde deseas hospedarte?</h2>
        <p>Descubre los mejores Hospedajes ecoturisticos de Risaralda</p>

        <div className={styles.searchFilters}>
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>

          <select
            className={styles.municipioSelect}
            value={currentMunicipioId}
            onChange={(e) => onMunicipioChange(Number(e.target.value))}
          >
            <option value={0}>Todos los Municipios</option>
            {municipios.map((municipio) => (
              <option key={municipio.id} value={municipio.id}>
                {municipio.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;