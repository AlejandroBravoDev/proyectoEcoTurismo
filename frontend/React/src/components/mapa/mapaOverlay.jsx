import React from "react";
import styles from "./mapaOverlay.module.css";

const MapaOverlay = ({ isVisible, onClick }) => {
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
          <h2>
            BUSCA TUS SITIOS <span>ECO TURISTICOS</span> FAVORITOS DE RISARALDA
          </h2>
          <p>
            Aqui los podras filtrar para encontrar facilmente la ubicacion del
            lugar o si lo deseas simplemente podras navegar por nuestro mapa
          </p>
          <div>
            <form>
              <input type="search" placeholder="Busca"></input>
              <button>Buscar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaOverlay;
