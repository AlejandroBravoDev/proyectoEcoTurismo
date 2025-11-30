import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Hospedajes.module.css";
import defaultImage from "../../assets/img4.jpg";

function Cards({ hospedajes, user, onDelete }) {
  const navigate = useNavigate();

  const getImageUrl = (hospedaje) => {
    if (hospedaje.imagen_url) {
      return hospedaje.imagen_url;
    }
    return defaultImage;
  };

  const handleDelete = (hospedajeId) => {
    onDelete(hospedajeId);
  };

  return (
    <section className={styles.cardsSection}>
      <div className={styles.cardsContainer}>
        {user?.rol === "admin" && (
          <Link
            to="/admin/crear/hospedaje"
            className={`${styles.card} ${styles.createCard} ${styles.createLink}`}
            role="button"
          >
            <div className={styles.createContent}>
              <span className={styles.plusIcon}>＋</span>
              <h3>Crear nuevo hospedaje</h3>
            </div>
          </Link>
        )}

        {hospedajes.map((hospedaje) => (
          <div key={hospedaje.id} className={styles.card}>
            <img
              src={getImageUrl(hospedaje)}
              alt={hospedaje.nombre}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
            <div className={styles.cardContent}>
              <h3>{hospedaje.nombre}</h3>
              <p>{hospedaje.descripcion}</p>

              {user?.rol === "admin" ? (
                <div className={styles.adminButtons}>
                  <button
                    onClick={() => navigate(`/pages/hospedajes/${hospedaje.id}`)}
                    className={styles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(hospedaje.id)}
                    className={styles.deleteButton}
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <Link to={`/hospedajes/${hospedaje.id}`}>
                  <button className={styles.detailsButton}>
                    Ver detalles
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Cards;