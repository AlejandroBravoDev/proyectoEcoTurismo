import React, { Suspense, useState } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import MapaOverlay from "../components/mapa/mapaOverlay";
import Slider from "../components/slider";
import HomeHospedajes from "../components/homeHospedajes/Index";
import styles from "../components/mapa/mapaOverlay.module.css";

const LazyMapaRisaralda = React.lazy(() =>
  import("../components/mapa/mapaRisaralda")
);

function App() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const handleOverlayClick = () => {
    setIsOverlayVisible(false);
  };

  const mapOpacityClass = isOverlayVisible ? styles.opaco : styles.visibleMap;

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
        />

        <div className={`${styles.mapWrapper} ${mapOpacityClass}`}>
          <Suspense fallback={<div>Cargando mapa...</div>}>
            <LazyMapaRisaralda />
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
