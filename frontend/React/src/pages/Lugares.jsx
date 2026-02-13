import React from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";
import useLugares from "../hooks/useLugares";
import Header from "../components/header";
import Footer from "../components/footer";
import SearchBar from "../components/Lugares/SearchBar";
import Cards from "../components/Lugares/Cards";
import AvisoEliminar from "../components/adminActions/avisoEliminar";
import fondoLugares from "../assets/portadaProyecto.jpg";
import ScrollToTop from "../components/ScrollToTop";

function Lugares() {
  useAuthRedirect();
  const {
    lugares,
    municipios,
    loading,
    error,
    setSearchQuery,
    setSelectedMunicipioId,
    selectedMunicipioId,
    showModal,
    setShowModal,
    setLugarAEliminar,
    eliminar,
  } = useLugares();

  const storedUser = JSON.parse(localStorage.getItem("usuario"));

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="min-h-screen bg-white">
        <section className="relative h-[50vh] md:h-[65vh] flex items-center justify-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={fondoLugares}
              className="w-full h-full object-cover scale-110 animate-pulse-slow"
              alt="Fondo Risaralda"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-white"></div>
          </div>

          <div className="relative z-10 text-center px-6 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 drop-shadow-2xl pb-5">
              Explora <span className="text-[#20A217]">Risaralda</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed text-white">
              Encuentra el destino perfecto entre la magia de nuestras montañas
              y la biodiversidad del Eje Cafetero.
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
          {error && (
            <p className="text-red-500 text-center font-bold mb-8">{error}</p>
          )}

          <Cards
            user={storedUser}
            lugares={lugares}
            onDelete={(id) => {
              setLugarAEliminar(id);
              setShowModal(true);
            }}
          />

          {!loading && lugares.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <i className="fas fa-search-minus text-5xl text-gray-300 mb-4"></i>
              <p className="text-xl text-gray-500 font-medium">
                No se encontraron lugares que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <AvisoEliminar
          onConfirm={eliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
      <Footer />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 12s infinite alternate;
        }
        @keyframes pulse {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}

export default Lugares;
