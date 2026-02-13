import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white text-black py-16 border-t border-white/5 w-full">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-left pb-10">
            
            {/* EMPRESA */}
            <div className="flex flex-col gap-6">
              <h4 className="text-xl font-bold tracking-wider">
                <span className="text-[#20A217]">ECO</span>TURISMO
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    to="/ofrecemos"
                    className="text-black hover:text-[#20A217] transition-colors"
                  >
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ofrecemos"
                    className="text-black hover:text-[#20A217] transition-colors"
                  >
                    Nuestros servicios
                  </Link>
                </li>
                <li>
                  <Link
                    to="/politicas"
                    className="text-black hover:text-[#20A217] transition-colors"
                  >
                    Política de privacidad
                  </Link>
                </li>
              </ul>
            </div>

            {/* AYUDA */}
            <div className="flex flex-col gap-6">
              <h4 className="text-lg font-semibold border-b border-[#20A217] w-fit pb-1">
                Ayuda
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    to="/preguntasFrecuentes"
                    className="text-black hover:text-[#20A217] transition-colors"
                  >
                    Preguntas frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contacto"
                    className="text-black hover:text-[#20A217] transition-colors"
                  >
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link
                    to="/hospedajes"
                    className="text-black hover:text-[#20A217] transition-colors"
                  >
                    Hospedajes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/lugares"
                    className="text-black hover:text-[#20A217] transition-colors"
                  >
                    Lugares
                  </Link>
                </li>
              </ul>
            </div>

            {/* TIENDA */}
            <div className="flex flex-col gap-6">
              <h4 className="text-lg font-semibold border-b border-[#20A217] w-fit pb-1">
                Tienda
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    to="/lugares"
                    className="text-black hover:text-[#20A217] transition-colors"
                  >
                    Sitios Ecoturísticos
                  </Link>
                </li>
              </ul>
            </div>

            {/* REDES */}
            <div className="flex flex-col gap-6">
              <h4 className="text-lg font-semibold border-b border-[#20A217] w-fit pb-1">
                Síguenos
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#20A217] hover:text-white transition-all group"
                >
                  <i className="fab fa-facebook-f group-hover:scale-110"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#20A217] hover:text-white transition-all group"
                >
                  <i className="fab fa-instagram group-hover:scale-110"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#20A217] hover:text-white transition-all group"
                >
                  <i className="fab fa-twitter group-hover:scale-110"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#20A217] hover:text-white transition-all group"
                >
                  <i className="fab fa-linkedin group-hover:scale-110"></i>
                </a>
              </div>
            </div>

          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-center text-slate-500 text-sm w-full">
            <p>© 2026 Ecoturismo Risaralda. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
