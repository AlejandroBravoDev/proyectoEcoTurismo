import React from "react";
import styles from "./Hospedajes.module.css";
import Header from "../header";
import Footer from "../footer";
import fondoHospedajes from "../../assets/img4.jpg";
import imagenCard from "../../assets/img4.jpg";
import { Link } from "react-router-dom";

const hospedajesData = [
  {
    id: 1,
    nombre: "Casa Luz Hospedaje Campestre",
    descripcion:
      "Alberga más de 60 especies de fauna silvestre y exótica, con cerca de 200 individuos, en múltiples bioregiones.",
    imagen: imagenCard,
  },
  {
    id: 2,
    nombre: "Casa Luz Hospedaje Campestre",
    descripcion:
      "Alberga más de 60 especies de fauna silvestre y exótica, con cerca de 200 individuos, en múltiples bioregiones.",
    imagen: imagenCard,
  },
  {
    id: 3,
    nombre: "Casa Luz Hospedaje Campestre",
    descripcion:
      "Alberga más de 60 especies de fauna silvestre y exótica, con cerca de 200 individuos, en múltiples bioregiones.",
    imagen: imagenCard,
  },
];

function Hospedajes() {
  return (
    <>
      <Header />

      <div className={styles.mainContainer}>
        <div
          className={styles.heroSection}
          style={{ backgroundImage: `url(${fondoHospedajes})` }}
        >
          <div className={styles.searchContainer}>
            <h2>¿En dónde deseas hospedarte?</h2>
            <p>
              ¡Filtra los hospedajes más cercanos o tus sitios Ecoturísticos
              favoritos!
            </p>
            <div className={styles.searchFilters}>
              <div className={styles.searchInput}>
                <input type="text" placeholder="Buscar" />
                <button>
                  <i className="fas fa-search"></i> {/* Icono de lupa */}
                </button>
              </div>
              <div className={styles.filterButton}>
                Municipios <span>❯</span>
              </div>
              <div className={styles.filterButton}>
                Pueblos <span>❯</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.cardsSection}>
          <div className={styles.cardsContainer}>
            {hospedajesData.map((hospedaje) => (
              <div key={hospedaje.id} className={styles.card}>
                <img src={hospedaje.imagen} alt={hospedaje.nombre} />
                <div className={styles.cardContent}>
                  <h3>{hospedaje.nombre}</h3>
                  <p>{hospedaje.descripcion}</p>
                  <Link to="/verHospedajes">
                    <button className={styles.detailsButton}>
                      Ver detalles
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Hospedajes;
