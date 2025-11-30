import SearchBarStyles from "./lugares.module.css";
import { Link, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/img6.jpg";

function Cards({ lugares, user, onDelete }) {
  const navigate = useNavigate();

  const getImageUrl = (lugar) => {
    if (lugar.imagen_url) {
      return lugar.imagen_url;
    }
    return defaultImage;
  };

  const handleDelete = (lugarId) => {
    // Llamar la función onDelete que viene del componente padre
    // Esta función debería abrir el modal y guardar el ID
    onDelete(lugarId);
  };

  return (
    <section className={SearchBarStyles.cardsSection}>
      <div className={SearchBarStyles.cardsContainer}>
        {user?.rol === "admin" && (
          <Link
            to="/admin/crear/lugar"
            className={`${SearchBarStyles.card} ${SearchBarStyles.createCard} ${SearchBarStyles.createLink}`}
            role="button"
          >
            <div className={SearchBarStyles.createContent}>
              <span className={SearchBarStyles.plusIcon}>＋</span>
              <h3>Crear nuevo lugar</h3>
            </div>
          </Link>
        )}

        {lugares.map((lugar) => (
          <div key={lugar.id} className={SearchBarStyles.card}>
            <img
              src={getImageUrl(lugar)}
              alt={lugar.nombre}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImage;
              }}
            />
            <div className={SearchBarStyles.cardContent}>
              <h3>{lugar.nombre}</h3>
              <p>{lugar.descripcion}</p>

              {user?.rol === "admin" ? (
                <div className={SearchBarStyles.adminButtons}>
                  <button
                    onClick={() => navigate(`/pages/lugares/${lugar.id}`)}
                    className={SearchBarStyles.editButton}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(lugar.id)}
                    className={SearchBarStyles.deleteButton}
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <Link to={`/lugares/${lugar.id}`}>
                  <button className={SearchBarStyles.detailsButton}>
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
