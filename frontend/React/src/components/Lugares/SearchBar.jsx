import React, { useState } from "react";
import SearchBarStyles from "./lugares.module.css";

function SearchBar({
  municipios,
  onSearchSubmit,
  onMunicipioChange,
  currentMunicipioId,
}) {
  console.log("SearchBar → municipios:", municipios);
  console.log("Es array?", Array.isArray(municipios));
  console.log(municipios)

  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchClick = () => {
    onSearchSubmit(searchText);
  };

  const handleMunicipioSelect = (e) => {
    const id = e.target.value === "" ? null : parseInt(e.target.value);
    onMunicipioChange(id);
  };

  return (
    <div className={SearchBarStyles.searchContainer}>
      <h2>¿A donde deseas ir?</h2>
      <p>Descubre los mejores lugares ecoturisticos de Risaralda</p>

      <div className={SearchBarStyles.searchFilters}>
        <div className={SearchBarStyles.searchInput}>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción"
            value={searchText}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearchClick();
            }}
          />
          <button onClick={handleSearchClick}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        <select
          className={SearchBarStyles.municipioSelect}
          onChange={handleMunicipioSelect}
          value={currentMunicipioId === null ? "" : currentMunicipioId}
        >
          <option value="">Municipios</option>
          {Array.isArray(municipios.data) &&
            municipios.data.map((municipio) => (
              <option key={municipio.id} value={municipio.id}>
                {municipio.nombre}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
