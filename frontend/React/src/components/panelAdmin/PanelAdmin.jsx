import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import imgHospedajes from "../../assets/img4.jpg";
import imgLugares from "../../assets/img1.jpg";
import imgUsuarios from "../../assets/img6.jpg";
import Header from "../header";
import Footer from "../footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function PanelAdmin() {
  const adminCards = [
    {
      title: "Hospedajes",
      description: "Gestiona hoteles, fincas y sitios de alojamiento.",
      image: imgHospedajes,
      link: "/hospedajes",
      buttonText: "Gestionar Hospedajes",
      color: "text-[#20A217]",
    },
    {
      title: "Lugares",
      description: "Administra los destinos turísticos y puntos de interés.",
      image: imgLugares,
      link: "/lugares",
      buttonText: "Gestionar Lugares",
      color: "text-[#20A217]",
    },
    {
      title: "Usuarios",
      description: "Controla los perfiles, roles y accesos de la comunidad.",
      image: imgUsuarios,
      link: "/admin/usuarios",
      buttonText: "Gestionar Usuarios",
      color: "text-[#20A217]",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center w-full">
      <Header />

      <main className="w-full flex flex-col items-center flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-[350px] bg-cover bg-center relative flex items-center justify-center text-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80")`,
          }}
        >
          <div className="px-4">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase"
            >
              Panel <span className="text-[#20A217]">Admin</span>
            </motion.h1>
          </div>
        </motion.div>

        <div className="w-full max-w-7xl px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
          >
            {adminCards.map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col w-full max-w-[380px] p-4 hover:p-0 pb-6 hover:pb-6 relative"
              >
                <div className="h-64 overflow-hidden relative rounded-[2rem] group-hover:rounded-none transition-all duration-500">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-700 brightness-[0.8] group-hover:brightness-100 group-hover:scale-110"
                  />
                </div>

                <div className="p-6 flex flex-col items-center text-center flex-grow">
                  <div className="bg-slate-50 px-4 py-1 rounded-full mb-3">
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${card.color}`}
                    >
                      Administración
                    </span>
                  </div>

                  <h4 className="text-2xl font-black text-slate-800 pb-2 tracking-tighter uppercase">
                    {card.title}
                  </h4>

                  <p className="text-slate-500 text-sm leading-relaxed pb-6 px-2">
                    {card.description}
                  </p>

                  <div className="w-full px-6 mt-auto">
                    <Link to={card.link}>
                      <button className="w-full cursor-pointer py-4 rounded-2xl bg-[#20A217] text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-[#1a8212] transition-all active:scale-95">
                        {card.buttonText}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PanelAdmin;
