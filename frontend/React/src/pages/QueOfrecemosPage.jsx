import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import ScrollToTop from "../components/ScrollToTop";
import { Link } from "react-router-dom";
import portada from "../assets/destinosDestacados1.jpg";
import geolocalizacion from "../assets/geolocalizacion.jpg";
import sistemaValoracion from "../assets/sistemaValoracion.jpg";

function QueOfrecemosPage() {
  const servicios = [
    {
      icon: "fas fa-leaf",
      title: "Visibilidad Ecoturística",
      desc: "Damos voz a los tesoros naturales ocultos de Risaralda. Nuestra misión es conectar la majestuosidad de la selva y la montaña con el mundo entero.",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
      delay: "0",
    },
    {
      icon: "fas fa-map-marked-alt",
      title: "Geolocalización Precisa",
      desc: "Navega con confianza. Integramos tecnología de mapas avanzada para que cada cascada, sendero o mirador esté a un solo clic de distancia.",
      image: geolocalizacion,
      delay: "200",
    },
    {
      icon: "fas fa-star-half-alt",
      title: "Sistema de Valoración",
      desc: "La opinión de la comunidad es muy importante. Descubre los destinos favoritos basados en experiencias reales de otros viajeros.",
      image: sistemaValoracion,
      delay: "400",
    },
  ];

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="min-h-screen bg-white overflow-hidden">
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={portada}
              className="w-full h-full object-cover scale-110 animate-pulse-slow"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white"></div>
          </div>

          <div className="relative z-10 text-center px-6 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 drop-shadow-2xl pb-2">
              Nuestra <span className="text-[#20A217]">Propuesta</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto opacity-100 leading-relaxed text-white">
              Transformando la forma en que descubres el pulmón verde de
              Colombia.
            </p>
          </div>
        </section>

        <div className="flex flex-col items-center w-full pb-10 md:pb-20">
          <div className="max-w-7xl w-full px-4 sm:px-6 -mt-16 md:-mt-20 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 justify-items-center pb-10">
              {servicios.map((s, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-[24px] md:rounded-[30px] overflow-hidden shadow-2xl hover:shadow-[#20A217]/20 transition-all duration-500 hover:-translate-y-4 w-full max-w-[380px]"
                  style={{ animationDelay: `${s.delay}ms` }}
                >
                  <div className="h-56 md:h-64 overflow-hidden relative">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-white/90 backdrop-blur rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl">
                      <i
                        className={`${s.icon} text-xl md:text-2xl text-[#20A217]`}
                      ></i>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4 group-hover:text-[#20A217] transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm md:text-gray-600 leading-relaxed mb-4 pb-5">
                      {s.desc}
                    </p>
                    <div className="w-12 h-1 bg-[#20A217] rounded-full transition-all duration-500 group-hover:w-full"></div>
                  </div>
                </div>
              ))}
            </div>
            <section className="mt-16 md:mt-32 relative rounded-[30px] md:rounded-[40px] overflow-hidden group max-w-full lg:max-w-8xl mx-auto shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2000"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt="CTA Background"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1b5e20]/95 via-[#1b5e20]/80 to-[#20A217]/70 backdrop-blur-[1px]"></div>

              <div className="relative p-8 md:p-16 lg:p-20 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
                <div className="max-w-2xl text-white">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 pb-2">
                    ¿Listo para tu próxima aventura?
                  </h2>
                  <p className="text-base md:text-lg opacity-90 mb-0">
                    Risaralda te espera con rincones que parecen sacados de un
                    sueño. Explora, califica y comparte la belleza natural.
                  </p>
                </div>

                <Link to="/lugares" className="w-full md:w-auto">
                  <button className="w-full md:w-auto whitespace-nowrap bg-white text-[#20A217] px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:bg-[#f0fdf4] hover:scale-105 md:hover:scale-110 transition-all shadow-2xl active:scale-95 flex items-center justify-center">
                    <i className="fas fa-search-location mr-3 pr-2"></i>
                    Explorar Lugares
                  </button>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 10s infinite alternate;
        }
        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
      `}</style>
    </>
  );
}

export default QueOfrecemosPage;
