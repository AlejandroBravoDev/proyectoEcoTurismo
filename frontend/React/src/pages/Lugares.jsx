import React from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";
import useLugares from "../hooks/useLugares";
import Header from "../components/header";
import Footer from "../components/footer";
import SearchBar from "../components/Lugares/SearchBar";
import Cards from "../components/Lugares/Cards";
import AvisoEliminar from "../components/adminActions/avisoEliminar";
import styles from "../components/Lugares/lugares.module.css";
import fondoLugares from "../assets/img7.jpg";
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
      <div className={styles.mainContainer}>
        <div
          className={styles.heroSection}
          style={{ backgroundImage: `url(${fondoLugares})` }}
        >
          <SearchBar
            municipios={municipios}
            onSearchSubmit={setSearchQuery}
            onMunicipioChange={setSelectedMunicipioId}
            currentMunicipioId={selectedMunicipioId}
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <Cards
          user={storedUser}
          lugares={lugares}
          onDelete={(id) => {
            setLugarAEliminar(id);
            setShowModal(true);
          }}
        />

        {!loading && lugares.length === 0 && (
          <p className="text-center py-10">No se encontraron resultados.</p>
        )}
      </div>

      {showModal && (
        <AvisoEliminar
          onConfirm={eliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
      <Footer />
    </>
  );
}

export default Lugares;
