import React from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";
import useHospedajes from "../hooks/useHospedajes";
import Header from "../components/header";
import Footer from "../components/footer";
import SearchBar from "../components/Hospedajes/SearchBar";
import Cards from "../components/Hospedajes/Cards";
import AvisoEliminar from "../components/adminActions/avisoEliminar";
import fondoHospedajes from "../assets/destinosDestacados3.jpg";
import ScrollToTop from "../components/ScrollToTop";

function Hospedajes() {
  useAuthRedirect();

  const {
    hospedajes,
    municipios,
    loading,
    error,
    showModal,
    setShowModal,
    setHospedajeAEliminar,
    setSearchQuery,
    setSelectedMunicipioId,
    selectedMunicipioId,
    eliminar,
  } = useHospedajes();

  const storedUser = JSON.parse(localStorage.getItem("usuario"));

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="min-h-screen bg-white">
        <section className="relative h-[50vh] md:h-[65vh] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={fondoHospedajes}
              className="w-full h-full object-cover scale-110 animate-pulse-slow"
              alt="Fondo Hospedajes"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white"></div>
          </div>

          <div className="relative z-10 text-center px-6 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 drop-shadow-2xl">
              Tu <span className="text-[#20A217]">Descanso</span> Ideal
            </h1>
            <p className="text-base sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed text-white">
              Descubre hospedajes únicos donde la comodidad se encuentra con la
              naturaleza de Risaralda.
            </p>
          </div>
        </section>

        <div className="relative z-30 flex justify-center px-6 -mt-12 md:-mt-20">
          <SearchBar
            municipios={municipios}
            onSearchSubmit={setSearchQuery}
            onMunicipioChange={setSelectedMunicipioId}
            currentMunicipioId={selectedMunicipioId}
          />
        </div>

        <div className="w-full pb-20 pt-16 md:pt-24 flex flex-col items-center">
          {error && <p className="text-red-500 font-bold mb-8">{error}</p>}

          <Cards
            user={storedUser}
            hospedajes={hospedajes}
            onDelete={(id) => {
              setHospedajeAEliminar(id);
              setShowModal(true);
            }}
          />

          {!loading && hospedajes.length === 0 && (
            <div className="text-center py-20 animate-fade-in text-gray-400">
              <p className="text-xl font-medium">
                No encontramos hospedajes que coincidan.
              </p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <AvisoEliminar
          message="¿Seguro que deseas eliminar este hospedaje?"
          onConfirm={eliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
      <Footer />

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse 12s infinite alternate; }
        @keyframes pulse { from { transform: scale(1); } to { transform: scale(1.1); } }
      `}</style>
    </>
  );
}

export default Hospedajes;
