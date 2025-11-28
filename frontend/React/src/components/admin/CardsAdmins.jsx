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
          <h3>Crear Lugar</h3>
          <p>Crea un lugar</p>
          <Link to="/admin/crear/lugares">
            <button className={adminStyles.button}>Crear lugar</button>
          </Link>
        </div>
        <div className={adminStyles.card}>
          <img src={img1} alt="" className={adminStyles.img} />
          <h3>Crear Hospedaje</h3>
          <p>Agregar un nuevo hospedaje</p>
          <Link to="/admin/crear/hospedaje">
            <button className={adminStyles.button}>Crear hospedaje</button>
          </Link>
        </div>
        <div className={adminStyles.card}>
          <img src={img1} alt="" className={adminStyles.img} />
          <h3>Crear Usuario</h3>
          <p>Agregar un nuevo usuario</p>
          <Link to="/admin/crear/usuario">
            <button className={adminStyles.button}>Crear usuario</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CardsAdmin;
