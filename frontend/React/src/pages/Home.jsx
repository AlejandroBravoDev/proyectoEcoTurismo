import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

import fondoPrincipal from "../assets/portadaProyecto.jpg";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const slideInLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

function App() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;
    const fetchTopDestinations = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/api/lugares");
        if (isMounted) {
          const procesados = response.data.map((lugar) => {
            const comentarios = lugar.comentarios || [];
            const suma = comentarios.reduce(
              (acc, c) => acc + (parseFloat(c.rating) || 0),
              0,
            );
            const promedioNum =
              comentarios.length > 0 ? suma / comentarios.length : 0;
            return {
              id: lugar.id,
              title: lugar.nombre,
              location: lugar.ubicacion || "Risaralda",
              rating: promedioNum.toFixed(1),
              score: promedioNum,
              category: comentarios[0]?.category || "General",
              img: lugar.imagen_url || destacados4,
            };
          });
          const top3 = procesados.sort((a, b) => b.score - a.score).slice(0, 3);
          setDestinations(top3);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTopDestinations();
    return () => {
      isMounted = false;
    };
  }, []);

  const galleryImages = useMemo(
    () => [destacados4, destacados1, destacados2, destacados3],
    [],
  );

  return (
    <div className="relative">
      <Header />
      <ScrollToTop />

      <main className="overflow-hidden pt-20">
        <section className="relative h-[85vh] flex items-center overflow-hidden">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={fondoPrincipal}
              alt="Hero"
              className="w-full h-full object-cover animate-pulse-slow"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </motion.div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideInLeft}
              className="max-w-2xl"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 mb-4"
              >
                <span className="h-px w-12 bg-[#20A217]"></span>
                <span className="text-[#20A217] font-bold uppercase tracking-widest text-sm">
                  Descubre la Naturaleza
                </span>
              </motion.div>
              <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6"
              >
                Viaja con Propósito: <br />
                <span className="text-white/90">Descubre Risaralda</span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-slate-200 mb-10 max-w-lg pb-4"
              >
                Siente la pureza de nuestros bosques y el aroma del café. Un
                viaje diseñado para disfrutar hoy y preservar para siempre.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link to="/lugares">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#20A217] text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-green-900/20"
                  >
                    Explorar <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="w-full flex justify-center bg-transparent">
          <section className="py-24 w-full max-w-7xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
            >
              <div className="text-left">
                <h2 className="text-4xl font-extrabold mb-2 text-slate-900">
                  Destinos Eco-Destacados
                </h2>
                <p className="text-slate-500">
                  Lugares con mejor calificación y populares de Risaralda.
                </p>
              </div>
              <Link to="/lugares">
                <span className="text-[#20A217] font-bold flex items-center gap-1 group cursor-pointer">
                  Ver Todos los Destinos
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Link>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center pt-5"
            >
              {destinations.map((dest) => (
                <motion.div
                  key={dest.id}
                  variants={itemVariants}
                  className="group bg-slate-950 rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all w-[90%] max-w-[360px] text-left"
                >
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={dest.img}
                      alt={dest.title}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 scale-90 group-hover:scale-100 transition-transform">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {dest.rating}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-[#20A217] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-bounce-slow">
                      <Leaf className="w-3 h-3" /> {dest.category}
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="text-xl font-bold mb-1 text-black">
                      {dest.title}
                    </h3>
                    <p className="text-black text-sm flex items-center gap-1 pb-3">
                      <MapPin className="w-4 h-4" /> {dest.location}
                    </p>
                    <Link to={`/lugares/${dest.id}`}>
                      <span className="text-[#20A217] font-semibold flex items-center gap-1 group/btn cursor-pointer">
                        Explorar{" "}
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>

        <section className="relative w-full h-[800px] overflow-hidden mb-24">
          <motion.div
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={fondoPrincipal3}
              alt="Map"
              className="w-full h-full object-cover grayscale-[20%]"
              loading="auto"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-[#0a0a0a]/40 to-transparent z-5"></div>
          </motion.div>
          <div className="container mx-auto px-6 h-full flex items-center relative z-20">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-xl"
            >
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 text-white pb-2">
                Explora cada rincón de Risaralda
              </h2>
              <p className="text-lg text-slate-300 pb-4">
                ¡Mapas con geolocalización disponibles!
              </p>
              <Link to="/lugares">
                <motion.button
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="bg-[#20A217] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 shadow-lg shadow-green-900/20 cursor-pointer"
                >
                  <MapIcon className="w-6 h-6" /> Ver lugares
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {!isAuthenticated && (
          <section className="w-full flex justify-center py-16 px-6">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-7xl w-full bg-white rounded-[40px] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl"
            >
              <div className="w-full lg:max-w-xl text-left">
                <span className="inline-block bg-[#20A217]/20 text-[#20A217] text-xs font-bold px-4 py-2 rounded-full mb-6 border border-[#20A217]/30">
                  Comunidad ECO TURISMORISARALDA
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight py-2">
                  Únete a nuestra comunidad
                </h2>
                <p className="text-black text-lg mb-10 leading-relaxed pb-2">
                  Acceso a información completa, geolocalización y valoraciones.
                </p>
                <Link to="/registro">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-[#20A217] text-white px-8 py-4 rounded-full font-bold text-lg cursor-pointer shadow-lg shadow-green-900/20"
                  >
                    Regístrate Ahora
                  </motion.button>
                </Link>
              </div>
              <div className="relative w-full lg:w-1/2 flex items-center justify-center">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-4 relative"
                >
                  {galleryImages.map((img, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      whileHover={{ rotate: 0, scale: 1.1, zIndex: 20 }}
                      className={`rounded-3xl shadow-xl overflow-hidden cursor-pointer transition-all duration-500 
                      ${i === 0 ? "w-40 h-40 sm:w-56 sm:h-56 -rotate-6 mt-8" : ""}
                      ${i === 1 ? "w-40 h-40 sm:w-52 sm:h-52 rotate-6 self-end" : ""}
                      ${i === 2 ? "w-40 h-40 sm:w-52 sm:h-52 rotate-3 -mt-4 ml-6" : ""}
                      ${i === 3 ? "w-40 h-40 sm:w-56 sm:h-56 -rotate-12 -mt-12 -ml-8" : ""}
                    `}
                    >
                      <img
                        src={img}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
