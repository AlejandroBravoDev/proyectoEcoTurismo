import SearchBarStyles from "./lugares.module.css";
import { Link } from "react-router-dom";
import defaultImage from "../../assets/img6.jpg";
function Cards({ lugares }) {
  const getImageUrl = (lugar) => {
    if (lugar.imagenes) {
      return lugar.imagenes;
    }
    return defaultImage;
  };

  return (
    <section className={SearchBarStyles.cardsSection}>
      <div className={SearchBarStyles.cardsContainer}>
        {lugares.map((lugar) => (
          <div key={lugar.id} className={SearchBarStyles.card}>
            <img src={getImageUrl(lugar)} alt={lugar.nombre} />
            <div className={SearchBarStyles.cardContent}>
              <h3>{lugar.nombre}</h3>
              <p>{lugar.descripcion}</p>
              <Link to={`/lugares/${lugar.id}`}>
                <button className={SearchBarStyles.detailsButton}>
                  Ver detalles
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Cards;
