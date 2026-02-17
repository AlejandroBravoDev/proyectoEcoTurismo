import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/img6.jpg";
import noImagen from "../../assets/noImage.jpg";
import { Star, Leaf, MapPin, ChevronRight, Plus } from "lucide-react";

const Cards = React.memo(({ lugares: lugaresProps = [], user, onDelete }) => {
  const navigate = useNavigate();
  const [displayLugares, setDisplayLugares] = useState(() => {
    const cache = localStorage.getItem("lugares_cache");
    return cache ? JSON.parse(cache) : [];
  });

  useEffect(() => {
    if (lugaresProps && lugaresProps.length > 0) {
      setDisplayLugares(lugaresProps);
      localStorage.setItem("lugares_cache", JSON.stringify(lugaresProps));
    }
  }, [lugaresProps]);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate],
  );

  const onActionClick = useCallback((e, callback) => {
    e.stopPropagation();
    if (callback) callback();
  }, []);

  return (
    <section className="w-full flex justify-center py-6">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-10 w-full max-w-[1440px] px-4">
        {user?.rol === "admin" && (
          <div className="flex justify-center items-center w-full sm:w-[320px] lg:w-[350px]">
            <Link
              to="/admin/crear/lugar"
              className="group flex flex-col justify-center items-center bg-[#f8fff9] rounded-[32px] border-2 border-dashed border-[#42702f]/30 w-full min-h-[440px] transition-all duration-300 hover:bg-[#7ccf5c15] hover:border-[#42702f] hover:scale-[1.02] text-center shadow-sm"
            >
              <div className="text-[#4b8236] flex flex-col items-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Plus size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">
                  Crear nuevo lugar
                </h3>
              </div>
            </Link>
          </div>
        )}

        {displayLugares.map((lugar) => (
          <div
            key={lugar.id}
            className="flex justify-center w-full sm:w-[320px] lg:w-[350px]"
          >
            <article
              onClick={() => handleNavigate(`/lugares/${lugar.id}`)}
              className="group cursor-pointer bg-white rounded-[32px] overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl transition-all duration-500 w-full"
            >
              <div className="relative h-64 overflow-hidden p-4">
                <img
                  src={lugar.imagen_url || defaultImage}
                  alt={lugar.nombre}
                  loading="eager"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noImagen;
                  }}
                  className="w-full h-full object-cover rounded-[24px] group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm border border-white">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-xs font-black text-slate-900">
                    {lugar.rating || "0.0"}
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 bg-[#20A217] text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-1 uppercase tracking-widest shadow-lg">
                  <Leaf className="w-3.5 h-3.5" /> {lugar.category || "General"}
                </div>
              </div>

              <div className="p-6 pt-0">
                <h3 className="text-xl font-extrabold mb-1 text-slate-800 truncate uppercase tracking-tight">
                  {lugar.nombre}
                </h3>

                <div className="text-slate-500 text-sm flex items-start gap-1 mb-6 min-h-[40px] leading-relaxed">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#20A217] shrink-0" />
                  <p className="line-clamp-2">{lugar.ubicacion}</p>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  {user?.rol === "admin" ? (
                    <div className="flex justify-between items-center">
                      <button
                        onClick={(e) =>
                          onActionClick(e, () =>
                            handleNavigate(`/pages/lugares/${lugar.id}`),
                          )
                        }
                        className="text-[#20A217] text-sm font-extrabold hover:bg-green-50 px-4 py-2 rounded-xl transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) =>
                          onActionClick(e, () => {
                            if (window.confirm("¿Eliminar este lugar?"))
                              onDelete(lugar.id);
                          })
                        }
                        className="text-red-500 text-sm font-extrabold hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group/btn">
                      <span className="text-[#20A217] text-sm font-bold flex items-center gap-1 group-hover/btn:translate-x-1 transition-transform">
                        Ver Detalles
                        <ChevronRight className="w-4 h-4" />
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
});

Cards.displayName = "Cards";

export default Cards;
