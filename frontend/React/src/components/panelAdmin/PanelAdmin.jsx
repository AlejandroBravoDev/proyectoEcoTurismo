import imgHospedajes from "../../assets/img4.jpg";
import imgLugares from "../../assets/img1.jpg";
import imgUsuarios from "../../assets/img6.jpg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import "./tailwind.css";

function PanelAdmin() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center text-4xl font-medium pt-10">
        Panel Administrativo
      </h1>
      <div className="flex flex-wrap justify-center items-center pt-20 pb-20 gap-15">
        <div className="flex items-center justify-evenly flex-col w-100 h-110 shadow-xl  pr-8 pl-8 rounded-md bg-[#f9f9f9]">
          <img src={imgHospedajes} alt="" className="rounded-lg" />
          <h4 className="text-xl font-bold">Hospedajes</h4>
          <Link to="/adminHospedajes">
            <button className="pl-8 pr-8 pt-2 pb-2 rounded-2xl text-white bg-[#4b8236]">
              Administrar Hospedajes
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-evenly flex-col w-100 h-110 shadow-xl  pr-8 pl-8 rounded-md bg-[#f9f9f9]">
          <img src={imgLugares} alt="" className="rounded-lg" />
          <h4 className="text-xl font-bold">Lugares</h4>
          <Link to="/Lugares">
            <button className="pl-8 pr-8 pt-2 pb-2 rounded-2xl text-white bg-[#4b8236]">
              Administrar Lugares
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-evenly flex-col w-100 h-110 shadow-xl  pr-8 pl-8 rounded-md bg-[#f9f9f9]">
          <img src={imgUsuarios} alt="" className="rounded-lg" />
          <h4 className="text-xl font-bold">Usuarios</h4>
          <Link to="/adminUsuarios">
            <button className="pl-8 pr-8 pt-2 pb-2 rounded-2xl text-white bg-[#4b8236]">
              Administrar Usuarios
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PanelAdmin;
