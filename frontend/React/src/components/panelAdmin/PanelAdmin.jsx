import imgHospedajes from "../../assets/img4.jpg";
import imgLugares from "../../assets/img1.jpg";
import imgUsuarios from "../../assets/img6.jpg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

function PanelAdmin() {
  return (
    <div className="flex-col justify-center items-center w-screen">
      <h1 className="text-center text-4xl bold text-amber-300">
        Panel Administrativo
      </h1>
      <div className="cardsContainer">
        <div className="cardHospedajes">
          <img src={imgHospedajes} alt="" />
          <h4>Hospedajes</h4>
          <Link to="/adminHospedajes">
            <button>Administrar Hospedajes</button>
          </Link>
        </div>
        <div className="cardLugares">
          <img src={imgLugares} alt="" />
          <h4>Lugares</h4>
          <Link to="/adminLugares">
            <button>Administrar Lugares</button>
          </Link>
        </div>
        <div className="cardUsuarios">
          <img src={imgUsuarios} alt="" />
          <h4>Usuarios</h4>
          <Link to="/adminUsuarios">
            <button>Administrar Usuarios</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PanelAdmin;
