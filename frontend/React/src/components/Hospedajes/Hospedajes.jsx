import React, { useState, useEffect } from "react";
import styles from "./Hospedajes.module.css";
import Header from "../header";
import Footer from "../footer";
import fondoHospedajes from "../../assets/img4.jpg";
import imagenCard from "../../assets/img4.jpg";
import { Link } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect";

function Hospedajes() {
  useAuthRedirect();

  // Estados
  const [hospedajes, setHospedajes] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [pueblos, setPueblos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedPueblo, setSelectedPueblo] = useState("");
  const [showMunicipios, setShowMunicipios] = useState(false);
  const [showPueblos, setShowPueblos] = useState(false);

  const API_URL = "http://127.0.0.1:8000/api";

  // Cargar datos iniciales
  useEffect(() => {
    fetchHospedajes();
    fetchMunicipios();
  }, []);

  // Obtener hospedajes
  const fetchHospedajes = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.municipio) params.append("municipio_id", filters.municipio);
      if (filters.pueblo) params.append("pueblo_id", filters.pueblo);

      const response = await fetch(`${API_URL}/hospedajes?${params}`);
      const data = await response.json();

      if (data.success) {
        setHospedajes(data.data);
      }
    } catch (error) {
      console.error("Error al cargar hospedajes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener municipios
  const fetchMunicipios = async () => {
    try {
      const response = await fetch(`${API_URL}/municipios`);
      const data = await response.json();

      if (data.success) {
        setMunicipios(data.data);
      }
    } catch (error) {
      console.error("Error al cargar municipios:", error);
    }
  };

  // Obtener pueblos cuando se selecciona un municipio
  const fetchPueblos = async (municipioId) => {
    try {
      const response = await fetch(`${API_URL}/pueblos?municipio_id=${municipioId}`);
      const data = await response.json();

      if (data.success) {
        setPueblos(data.data);
      }
    } catch (error) {
      console.error("Error al cargar pueblos:", error);
    }
  };

  // Manejar búsqueda
  const handleSearch = () => {
    fetchHospedajes({
      search: searchTerm,
      municipio: selectedMunicipio,
      pueblo: selectedPueblo
    });
  };

  // Manejar selección de municipio
  const handleMunicipioSelect = (municipioId) => {
    setSelectedMunicipio(municipioId);
    setSelectedPueblo(""); // Resetear pueblo
    setShowMunicipios(false);
    fetchPueblos(municipioId);
    fetchHospedajes({ municipio: municipioId });
  };

  // Manejar selección de pueblo
  const handlePuebloSelect = (puebloId) => {
    setSelectedPueblo(puebloId);
    setShowPueblos(false);
    fetchHospedajes({
      municipio: selectedMunicipio,
      pueblo: puebloId
    });
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedMunicipio("");
    setSelectedPueblo("");
    setPueblos([]);
    fetchHospedajes();
  };

  return (
    <>
      <Header />

      <div className={styles.mainContainer}>
        <div
          className={styles.heroSection}
          style={{ backgroundImage: `url(${fondoHospedajes})` }}
        >
          <div className={styles.searchContainer}>
            <h2>¿En dónde deseas hospedarte?</h2>
            <p>
              ¡Filtra los hospedajes más cercanos o tus sitios Ecoturísticos
              favoritos!
            </p>
            <div className={styles.searchFilters}>
              <div className={styles.searchInput}>
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch}>
                  <i className="fas fa-search"></i>
                </button>
              </div>

              {/* Dropdown Municipios */}
              <div className={styles.filterButton}>
                <button onClick={() => setShowMunicipios(!showMunicipios)}>
                  {selectedMunicipio
                    ? municipios.find(m => m.id === selectedMunicipio)?.nombre
                    : "Municipios"
                  } <span>❯</span>
                </button>
                {showMunicipios && (
                  <div className={styles.dropdown}>
                    {municipios.map((municipio, index) => (
                      <div
                        // CORRECCIÓN 1: Usar index si municipio.id es nulo/undefined
                        key={municipio.id ?? index}
                        className={styles.dropdownItem}
                        onClick={() => handleMunicipioSelect(municipio.id)}
                      >
                        {municipio.nombre}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown Pueblos */}
              <div className={styles.filterButton}>
                <button
                  onClick={() => setShowPueblos(!showPueblos)}
                  disabled={!selectedMunicipio}
                >
                  {selectedPueblo
                    ? pueblos.find(p => p.id === selectedPueblo)?.nombre
                    : "Pueblos"
                  } <span>❯</span>
                </button>
                {showPueblos && pueblos.length > 0 && (
                  <div className={styles.dropdown}>
                    {pueblos.map((pueblo, index) => (
                      <div
                        // CORRECCIÓN 2: Usar index si pueblo.id es nulo/undefined
                        key={pueblo.id ?? index}
                        className={styles.dropdownItem}
                        onClick={() => handlePuebloSelect(pueblo.id)}
                      >
                        {pueblo.nombre}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón limpiar filtros */}
              {(selectedMunicipio || selectedPueblo || searchTerm) && (
                <button
                  className={styles.clearButton}
                  onClick={clearFilters}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.cardsSection}>
          {loading ? (
            <div className={styles.loading}>Cargando hospedajes...</div>
          ) : hospedajes.length === 0 ? (
            <div className={styles.noResults}>
              No se encontraron hospedajes con los filtros seleccionados
            </div>
          ) : (
            <div className={styles.cardsContainer}>
              {hospedajes.map((hospedaje, index) => (
                <div
                  // CORRECCIÓN 3: Usar index si hospedaje.id es nulo/undefined
                  key={hospedaje.id ?? index}
                  className={styles.card}
                >
                  <img
                    src={hospedaje.imagen_principal || imagenCard}
                    alt={hospedaje.nombre}
                    onError={(e) => e.target.src = imagenCard}
                  />
                  <div className={styles.cardContent}>
                    <h3>{hospedaje.nombre}</h3>
                    <p>{hospedaje.descripcion}</p>
                    <Link to={`/verHospedajes/${hospedaje.id}`}>
                      <button className={styles.detailsButton}>
                        Ver detalles
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Hospedajes;