import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/Lugares/SearchBar";
import Cards from "../components/Lugares/Cards";
import styles from "../components/Lugares/lugares.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
import fondoLugares from "../assets/img7.jpg";
import useAuthRedirect from "../hooks/useAuthRedirect";
import AvisoEliminar from "../components/adminActions/avisoEliminar";

const API = "http://localhost:8000/api";
const PEREIRA_MUNICIPIO_ID = 1;

function Lugares() {
  //redirecciona al usuario si no se ha logeado
  useAuthRedirect();

  //states para mostrar lugares
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);

  //states para el pop up de confirmación para eliminar lugar
  const [showModal, setShowModal] = useState(false);
  const [lugarAEliminar, setLugarAEliminar] = useState(null);

  //state de error
  const [error, setError] = useState(null);

  //states para el filtro
  const [municipios, setMunicipios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMunicipioId, setSelectedMunicipioId] =
    useState(PEREIRA_MUNICIPIO_ID);

  //obtener la información del usuario logeado
  const storedUser = JSON.parse(localStorage.getItem("usuario"));

  //función que sirve para cargar y mostrar los lugares
  const fetchLugares = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API}/lugares?`;

      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
      }

      if (selectedMunicipioId !== null) {
        url += `municipio_id=${selectedMunicipioId}&`;
      }

      const response = await axios.get(url);
      setLugares(response.data);
    } catch (err) {
      setError("Fallo al cargar los lugares o al aplicar el filtro.");
      console.error("Error al obtener lugares:", err);
    } finally {
      setLoading(false);
    }
  };

  //función que obtiene los municipios para el filtro
  const fetchMunicipios = async () => {
    try {
      const response = await axios.get(`${API}/municipios`);
      setMunicipios(response.data);
    } catch (err) {
      console.error("Error al obtener municipios:", err);
    }
  };

  //este useEffect mantiene los lugares del filtro cada vez que cambia
  useEffect(() => {
    fetchLugares();
  }, [searchQuery, selectedMunicipioId]);

  //este useEffect muestra los municipios
  useEffect(() => {
    fetchMunicipios();
  }, []);

  //función para que sirva el buscador en esta pagina
  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setSelectedMunicipioId(null);
  };

  const handleMunicipioChange = (id) => {
    setSelectedMunicipioId(id);
    setSearchQuery("");
  };

  //función para eliminar lugares
  const eliminarLugar = (id) => {
    setLugarAEliminar(id);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    try {
      await axios.delete(`${API}/lugares/${lugarAEliminar}`);

      setLugares((prev) => prev.filter((l) => l.id !== lugarAEliminar));

      setShowModal(false);
      setLugarAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar lugar:", error);
      alert("Hubo un error al eliminar el lugar.");
    }
  };

  const cancelarEliminar = () => {
    setShowModal(false);
    setLugarAEliminar(null);
  };

  //función que abre la alerta cuando se acciona el botón de eliminar
  const handleDeleteRequest = (id) => {
    setLugarAEliminar(id);
    setShowModal(true);
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
            onSearchSubmit={handleSearchSubmit}
            onMunicipioChange={handleMunicipioChange}
            currentMunicipioId={selectedMunicipioId}
          />
        </div>
        {loading ? (
          <p className={styles.loadingText}>Cargando lugares...</p>
        ) : error ? (
          <p className={styles.errorText}>Error: {error}</p>
        ) : lugares.length === 0 ? (
          <p className={styles.noResultsText}>
            No se encontraron lugares con estos filtros.
          </p>
        ) : (
          <Cards
            user={storedUser}
            lugares={lugares}
            onEdit={(id) => console.log("Editar lugar:", id)}
            onDelete={handleDeleteRequest}
          />
        )}
      </div>

      {showModal && (
        <AvisoEliminar
          message="¿Seguro que deseas eliminar este lugar?"
          onConfirm={confirmarEliminar}
          onCancel={cancelarEliminar}
        />
      )}
      <Footer />
    </>
  );
}

export default Lugares;
