import { Link, useNavigate } from "react-router-dom";
import defaultImage from "../../assets/img6.jpg";
import noImagen from "../../assets/noImage.jpg";
import { Star, Leaf, MapPin, ChevronRight } from "lucide-react";

function Cards({ lugares, user, onDelete }) {
  const navigate = useNavigate();

  const getImageUrl = (lugar) => {
    return lugar.imagen_url || defaultImage;
  };

  const handleDelete = (e, lugarId) => {
    e.stopPropagation();
    onDelete(lugarId);
  };

  const handleEdit = (e, lugarId) => {
    e.stopPropagation();
    navigate(`/pages/lugares/${lugarId}`);
  };

  return (
    <section className="w-full flex justify-center">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-10 w-full max-w-[1440px] px-4">
        {user?.rol === "admin" && (
          <div className="flex justify-center items-center w-full sm:w-[320px] lg:w-[350px]">
            <Link
              to="/admin/crear/lugar"
              className="group flex flex-col justify-center items-center bg-[#f0fff1] rounded-[32px] border-2 border-dashed border-[#42702f] w-full min-h-[440px] transition-all duration-300 hover:bg-[#7ccf5c3c] hover:scale-[1.02] text-center no-underline shadow-sm"
            >
              <div className="text-[#4b8236]">
                <span className="text-6xl block mb-2 font-light">＋</span>
                <h3 className="text-xl font-bold uppercase tracking-tight">
                  Crear nuevo lugar
                </h3>
              </div>
            </Link>
          </div>
        )}

        {lugares.map((lugar) => (
          <div
            key={lugar.id}
            className="flex justify-center w-full sm:w-[320px] lg:w-[350px]"
          >
            <div
              onClick={() => navigate(`/lugares/${lugar.id}`)}
              className="group cursor-pointer bg-white rounded-[32px] overflow-hidden shadow-md border border-slate-100 hover:shadow-2xl transition-all duration-500 w-full text-left animate-in fade-in slide-in-from-bottom-10"
            >
              <div className="relative h-64 overflow-hidden p-4">
                <img
                  src={getImageUrl(lugar) || noImagen}
                  alt={lugar.nombre}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noImagen;
                  }}
                  className="w-full h-full object-cover rounded-[24px] group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-xs font-black text-slate-900">
                    {lugar.rating || "0.0"}
                  </span>
                </div>

                <div className="absolute bottom-8 left-8 bg-[#20A217] text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-1 uppercase tracking-widest">
                  <Leaf className="w-3.5 h-3.5" /> {lugar.category || "General"}
                </div>
              </div>

              <div className="p-6 pt-0">
                <h3 className="text-xl font-extrabold mb-1 text-slate-800 truncate uppercase">
                  {lugar.nombre}
                </h3>

                <p className="text-slate-500 text-sm flex items-start gap-1 mb-6 min-h-[40px] line-clamp-2 leading-relaxed">
                  <MapPin className="w-4 h-4 mt-0.5 text-[#20A217] shrink-0" />
                  {lugar.ubicacion}
                </p>

                {user?.rol === "admin" ? (
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <button
                      onClick={(e) => handleEdit(e, lugar.id)}
                      className="text-[#20A217] text-sm font-bold hover:bg-[#20A217]/5 px-4 py-2 rounded-xl transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, lugar.id)}
                      className="text-red-500 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[#20A217] text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ver Detalles
                      <ChevronRight className="w-4 h-4" />
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
