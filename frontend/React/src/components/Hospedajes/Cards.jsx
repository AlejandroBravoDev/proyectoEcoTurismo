import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Hospedajes.module.css";
import defaultImage from "../../assets/img4.jpg";
import noImagen from "../../assets/noImage.jpg"
import { ChevronRight, MapPin } from "lucide-react";

function Cards({ hospedajes, user, onDelete }) {
  const navigate = useNavigate();

  const getImageUrl = (hospedaje) => {
    if (hospedaje.imagen_url) {
      return hospedaje.imagen_url;
    }
    return noImagen;
  };

  const handleDelete = (hospedajeId) => {
    onDelete(hospedajeId);
  };

  return (
    <section className="py-20 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center pt-5 px-20">
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
          <div
            key={hospedaje.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100  hover:shadow-2xl transition-all w-[90%] max-w-[360px] text-left animate-in fade-in slide-in-from-bottom-20 duration-1000 fill-mode-both "
          >
            <div className="relative h-72 overflow-hidden">
              <img
                src={getImageUrl(hospedaje)}
                alt={hospedaje.nombre}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 text-white"
              />
            </div>
            <div className="p-4 bg-white transition-colors">
              <h3 className="text-xl font-bold mb-1 text-black">
                {hospedaje.nombre}
              </h3>
              <p className="text-black  text-sm line-clamp-2 flex items-center gap-1 mb-3 ">
                <MapPin/> {hospedaje.ubicacion}
              </p>

              {user?.rol === "admin" ? (
                <div className="w-full pt-5 flex flex-row items-center justify-around ">
                  <button
                    onClick={() =>
                      navigate(`/pages/hospedajes/${hospedaje.id}`)
                    }
                    className="text-[#20A217] font-semibold hover:cursor-pointer flex items-center gap-1 group/btn"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(hospedaje.id)}
                    className="text-red-600 font-semibold hover:cursor-pointer flex items-center gap-1 group/btn"
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <Link to={`/hospedajes/${hospedaje.id}`}>
                    <button className="text-[#20A217] font-semibold hover:cursor-pointer flex items-center gap-1 group/btn">
                      Ver Detalles
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Cards;
