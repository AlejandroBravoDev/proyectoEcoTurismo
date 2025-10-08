import adminStyles from "./admin.module.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import img1 from "../../assets/img1.jpg";

function CardsAdmin() {
  return (
    <section className={adminStyles.cardsSection}>
      <div className={adminStyles.cardsContainer}>
        <div className={adminStyles.card}>
          <img src={img1} alt="" className={adminStyles.img} />
          <h3>Crear</h3>
          <p>Crea un lugar</p>
          <Link to="/crearLugar">
            <button className={adminStyles.button}>Crear lugar</button>
          </Link>
        </div>
        <div className={adminStyles.card}>
          <img src={img1} alt="" className={adminStyles.img} />
          <h3>Titulo</h3>
          <p>Lorem ipsum dolor dicta. Porro fuga saepe corporis</p>
          <Link to="/verLugares">
            <button className={adminStyles.button}>Editar</button>
          </Link>
          <button
            className={adminStyles.button}
            style={{ backgroundColor: "red" }}
          >
            Eliminar
          </button>
        </div>
        <div className={adminStyles.card}>
          <img src={img1} alt="" className={adminStyles.img} />
          <h3>Titulo</h3>
          <p>Lorem ipsum dolor dicta. Porro fuga saepe corporis</p>
          <Link to="/verLugares">
            <button className={adminStyles.button}>Editar</button>
          </Link>
          <button
            className={adminStyles.button}
            style={{ backgroundColor: "red" }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </section>
  );
}

export default CardsAdmin;
