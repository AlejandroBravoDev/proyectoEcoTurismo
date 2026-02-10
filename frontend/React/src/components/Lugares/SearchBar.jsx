import React, { useState } from "react";
import SearchBarStyles from "./lugares.module.css";

function SearchBar({
  municipios,
  onSearchSubmit,
  onMunicipioChange,
  currentMunicipioId,
}) {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    onSearchSubmit(e.target.value);
  };

  return (
    <div className={SearchBarStyles.searchContainer}>
      <h2>¿A dónde deseas ir?</h2>
      <p>Descubre los mejores lugares ecoturísticos de Risaralda</p>
      <div className={SearchBarStyles.searchFilters}>
        <div className={SearchBarStyles.searchInput}>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchText}
            onChange={handleInputChange}
          />
        </div>
        <select
          className={SearchBarStyles.municipioSelect}
          value={currentMunicipioId || ""}
          onChange={(e) => onMunicipioChange(e.target.value)}
        >
          <option value="">Todos los Municipios</option>
          {Array.isArray(municipios?.data) &&
            municipios.data.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
