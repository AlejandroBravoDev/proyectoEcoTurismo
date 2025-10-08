import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./mapaOverlay.module.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

//marco los limites a risaralda

const RISARALDA_CENTER = [4.815, -75.69];
const RISARALDA_BOUNDS = [
  // coords
  [4.6, -76.2],
  [5.8, -75.4],
];

const sitiosRisaralda = [
  {
    id: 1,
    nombre: "Termales de Santa Rosa de Cabal",
    latitud: 4.8851,
    longitud: -75.5901,
    info: "Reconocidas por sus aguas termales naturales y la imponente cascada. Un lugar de relajación y bienestar en medio del Paisaje Cultural Cafetero.",
  },
  {
    id: 2,
    nombre: "Bioparque Ukumarí (Pereira)",
    latitud: 4.8016,
    longitud: -75.8123,
    info: "El parque de conservación de fauna más grande de América Latina, enfocado en la conservación de especies africanas y autóctonas.",
  },
  {
    id: 3,
    nombre: "SFF Otún Quimbaya (Pereira)",
    latitud: 4.708,
    longitud: -75.46,
    info: "Santuario de Fauna y Flora ideal para el senderismo y el avistamiento de aves, hogar de la pava caucana.",
  },
  {
    id: 4,
    nombre: "Parque Nacional Natural Los Nevados",
    latitud: 4.9,
    longitud: -75.35,
    info: "Ecosistemas de páramo y alta montaña, con acceso a la Laguna del Otún y rutas al Nevado Santa Isabel. Turismo de aventura y alta montaña.",
  },
  {
    id: 5,
    nombre: "Parque Nacional Natural Tatamá (Pueblo Rico)",
    latitud: 5.25,
    longitud: -76.0,
    info: "Una de las áreas mejor conservadas de la Cordillera Occidental. Ofrece senderos como Montezuma para observación especializada de aves.",
  },
  {
    id: 6,
    nombre: "Jardín Botánico de Marsella",
    latitud: 4.9366,
    longitud: -75.7391,
    info: "Ubicado en el hermoso municipio de Marsella, preserva la biodiversidad local y es un tranquilo lugar para el ecoturismo cultural.",
  },
  {
    id: 7,
    nombre: "Apía - Turismo Cafetero y Aventura",
    latitud: 5.15,
    longitud: -75.95,
    info: "Municipio con arquitectura típica del PCC. Ofrece pesca deportiva, parapente en el Cerro El Nudo, y experiencias inmersivas en el proceso del café.",
  },
  {
    id: 8,
    nombre: "Parque Regional Natural Alto del Nudo (Dosquebradas)",
    latitud: 4.85,
    longitud: -75.58,
    info: "Gran reserva natural compartida por varios municipios, ideal para el senderismo y la observación de la fauna y flora del bosque andino.",
  },
  {
    id: 9,
    nombre: "Truchera San Rafael (Santa Rosa de Cabal)",
    latitud: 4.9,
    longitud: -75.595,
    info: "Sitio popular para la pesca deportiva, cabalgatas y senderismo en medio de las montañas cafeteras, con alojamiento disponible.",
  },
  {
    id: 10,
    nombre: "Jardín Botánico de Pereira (UTP)",
    latitud: 4.793,
    longitud: -75.72,
    info: "Ubicado en la Universidad Tecnológica de Pereira. Un centro de investigación y conservación, perfecto para caminatas ecológicas y avistamiento.",
  },
  {
    id: 11,
    nombre: "Distrito Regional de Manejo Integrado Cuchilla del San Juan",
    latitud: 4.95,
    longitud: -75.9,
    info: "Área de gran importancia hídrica y de biodiversidad, que conecta varios ecosistemas. Ideal para el ecoturismo comunitario y la educación ambiental.",
  },
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

function MapaRisaralda() {
  const position = [4.815, -75.69];
  const zoomLevel = 9;

  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={zoomLevel}
      scrollWheelZoom={true}
      maxBounds={RISARALDA_BOUNDS} //LLamo mi constante
      minZoom={8} //Evita que el usuario se mueva por fuera de Risaralda
      maxZoom={18} //Pongo un zoom maximo
      style={{
        height: "600px",
        width: "100%",
      }}
    >
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
            <div className={styles.popup}>
              <h3>{sitio.nombre}</h3>
              <p>{sitio.info}</p>
              <a href={`/sitio/${sitio.id}`}>Ver más detalles</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapaRisaralda;
