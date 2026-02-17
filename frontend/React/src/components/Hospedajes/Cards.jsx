import React, { useCallback, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import noImagen from "../../assets/noImage.jpg";
import { ChevronRight, MapPin, BedDouble, Plus } from "lucide-react";

const Cards = React.memo(
  ({ hospedajes: hospedajesProps = [], user, onDelete }) => {
    const navigate = useNavigate();
    const [displayHospedajes, setDisplayHospedajes] = useState(() => {
      const cache = localStorage.getItem("hospedajes_cache");
      return cache ? JSON.parse(cache) : [];
    });

    useEffect(() => {
      if (hospedajesProps && hospedajesProps.length > 0) {
        setDisplayHospedajes(hospedajesProps);
        localStorage.setItem(
          "hospedajes_cache",
          JSON.stringify(hospedajesProps),
        );
      }
    }, [hospedajesProps]);

    const handleCardClick = useCallback(
      (id) => {
        navigate(`/hospedajes/${id}`);
      },
      [navigate],
    );

    return (
      <section className="w-full flex justify-center py-8">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 w-full max-w-[1400px] px-6">
          {user?.rol === "admin" && (
            <div className="flex justify-center w-full sm:w-[320px] md:w-[350px]">
              <Link
                to="/admin/crear/hospedaje"
                className="group flex flex-col justify-center items-center bg-green-50/50 rounded-[32px] border-2 border-dashed border-green-700/30 w-full min-h-[440px] transition-all hover:scale-[1.02] hover:bg-green-50 shadow-sm"
              >
                <div className="text-green-800 text-center">
                  <div className="bg-green-100 p-4 rounded-full inline-block mb-4 group-hover:bg-green-200 transition-colors">
                    <Plus size={40} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide">
                    Crear nuevo hospedaje
                  </h3>
                </div>
              </Link>
            </div>
          )}

          {displayHospedajes.map((h) => (
            <div
              key={h.id}
              className="flex justify-center w-full sm:w-[320px] md:w-[350px]"
            >
              <article
                onClick={() => handleCardClick(h.id)}
                className="group cursor-pointer bg-white rounded-[32px] overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl transition-all duration-500 w-full"
              >
                <div className="relative h-64 overflow-hidden p-4">
                  <img
                    src={h.imagen_url || noImagen}
                    alt={h.nombre}
                    loading="eager"
                    className="w-full h-full object-cover rounded-[24px] group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-8 left-8 bg-[#20A217] text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-1 uppercase shadow-lg">
                    <BedDouble className="w-3.5 h-3.5" /> Estancia Premium
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <h3 className="text-xl font-extrabold mb-1 text-slate-800 truncate uppercase tracking-tight">
                    {h.nombre}
                  </h3>
                  <div className="text-slate-500 text-sm flex items-start gap-1 mb-6 min-h-[40px] leading-relaxed">
                    <MapPin className="w-4 h-4 mt-0.5 text-[#20A217] shrink-0" />
                    <span className="line-clamp-2">{h.ubicacion}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    {user?.rol === "admin" ? (
                      <div className="flex justify-between items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/pages/hospedajes/${h.id}`);
                          }}
                          className="text-[#20A217] hover:text-green-700 text-sm font-bold transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(h.id);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-[#20A217] text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Ver Detalles <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>
    );
  },
);

Cards.displayName = "CardsHospedajes";

export default Cards;
