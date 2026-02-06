import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React, { Suspense, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import MapaOverlay from "../components/mapa/mapaOverlay";
import Slider from "../components/slider";
import HomeHospedajes from "../components/homeHospedajes/index";
import styles from "../components/mapa/mapaOverlay.module.css";
import axios from "axios";

const LazyMapaRisaralda = React.lazy(
  () => import("../components/mapa/mapaRisaralda"),
);

const API_BASE = "http://localhost:8000";

function App() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [sitiosRisaralda, setSitiosRisaralda] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetPlace, setTargetPlace] = useState(null);
  const [searchError, setSearchError] = useState(null);

  const mapOpacityClass = isOverlayVisible ? styles.opaco : styles.visibleMap;

  const cargarLugares = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/lugares`);
      const lugaresConCoords = response.data
        .map((lugar) => {
          if (lugar.coordenadas) {
            const [lat, lng] = lugar.coordenadas
              .split(",")
              .map((c) => parseFloat(c.trim()));
            if (!isNaN(lat) && !isNaN(lng)) {
              return {
                ...lugar,
                latitud: lat,
                longitud: lng,
                imagen: lugar.imagen_url || "",
                info: lugar.descripcion,
                ubicacionTexto:
                  lugar.ubicacion ||
                  lugar.municipio ||
                  "Ubicación no disponible",
              };
            }
          }
          return null;
        })
        .filter((lugar) => lugar !== null);

      setSitiosRisaralda(lugaresConCoords);
    } catch (err) {
      console.error("Error al cargar los lugares en el Home:", err);
    }
  };

  useEffect(() => {
    cargarLugares();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.toLowerCase().trim();
    setSearchError(null);

    if (!query) {
      setSearchError("Por favor, ingrese un término de búsqueda.");
      return;
    }

    const foundPlace = sitiosRisaralda.find(
      (sitio) =>
        sitio.nombre.toLowerCase().includes(query) ||
        (sitio.info && sitio.info.toLowerCase().includes(query)) ||
        sitio.ubicacionTexto.toLowerCase().includes(query),
    );

    if (foundPlace) {
      setIsOverlayVisible(false);
      setTargetPlace(foundPlace);
      setSearchTerm("");
    } else {
      setSearchError(
        `No se encontró ningún lugar que coincida con "${searchTerm}".`,
      );
    }
  };

  const handleOverlayClick = () => {
    setIsOverlayVisible(false);
  };

  return (
    <div className="app">
            <Header />     
      <div
        className={styles.mapContainerWrapper}
        style={{
          height: "600px",
          position: "relative",
        }}
      >
               
        <MapaOverlay
          isVisible={isOverlayVisible}
          onClick={handleOverlayClick}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          searchError={searchError}
        />
               
        <div className={`${styles.mapWrapper} ${mapOpacityClass}`}>
                   
          <Suspense fallback={<div>Cargando mapa...</div>}>
            <LazyMapaRisaralda
              targetPlace={targetPlace}
              setTargetPlace={setTargetPlace}
              sitiosRisaralda={sitiosRisaralda}
            />{" "}
               
          </Suspense>
               
        </div>
      </div>
            <Slider />
            <HomeHospedajes />
            <Footer />   
    </div>
  );
}

export default App;
