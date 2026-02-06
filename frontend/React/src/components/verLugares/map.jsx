import { map } from "leaflet";
import VerLugares from "./verLugares";
import { MapContainer, TileLayer, useMap,Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import styles from "./verLugares.module.css"
import { Container } from "postcss";

function Mapa({positions}) {
  console.log(positions);
  return (
    <>
      <MapContainer center={positions} zoom={13} scrollWheelZoom={false}  className={styles.leaflet_container}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={positions}>

        </Marker>
      </MapContainer>
      
    </>
  );
}

export default Mapa;
