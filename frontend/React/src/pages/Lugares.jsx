import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/Lugares/SearchBar";
import Cards from "../components/Lugares/Cards";
import styles from "../components/Lugares/lugares.module.css";
import Footer from "../components/footer";
import Header from "../components/header";
import fondoLugares from "../assets/img7.jpg";

const API = "http://localhost:8000/api";
const PEREIRA_MUNICIPIO_ID = 1;

function Lugares() {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [municipios, setMunicipios] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMunicipioId, setSelectedMunicipioId] =
    useState(PEREIRA_MUNICIPIO_ID);

  const storedUser = JSON.parse(localStorage.getItem("usuario"));

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

  const fetchMunicipios = async () => {
    try {
      const response = await axios.get(`${API}/municipios`);
      setMunicipios(response.data);
    } catch (err) {
      console.error("Error al obtener municipios:", err);
    }
  };

  useEffect(() => {
    fetchLugares();
  }, [searchQuery, selectedMunicipioId]);

  useEffect(() => {
    fetchMunicipios();
  }, []);

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setSelectedMunicipioId(null);
  };

  const handleMunicipioChange = (id) => {
    setSelectedMunicipioId(id);
    setSearchQuery("");
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
            user={storedUser} // viene del contexto o de tu estado
            lugares={lugares}
            onEdit={(id) => console.log("Editar lugar:", id)}
            onDelete={(id) => console.log("Eliminar lugar:", id)}
          />
        )}
      </div>

      <Footer />
    </>
  );
}

export default Lugares;
