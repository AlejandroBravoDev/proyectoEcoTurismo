import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  Target,
  Leaf,
  Sparkles,
  Map,
  ArrowDown,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

// Activos del proyecto
import fotoHero from "../assets/portadaProyecto.jpg";
import fotoBio from "../assets/destinosDestacados2.jpg";

// Variantes de animación optimizadas
const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

function SobreNosotros() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans selection:bg-[#20A217] selection:text-white">
      <Header />

      <main className="flex-grow">
        {/* --- HERO SECTION: Corregido y con máxima visibilidad --- */}
        <section className="relative h-[85vh] flex items-center justify-center text-center px-6 overflow-hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img
              src={fotoHero}
              className="w-full h-full object-cover opacity-90 grayscale-[10%]"
              alt="Paisaje Risaralda"
            />
            {/* Gradiente de abajo hacia arriba: Solo afecta la base */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] from-0% via-transparent via-30% to-transparent"></div>
          </motion.div>{" "}
          {/* <--- AQUÍ ESTABA EL ERROR, YA ESTÁ CERRADO */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="relative z-10 max-w-5xl"
          >
            <motion.span className=" backdrop-blur-md text-[#20A217] text-[20px] font-black tracking-[0.4em] mb-8 uppercase">
              Explora la esencia de la vida
            </motion.span>
            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] mb-8 tracking-tighter pt-2 drop-shadow-2xl">
              Nuestra <br /> <span className="text-[#20A217]">Historia.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-lg">
              Transformamos el turismo en una herramienta de conservación.
              Planeamos ser los narradores de la biodiversidad en Risaralda.
            </p>
          </motion.div>
        </section>

        {/* --- SECCIÓN BIOGRAFÍA --- */}
        <section className="py-32 px-6 flex justify-center bg-white">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">
                Donde el café se funde con la{" "}
                <span className="text-[#20A217]">selva.</span>
              </h2>
              <div className="space-y-8 text-lg text-slate-600 leading-loose">
                <p>
                  Ecoturismo Risaralda nació bajo la premisa de que no se puede
                  proteger lo que no se ama, y no se ama lo que no se conoce.
                  Nuestra plataforma es el puente entre la curiosidad del
                  viajero y la sabiduría de la montaña.
                </p>
                <div className="p-8 bg-slate-50 rounded-3xl border-l-8 border-[#20A217] relative">
                  <p className="font-serif text-2xl italic text-slate-800">
                    "Nuestra misión es que cada paso que des en Risaralda deje
                    una huella de vida, no de carbono."
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center relative"
            >
              <div className="absolute -inset-4 bg-[#20A217]/5 rounded-full blur-3xl"></div>
              <div className="relative w-full max-w-md aspect-[3/4] overflow-hidden rounded-[10rem] shadow-2xl border-[16px] border-white group">
                <img
                  src={fotoBio}
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out"
                  alt="Biodiversidad"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- SECCIÓN VALORES --- */}
        <section className="py-32 bg-slate-50 flex justify-center px-6 border-y border-slate-100">
          <div className="max-w-6xl w-full">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Target />,
                  title: "Propósito",
                  text: "Proteger los ecosistemas estratégicos a través del conocimiento.",
                  color: "bg-green-100",
                },
                {
                  icon: <Eye />,
                  title: "Visión",
                  text: "Ser el modelo de ecoturismo comunitario más sólido de Colombia.",
                  color: "bg-blue-100",
                },
                {
                  icon: <Leaf />,
                  title: "Ética",
                  text: "Respeto absoluto por los ciclos naturales y las culturas locales.",
                  color: "bg-emerald-100",
                },
              ].map((val, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -12 }}
                  className="p-10 rounded-[3.5rem] bg-white border border-slate-200 shadow-sm flex flex-col items-center text-center group transition-all duration-500 hover:shadow-2xl hover:border-[#20A217]/20"
                >
                  <div
                    className={`w-20 h-20 ${val.color} rounded-3xl flex items-center justify-center mb-8 text-[#20A217] group-hover:rotate-[15deg] transition-transform duration-500 shadow-inner`}
                  >
                    {React.cloneElement(val.icon, { size: 32 })}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">
                    {val.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-medium italic">
                    "{val.text}"
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* --- SECCIÓN IMPACTO --- */}
        <section className="py-24 bg-[#0F172A] text-white flex justify-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#20A217]/20 rounded-full blur-[100px]"></div>
          <div className="max-w-5xl w-full px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-black text-[#20A217] uppercase tracking-[0.5em] mb-16">
                Estadísticas de Impacto
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                {[
                  { n: "14", t: "Municipios" },
                  { n: "800+", t: "Aves" },
                  { n: "100%", t: "Verde" },
                  { n: "5K+", t: "Viajeros" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-5xl font-black text-white mb-3 tracking-tighter">
                      {stat.n}
                    </span>
                    <div className="h-1 w-8 bg-[#20A217] mb-3"></div>
                    <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                      {stat.t}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="py-40 flex flex-col items-center text-center px-6 bg-white relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-10">
              <Map className="text-[#20A217]" size={32} />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight italic">
              Risaralda te espera.
            </h2>
            <p className="text-xl text-slate-500 mb-12 font-light">
              Sé parte del cambio. Descubre la magia de viajar con propósito y
              reconecta con lo esencial.
            </p>
            <button className="group relative px-12 py-6 bg-[#20A217] text-white rounded-full font-black text-lg shadow-2xl shadow-green-900/40 hover:bg-[#1b8a13] transition-all overflow-hidden">
              <span className="relative z-10 flex items-center gap-3">
                INICIAR EXPEDICIÓN <Sparkles size={20} />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default SobreNosotros;
