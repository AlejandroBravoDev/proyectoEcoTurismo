import React from "react";
import { Link } from "react-router-dom";
import fondoPrincipal from "../assets/portadaProyecto.jpg";
import fondoPrincipal2 from "../assets/portadaProyecto2.jpg";
import fondoPrincipal3 from "../assets/portadaProyecto3.jpg";
import destacados1 from "../assets/destinosDestacados1.jpg";
import destacados2 from "../assets/destinosDestacados2.jpg";
import destacados3 from "../assets/destinosDestacados3.jpg";
import destacados4 from "../assets/imagenDemo.jpg";

import {
  ArrowRight,
  Star,
  Leaf,
  MapPin,
  Map as MapIcon,
  ChevronRight,
} from "lucide-react";

import Header from "../components/header";
import Footer from "../components/footer";
import ScrollToTop from "../components/ScrollToTop";

function App() {
  const destinations = [
    {
      title: "Laguna del Otún",
      location: "PNN Los Nevados, Risaralda",
      rating: "4.9",
      tag: "Cultural",
      category: "Senderismo de Páramo",
      img: destacados1,
    },
    {
      title: "Valle del Cocora",
      location: "Salento (Cerca de Risaralda)",
      rating: "4.8",
      tag: "Cultural",
      category: "Bosque de Niebla",
      img: destacados2,
    },
    {
      title: "Marsella",
      location: "Municipio Verde, Risaralda",
      rating: "4.7",
      tag: "Cultural",
      category: "Café Sostenible",
      img: destacados3,
    },
  ];

  return (
    <div className="relative">
      <Header />
      <ScrollToTop />

      <main className="pt-20 overflow-hidden">
        <section className="relative h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 animate-in fade-in zoom-in duration-1000">
            <img
              src={fondoPrincipal}
              alt="Risaralda Nature"
              className="w-full h-full object-cover scale-105 animate-pulse-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-20 duration-1000 delay-300 fill-mode-both">
              <div className="flex items-center gap-2 mb-4 animate-in zoom-in duration-700 delay-500">
                <span className="h-px w-12 bg-[#20A217]"></span>
                <span className="text-[#20A217] font-bold uppercase tracking-widest text-sm">
                  Descubre la Naturaleza
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                Viaja con Propósito:
                <br />
                <span className="text-white/90">Descubre Risaralda</span>
              </h1>
              <p className="text-lg text-slate-200 mb-10 max-w-lg animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
                Siente la pureza de nuestros bosques y el aroma del café. Un
                viaje diseñado para disfrutar hoy y preservar para siempre.
              </p>
              <div className="flex flex-wrap gap-4 pt-5 animate-in slide-in-from-bottom-20 duration-1000 delay-1000">
                <Link to="/lugares">
                  <button className="bg-[#20A217] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-110 hover:rotate-2 transition-all flex items-center gap-2 mt-px cursor-pointer active:scale-95 shadow-lg shadow-green-900/20">
                    Explorar <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full flex justify-center bg-transparent">
          <section className="py-24 w-full max-w-7xl px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="text-left">
                <h2 className="text-4xl font-extrabold mb-2 text-slate-900">
                  Destinos Eco-Destacados
                </h2>
                <p className="text-slate-500">
                  Lugares con mejor calificación y mas populares de Risaralda.
                </p>
              </div>
              <Link to="/lugares">
                <span className="text-[#20A217] font-bold flex items-center gap-1 group whitespace-nowrap cursor-pointer">
                  Ver Todos los Destinos
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center pt-5">
              {destinations.map((dest, index) => (
                <div
                  key={index}
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                  className="group bg-slate-950 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all w-full max-w-[360px] text-left animate-in fade-in slide-in-from-bottom-20 duration-1000 fill-mode-both"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={dest.img}
                      alt={dest.title}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 text-white"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 scale-90 group-hover:scale-100 transition-transform">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-white">
                        {dest.rating}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-[#20A217] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-bounce-slow">
                      <Leaf className="w-3 h-3" /> {dest.tag}
                    </div>
                  </div>
                  <div className="p-4 group-hover:bg-slate-900 transition-colors">
                    <h3 className="text-xl font-bold mb-1 text-white">
                      {dest.title}
                    </h3>
                    <p className="text-slate-300 text-sm flex items-center gap-1 mb-4">
                      <MapPin className="w-4 h-4" /> {dest.location}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm italic">
                        {dest.category}
                      </span>
                      <button className="text-[#20A217] font-semibold hover:cursor-pointer flex items-center gap-1 group/btn">
                        Explorar
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="relative w-full h-[600px] overflow-hidden mb-24">
          <div className="absolute inset-0 z-0 animate-in fade-in duration-1000">
            <img
              src={fondoPrincipal3}
              alt="Map Background"
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-[#0a0a0a]/40 to-transparent z-5"></div>
          </div>

          <div className="container mx-auto px-6 h-full flex items-center relative z-20">
            <div className="max-w-xl animate-in slide-in-from-right-20 fade-in duration-1000">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-white drop-shadow-lg">
                Explora cada rincón de Risaralda
              </h2>
              <p className="text-lg text-slate-300 mb-8 animate-in fade-in delay-500">
                ¡Tenemos mapas con geolocalización en los detalles de nuestros
                sitios ecoturísticos!
              </p>
              <div className="py-5">
                <button className="bg-[#20A217] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-110 hover:rotate-2 transition-all flex items-center gap-2 mt-px cursor-pointer active:scale-95 shadow-lg shadow-green-900/20">
                  <MapIcon className="w-6 h-6 animate-pulse" /> Ver lugares
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center py-16 px-6">
          <div className="max-w-7xl w-full bg-slate-950 rounded-[40px] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-700">
            <div className="w-full lg:max-w-xl text-left animate-in slide-in-from-left-20 duration-1000 delay-300 fill-mode-both">
              <span className="inline-block bg-[#20A217]/20 text-[#20A217] text-xs font-bold px-4 py-2 rounded-full mb-6 border border-[#20A217]/30 animate-pulse">
                Comunidad ECO TURISMORISARALDA
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight py-2">
                Únete a nuestra comunidad
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Obtén acceso a la información completa de el ecoturismo en
                Risaralda, geolocalización y poder calificar tus lugares
                favoritos.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 py-5">
                <Link to="/registro">
                  <button
                    type="submit"
                    className="bg-[#20A217] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-110 hover:rotate-2 transition-all flex items-center gap-2 mt-px cursor-pointer active:scale-95 shadow-lg shadow-green-900/20"
                  >
                    Regístrate Ahora
                  </button>
                </Link>
              </form>
            </div>

            <div className="relative w-full lg:w-1/2 h-[400px] sm:h-[500px] flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-500">
              <div className="grid grid-cols-2 gap-4 relative">
                <div className="bg-[#869d7a] rounded-3xl w-40 h-40 sm:w-56 sm:h-56 flex items-center justify-center -rotate-6 shadow-xl overflow-hidden mt-8 hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer">
                  <img
                    src={destacados4}
                    alt="Comunidad"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl w-40 h-40 sm:w-52 sm:h-52 rotate-6 shadow-xl overflow-hidden self-end hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer">
                  <img
                    src={destacados1}
                    alt="Destino"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl w-40 h-40 sm:w-52 sm:h-52 rotate-3 shadow-xl overflow-hidden -mt-4 ml-6 hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer">
                  <img
                    src={destacados2}
                    alt="Hospedaje"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl w-40 h-40 sm:w-56 sm:h-56 -rotate-12 shadow-xl overflow-hidden -mt-12 -ml-8 hover:rotate-0 hover:scale-110 transition-all duration-500 cursor-pointer">
                  <img
                    src={destacados3}
                    alt="Paisaje"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
