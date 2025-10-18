import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./mapaOverlay.module.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";
import MapaOverlay from "./MapaOverlay";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const API_BASE = "http://localhost:8000";
const RISARALDA_CENTER = [4.815, -75.69];
const RISARALDA_BOUNDS = [
  [2.0, -78.0],
  [8.0, -74.0],
];
const GreenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const truncateText = (text, maxLength) => {
  if (!text) return "Sin descripción.";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

function MapController({ targetPlace, setTargetPlace }) {
  const map = useMap();

  useEffect(() => {
    if (targetPlace) {
      map.flyTo([targetPlace.latitud, targetPlace.longitud], 14, {
        duration: 1.5,
      });
      setTimeout(() => setTargetPlace(null), 1500);
    }
  }, [targetPlace, map, setTargetPlace]);

  return null;
}
// ==========================================================

function MapaRisaralda() {
  const [sitiosRisaralda, setSitiosRisaralda] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [targetPlace, setTargetPlace] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const position = RISARALDA_CENTER;
  const zoomLevel = 9;
  const toggleOverlay = () => {
    setIsOverlayVisible(false);
  };

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
        sitio.ubicacionTexto.toLowerCase().includes(query)
    );

    if (foundPlace) {
      setTargetPlace(foundPlace);
      setIsOverlayVisible(false);
      setSearchTerm("");
    } else {
      setSearchError(
        `No se encontró ningún lugar que coincida con "${searchTerm}".`
      );
    }
  };

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
              let imagenPrincipal = lugar.imagen_url || "";

              return {
                ...lugar,
                latitud: lat,
                longitud: lng,
                imagen: imagenPrincipal,
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
      setCargando(false);
    } catch (err) {
      console.error("Error al cargar los lugares:", err);
      setError("No se pudieron cargar los datos de los lugares.");
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarLugares();
  }, []);

  if (cargando) {
    return <div className={styles.loading}>Cargando mapa y lugares...</div>;
  }

  if (error && sitiosRisaralda.length === 0) {
    return (
      <div className={styles.error}>
        {error} (y no se encontraron lugares para mostrar)
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper}>
      <MapaOverlay
        isVisible={isOverlayVisible}
        onClick={toggleOverlay}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        searchError={searchError}
      />
      <MapContainer
        center={position}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        maxBounds={RISARALDA_BOUNDS}
        minZoom={8}
        maxZoom={18}
        className={styles.mapContainer}
      >
        <MapController
          targetPlace={targetPlace}
          setTargetPlace={setTargetPlace}
        />

        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sitiosRisaralda.map((sitio) => (
          <Marker
            key={sitio.id}
            position={[sitio.latitud, sitio.longitud]}
            icon={GreenIcon}
          >
            <Popup>
              <div className={styles.popupCard}>
                {sitio.imagen ? (
                  <img
                    src={sitio.imagen}
                    alt={sitio.nombre}
                    className={styles.cardImagen}
                  />
                ) : (
                  <div className={styles.placeholderDiv}>
                    Imagen no disponible
                  </div>
                )}

                <h4 className={styles.cardTitulo}>{sitio.nombre}</h4>

                <p className={styles.cardDescripcion}>
                  {truncateText(sitio.info, 120)}
                </p>
                <div className={styles.cardCiudad}>
                  <FaMapMarkerAlt className={styles.iconoUbicacion} />
                  <span>{truncateText(sitio.ubicacionTexto, 25)}</span>
                </div>

                <a href={`/sitio/${sitio.id}`} className={styles.cardBoton}>
                  Ver detalles
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapaRisaralda;
