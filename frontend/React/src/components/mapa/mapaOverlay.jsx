import React from "react";
import styles from "./mapaOverlay.module.css";

const MapaOverlay = ({
  isVisible,
  onClick,
  searchTerm,
  setSearchTerm,
  handleSearch,
  searchError,
}) => {
  const visibleMap = isVisible ? styles.visible : styles.hiddenOverlay;
  const overlayClasses = `${styles.mapOverlay} ${visibleMap}`;

  return (
    <div className={overlayClasses} onClick={isVisible ? onClick : null}>
      {isVisible ? (
        <div className={styles.overlayContent}>
          <h1>
            ¡BIENVENIDO A{" "}
            <span className={styles.titleOverlay}>ECO TURISMO RISARALDA!</span>
          </h1>
          <p>Haz clic para navegar por el mapa.</p>
        </div>
      ) : (
        <div className={styles.searchBarContainer}>
          <h2 style={{ marginBottom: "5px" }}>
            BUSCA TUS SITIOS <span>ECO TURISTICOS</span> FAVORITOS DE RISARALDA
          </h2>
          <p>
            Aquí los podrás filtrar para encontrar fácilmente la ubicación del
            lugar o si lo deseas simplemente podrás navegar por nuestro mapa.
          </p>
          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <input
                type="search"
                placeholder="Escribe el nombre o una palabra clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "70%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "8px 15px",
                  marginLeft: "10px",
                  backgroundColor: "#4b8236",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Buscar
              </button>
            </div>

            {searchError && (
              <div
                style={{
                  color: "#d9534f",
                  marginTop: "10px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {searchError}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
export default MapaOverlay;
