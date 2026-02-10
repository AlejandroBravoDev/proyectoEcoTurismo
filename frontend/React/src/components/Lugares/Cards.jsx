import SearchBarStyles from "./lugares.module.css";
import { Link, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/img6.jpg";
import { Star, Leaf, MapPin, ChevronRight } from "lucide-react";

function Cards({ lugares, user, onDelete }) {
  const navigate = useNavigate();

  const getImageUrl = (lugar) => {
    if (lugar.imagen_url) {
      return lugar.imagen_url;
    }
    return defaultImage;
  };

  console.log(lugares);

  const handleDelete = (lugarId) => {
    // Llamar la función onDelete que viene del componente padre
    // Esta función debería abrir el modal y guardar el ID
    onDelete(lugarId);
  };

  return (
    <section className="py-20 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center pt-5 px-20">
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

        {/* CARD */}
        {lugares.map((lugar) => (
          <div
            key={lugar.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100  hover:shadow-2xl transition-all w-[90%] max-w-[360px] text-left animate-in fade-in slide-in-from-bottom-20 duration-1000 fill-mode-both"
          >
            <Link to={`/lugares/${lugar.id}`}>
              <div className="relative h-72 overflow-hidden">
                <img
                  src={getImageUrl(lugar)}
                  alt={lugar.nombre}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 text-white"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 scale-90 group-hover:scale-100 transition-transform">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {lugar.rating}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-[#20A217] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-bounce-slow">
                  <Leaf className="w-3 h-3" /> {lugar.category}
                </div>
              </div>
            </Link>
            <div className="p-4 bg-white transition-colors">
              <h3 className="text-xl font-bold mb-1 text-black">
                {lugar.nombre}
              </h3>
              <p className="text-black  text-sm flex items-center gap-1 mb-3">
                {" "}
                <MapPin className="w-4 h-4" /> {lugar.ubicacion}
              </p>

              {user?.rol === "admin" ? (
                <div className="w-full pt-5 flex flex-row items-center justify-around ">
                  <button
                    onClick={() => navigate(`/pages/lugares/${lugar.id}`)}
                    className="text-[#20A217] font-semibold hover:cursor-pointer flex items-center gap-1 group/btn"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(lugar.id)}
                    className="text-red-600 font-semibold hover:cursor-pointer flex items-center gap-1 group/btn"
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <Link to={`/lugares/${lugar.id}`}>
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
