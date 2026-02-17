import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Leaf,
  Compass,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";
import fondoContacto from "../assets/portadaProyecto3.jpg";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

function Contacto() {
  return (
    <div className="min-h-screen bg-black flex flex-col font-sans overflow-x-hidden">
      <Header />

      <main className="flex-grow relative">
        <div className="absolute inset-0 h-[70vh] lg:h-screen w-full overflow-hidden">
          <motion.img
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            src={fondoContacto}
            alt="Risaralda Landscape"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black"></div>
        </div>

        <section className="relative pt-40 pb-20 px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              className="max-w-4xl mb-24 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#20A217]/20 border border-[#20A217]/30 text-[#20A217] text-xs font-bold uppercase tracking-widest mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20A217] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20A217]"></span>
                </span>
                Soporte en línea 24/7
              </motion.div>

              <h1 className="text-6xl md:text-8xl font-black text-white leading-none pb-8">
                Hablemos de tu próxima
                <br />
                <span className=" bg-clip-text bg-gradient-to-r text-[#20A217] ">
                  aventura.
                </span>
              </h1>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
              <motion.div
                variants={fadeInUp}
                whileHover={{
                  y: -15,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
                className="group p-10 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-[#20A217] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-green-900/40">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Escríbenos
                </h3>
                <p className="text-slate-400 mb-8 text-sm">
                  Respuesta garantizada en menos de 24 horas.
                </p>
                <p className="flex items-center gap-2 text-lg font-medium text-[#20A217] group-hover:gap-4 transition-all">
                  ecoturismorisaralda@gmail.com
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                whileHover={{
                  y: -15,
                  backgroundColor: "rgba(32, 162, 23, 0.1)",
                }}
                className="group p-10 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-[#20A217] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#20A217] transition-colors">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Llamada Directa
                </h3>
                <p className="text-slate-400 mb-8 text-sm">
                  Lunes a Viernes, de 8:00 AM a 6:00 PM.
                </p>
                <p className="text-lg font-medium text-[#20A217] transition-colors">
                  +57 300 123 4567
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                whileHover={{ y: -15 }}
                className="group p-10 bg-[#20A217] rounded-[3rem] shadow-2xl shadow-green-900/20 relative overflow-hidden"
              >
                <Compass className="absolute -bottom-10 -right-10 text-black/10 w-40 h-40 rotate-12" />
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Visítanos
                </h3>
                <p className="text-green-100 mb-8 text-sm">
                  Risaralda, Colombia. El corazón del Eje Cafetero.
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 py-20 border-t border-white/10"
            >
              <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4">
                <Leaf className="text-[#20A217]" size={32} />
                <h4 className="font-bold text-white text-xl">
                  100% Sostenible
                </h4>
                <p className="text-slate-400">
                  Proyectos enfocados en la conservación del ecosistema local.
                </p>
              </div>
              <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4">
                <ShieldCheck className="text-[#20A217]" size={32} />
                <h4 className="font-bold text-white text-xl">Viaje Seguro</h4>
                <p className="text-slate-400">
                  Contamos con todos los registros nacionales de turismo.
                </p>
              </div>
              <div className="flex flex-col items-center text-center md:items-start md:text-left gap-4">
                <Globe className="text-[#20A217]" size={32} />
                <h4 className="font-bold text-white text-xl">Impacto Local</h4>
                <p className="text-slate-400">
                  Apoyamos directamente a las comunidades rurales de la región.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Contacto;
