import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

// Iconos
import {
  Moon,
  Sun,
  ArrowRight,
  Star,
  Leaf,
  MapPin,
  Map as MapIcon,
  Plus,
  Minus,
  Navigation,
  Share2,
  Globe,
  ChevronRight,
  Play,
} from "lucide-react";

import Header from "../components/header";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Manejador de modo oscuro
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const destinations = [
    {
      title: "Laguna del Otún",
      location: "PNN Los Nevados, Risaralda",
      rating: "4.9",
      tag: "Sostenible",
      category: "Senderismo de Páramo",
      img: "https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Valle del Cocora",
      location: "Salento (Cerca de Risaralda)",
      rating: "4.8",
      tag: "Preservación",
      category: "Bosque de Niebla",
      img: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Marsella",
      location: "Municipio Verde, Risaralda",
      rating: "4.7",
      tag: "Cultural",
      category: "Café Sostenible",
      img: "https://images.unsplash.com/photo-1516738905867-030990739958?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div>
      <Header></Header>
      <main>
        <section className="relative h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80&w=2000"
              alt="Risaralda Nature"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px w-8 bg-[#15803d]"></span>
                <span className="text-[#15803d] font-bold uppercase tracking-widest text-sm">
                  Descubre la Naturaleza
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                Viaja con Propósito:
                <br />
                <span className="text-white/90">Descubre Risaralda</span>
              </h1>
              <p className="text-lg text-slate-200 mb-10 max-w-lg">
                Explora los entornos más prístinos del mundo mientras los
                preservas para el mañana. Sumérgete en el corazón del Eje
                Cafetero.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#15803d] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2">
                  Explorar Destinos <ArrowRight className="w-5 h-5" />
                </button>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2">
                  <Play className="w-5 h-5 fill-current" /> Ver Video
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* DESTINATIONS */}
        <section className="py-24 container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-extrabold mb-2">
                Destinos Eco-Destacados
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Lugares únicos seleccionados por su compromiso con la
                sostenibilidad.
              </p>
            </div>
            <a
              href="#"
              className="text-[#15803d] font-bold flex items-center gap-1 group"
            >
              Ver Todos los Destinos{" "}
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={dest.img}
                    alt={dest.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold">{dest.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-[#15803d] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> {dest.tag}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{dest.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4" /> {dest.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">
                      {dest.category}
                    </span>
                    <button className="text-[#15803d] font-semibold hover:underline">
                      Explorar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MAP SECTION */}
        <section className="relative w-full h-[600px] bg-slate-100 dark:bg-slate-900 overflow-hidden mb-24">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=2000"
              alt="Map Background"
              className="w-full h-full object-cover opacity-50 dark:opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdfdfb] via-[#fdfdfb]/80 dark:from-[#0a0a0a] dark:via-[#0a0a0a]/80 to-transparent z-10"></div>
          </div>

          <div className="container mx-auto px-6 h-full flex items-center relative z-20">
            <div className="max-w-xl">
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                Explora cada rincón de Risaralda
              </h2>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium">
                Tu próxima aventura comienza aquí
              </p>
              <div className="mt-8">
                <button className="bg-[#15803d] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3">
                  <MapIcon className="w-6 h-6" /> Abrir Mapa Interactivo
                </button>
              </div>
            </div>
          </div>

          <div className="absolute right-12 bottom-12 z-20 flex flex-col gap-2">
            {[Plus, Minus, Navigation].map((Icon, idx) => (
              <button
                key={idx}
                className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#15803d] transition-colors"
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="text-[#15803d] w-6 h-6" />
                <span className="font-extrabold text-xl uppercase">
                  Eco Risaralda
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Comprometidos con el turismo regenerativo y la preservación del
                patrimonio natural de Colombia.
              </p>
            </div>

            {/* Links Sections */}
            <div>
              <h4 className="font-bold mb-6">Explorar</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-[#15803d]">
                    Todos los Destinos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#15803d]">
                    Eco-Hospedajes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#15803d]">
                    Senderismo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Nosotros</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-[#15803d]">
                    Nuestra Misión
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#15803d]">
                    Impacto Social
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#15803d]">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Síguenos</h4>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-[#15803d] hover:text-white transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-[#15803d] hover:text-white transition-all">
                  <Globe className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <p>© 2024 Eco-Turismo Risaralda. Todos los derechos reservados.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:underline">
                Privacidad
              </a>
              <a href="#" className="hover:underline">
                Términos
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
