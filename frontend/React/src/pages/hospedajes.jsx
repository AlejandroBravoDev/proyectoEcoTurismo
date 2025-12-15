import React from "react";
import useAuthRedirect from "../hooks/useAuthRedirect";
import useHospedajes from "../hooks/useHospedajes";
import Header from "../components/header";
import Footer from "../components/footer";
import SearchBar from "../components/Hospedajes/SearchBar";
import Cards from "../components/Hospedajes/Cards";
import AvisoEliminar from "../components/adminActions/avisoEliminar";
import styles from "../components/Hospedajes/Hospedajes.module.css";
import fondoHospedajes from "../assets/img4.jpg";

function Hospedajes() {
  useAuthRedirect();

  const {
    hospedajes,
    municipios,
    loading,
    error,
    searchQuery,
    selectedMunicipioId,
    showModal,
    setShowModal,
    setHospedajeAEliminar,
    setSearchQuery,
    setSelectedMunicipioId,
    eliminar,
  } = useHospedajes();

  const storedUser = JSON.parse(localStorage.getItem("usuario"));

  const handleOpenDeleteModal = (id) => {
    setHospedajeAEliminar(id);
    setShowModal(true);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setHospedajeAEliminar(null);
  };

  const handleConfirmDelete = async () => {
    await eliminar();
  };

  return (
    <>
      <Header />

      <div className={styles.mainContainer}>
        <div
          className={styles.heroSection}
          style={{ backgroundImage: `url(${fondoHospedajes})` }}
        >
          <SearchBar
            municipios={municipios}
            onSearchSubmit={setSearchQuery}
            onMunicipioChange={setSelectedMunicipioId}
            currentMunicipioId={selectedMunicipioId}
          />
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <Cards
            user={storedUser}
            hospedajes={hospedajes}
            onDelete={handleOpenDeleteModal}
          />
        )}
      </div>

      {showModal && (
        <AvisoEliminar
          message="¿Seguro que deseas eliminar este hospedaje?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <Footer />
    </>
  );
}

export default Hospedajes;