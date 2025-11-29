//se importan dependencias, componentes y apoyo
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

//funcion de lugares que obtiene todo lo que necesita para mostrar la información
function Lugares() {
  //hook para que si el usuario no está logeado lo redireccione a el log in
  useAuthRedirect();

  //trae la información del hook que la tiene y la convierte en variables locales
  const {
    lugares,
    municipios,
    loading,
    error,
    searchQuery,
    selectedMunicipioId,
    showModal,
    setShowModal,
    setLugarAEliminar,
    setSearchQuery,
    setSelectedMunicipioId,
    eliminar,
  } = useLugares();

  //se obtiene la información de el usuario que está navegando
  const storedUser = JSON.parse(localStorage.getItem("usuario"));

  // Función para abrir el modal de eliminación
  const handleOpenDeleteModal = (id) => {
    setLugarAEliminar(id);
    setShowModal(true);
  };

  // Función para cancelar la eliminación
  const handleCancelDelete = () => {
    setShowModal(false);
    setLugarAEliminar(null); // Limpiar el ID del lugar
  };

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    await eliminar();
    // El modal se cierra automáticamente en la función eliminar del hook
  };

  return (
    <>
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

        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <Cards
            user={storedUser}
            lugares={lugares}
            onDelete={handleOpenDeleteModal}
          />
        )}
      </div>

      {showModal && (
        <AvisoEliminar
          message="¿Seguro que deseas eliminar este lugar?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <Footer />
    </>
  );
}

export default Lugares;
