import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

function Contacto() {
  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-100 py-20 px-6 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto">

         

          <h1 className="text-4xl font-bold text-center mb-16">
            Contáctanos
          </h1> <br></br><br></br>

          <div className="bg-white p-12 rounded-3xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 mx-auto">

            <div className="w-20 h-20 bg-[#20A217]/10 rounded-2xl flex items-center justify-center mb-8 mx-auto">
              <Globe className="text-[#20A217]" size={40} />
            </div>

            <h2 className="text-2xl font-semibold mb-6 ">
              Ecoturismo Risaralda
            </h2>

            <div className="space-y-5 text-gray-700 max-w-md mx-auto">

              <p className="flex items-center gap-3">
                <Mail className="text-[#20A217] flex-shrink-0" size={20} />
                <span>ecoturismorisaralda@gmail.com</span>
              </p>

              <p className="flex items-center gap-3">
                <Phone className="text-[#20A217] flex-shrink-0" size={20} />
                <span>+57 300 123 4567</span>
              </p>

              <p className="flex items-center gap-3">
                <MapPin className="text-[#20A217] flex-shrink-0" size={20} />
                <span>Risaralda, Colombia</span>
              </p>

            </div>

            <p className="mt-8 text-gray-600 leading-relaxed  max-w-2xl mx-auto">
              Si tienes preguntas sobre destinos, hospedajes o experiencias 
              ecoturísticas en Risaralda, no dudes en comunicarte con nosotros. 
              Estamos comprometidos en brindarte la mejor información para que 
              vivas una experiencia sostenible y memorable.
            </p>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Contacto;
