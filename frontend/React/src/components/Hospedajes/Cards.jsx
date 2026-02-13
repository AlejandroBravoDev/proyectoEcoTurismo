import React from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/img4.jpg";
import noImagen from "../../assets/noImage.jpg";
import { ChevronRight, MapPin, BedDouble } from "lucide-react";

function Cards({ hospedajes, user, onDelete }) {
  const navigate = useNavigate();

  return (
    <section className="w-full flex justify-center">
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 w-full max-w-[1400px] px-6">
        {user?.rol === "admin" && (
          <div className="flex justify-center w-full sm:w-[320px] md:w-[350px]">
            <Link
              to="/admin/crear/hospedaje"
              className="group flex flex-col justify-center items-center bg-[#f0fff1] rounded-[32px] border-2 border-dashed border-[#42702f] w-full min-h-[440px] transition-all hover:scale-[1.02] shadow-sm"
            >
              <div className="text-[#4b8236] text-center">
                <span className="text-6xl block mb-2">＋</span>
                <h3 className="text-xl font-bold uppercase">
                  Crear nuevo hospedaje
                </h3>
              </div>
            </Link>
          </div>
        )}

        {hospedajes.map((h) => (
          <div
            key={h.id}
            className="flex justify-center w-full sm:w-[320px] md:w-[350px]"
          >
            <div
              onClick={() => navigate(`/hospedajes/${h.id}`)}
              className="group cursor-pointer bg-white rounded-[32px] overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl transition-all duration-500 w-full"
            >
              <div className="relative h-64 overflow-hidden p-4">
                <img
                  src={h.imagen_url || noImagen}
                  alt={h.nombre}
                  className="w-full h-full object-cover rounded-[24px] group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-8 left-8 bg-[#20A217] text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-1 uppercase">
                  <BedDouble className="w-3.5 h-3.5" /> Estancia Premium
                </div>
              </div>

              <div className="p-6 pt-0">
                <h3 className="text-xl font-extrabold mb-1 text-slate-800 truncate uppercase">
                  {h.nombre}
                </h3>
                <p className="text-slate-500 text-sm flex items-start gap-1 mb-6 min-h-[40px] line-clamp-2 leading-relaxed">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#20A217] shrink-0" />{" "}
                  {h.ubicacion}
                </p>

                {user?.rol === "admin" ? (
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/pages/hospedajes/${h.id}`);
                      }}
                      className="text-[#20A217] text-sm font-bold"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(h.id);
                      }}
                      className="text-red-500 text-sm font-bold"
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[#20A217] text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ver Detalles <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Cards;
