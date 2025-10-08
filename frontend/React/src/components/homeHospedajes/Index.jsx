// src/components/homeHospedajes/index.jsx

import React, { useState } from "react";
import styles from "./HomeHospedajes.module.css";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpg";
import img5 from "../../assets/img5.jpg";

// --- 1. DATOS DEL SLIDER ---
const hospedajesData = [
  {
    id: 1,
    name: "Casa Luz Hospedaje Campestre",
    description:
      "Está a solo 5 minutos en auto del Bioparque Ucumari, lo que lo hace muy práctico si tu plan es visitar el parque temprano.",
    site: "Bioparque Ucumari",
    image: img4,
  },
  {
    id: 2,
    name: "Eco Cabañas El Paraíso",
    description:
      "Un retiro tranquilo con vistas a la montaña, ideal para visitar el majestuoso Santuario de Fauna y Flora.",
    site: "Santuario Otún Quimbaya",
    image: img3,
  },
  {
    id: 3,
    name: "Finca Turística La Aurora",
    description:
      "Ubicada muy cerca de las aguas termales y las cascadas, perfecta para una jornada de relajación y aventura.",
    site: "Termales de Santa Rosa",
    image: img5,
  },
];

function HomeHospedajes() {
  const [current, setCurrent] = useState(0);
  const length = hospedajesData.length;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(hospedajesData) || hospedajesData.length <= 0) {
    return null;
  }

  const currentHospedaje = hospedajesData[current];

  return (
    <section className={styles.hospedajesSection}>
      <div className={styles.textContainer}>
        <h2>También encontraras una gran variedad de hospedajes</h2>
        <p>
          Queremos brindarte la mejor información para que visita a cada sitio
          salga de la mejor manera por eso en cada sitio Ecoturístico
          encontraras diferentes hospedajes cercanos a la zona y las mejores
          recomendaciones.
        </p>
      </div>
      <div className={styles.sliderContainer}>
        <button
          className={`${styles.slideButton} ${styles.prev}`}
          onClick={prevSlide}
        >
          &#10094;
        </button>

        <div className={styles.cardContainer}>
          <div className={styles.hospedajeCard}>
            <img src={currentHospedaje.image} alt={currentHospedaje.name} />

            <div className={styles.overlay}>
              <div className={styles.overlayContent}>
                <h3 className={styles.cardTitle}>{currentHospedaje.name}</h3>

                <p className={styles.cardText}>
                  {currentHospedaje.description}
                </p>
                <p className={styles.cardSite}>
                  Cercano a: <strong>{currentHospedaje.site}</strong>
                </p>

                <button className={styles.detailButton}>Ver detalles</button>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`${styles.slideButton} ${styles.next}`}
          onClick={nextSlide}
        >
          &#10095;
        </button>
      </div>
    </section>
  );
}

export default HomeHospedajes;
