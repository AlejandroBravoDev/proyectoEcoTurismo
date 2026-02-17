import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, FileText, Eye, Database, RefreshCcw } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

function Politicas() {
  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-100 py-20 px-6 flex items-center justify-center ">
        <div className="max-w-6xl mx-auto">
            <br></br>
          <h1 className="text-4xl font-bold text-center mb-16">
            Política de Privacidad
          </h1><br></br>
            <br></br>
          <div className="grid md:grid-cols-2 gap-10 mx-auto w-6xl">

            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">
              <FileText className="text-[#20A217] mb-6" size={35} />
              <h2 className="text-xl font-semibold mb-4">
                1. Información que recopilamos
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Recopilamos información básica como nombre, correo electrónico y datos
                necesarios para el uso de la plataforma.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">
              <Database className="text-[#20A217] mb-6" size={35} />
              <h2 className="text-xl font-semibold mb-4">
                2. Uso de la información
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Utilizamos los datos para mejorar la experiencia del usuario,
                brindar información turística y optimizar nuestros servicios.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">
              <Lock className="text-[#20A217] mb-6" size={35} />
              <h2 className="text-xl font-semibold mb-4">
                3. Protección de datos
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Implementamos medidas de seguridad técnicas y administrativas
                para proteger la información contra accesos no autorizados.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">
              <Eye className="text-[#20A217] mb-6" size={35} />
              <h2 className="text-xl font-semibold mb-4">
                4. Compartir información
              </h2>
              <p className="text-gray-600 leading-relaxed">
                No compartimos información personal con terceros,
                salvo que sea requerido por ley.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">
              <ShieldCheck className="text-[#20A217] mb-6" size={35} />
              <h2 className="text-xl font-semibold mb-4">
                5. Derechos del usuario
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Los usuarios pueden solicitar la modificación o eliminación
                de sus datos personales en cualquier momento.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">
              <RefreshCcw className="text-[#20A217] mb-6" size={35} />
              <h2 className="text-xl font-semibold mb-4">
                6. Cambios en la política
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nos reservamos el derecho de actualizar esta política.
                Cualquier modificación será publicada en esta sección.
              </p>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Politicas;
