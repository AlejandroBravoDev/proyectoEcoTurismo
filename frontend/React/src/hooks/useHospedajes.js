import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

function useHospedajes() {
  const [hospedajes, setHospedajes] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMunicipioId, setSelectedMunicipioId] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [hospedajeAEliminar, setHospedajeAEliminar] = useState(null);

  // Cargar municipios al inicio
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await axios.get(`${API_URL}/municipios`);
        if (response.data.success) {
          setMunicipios(response.data.data);
        }
      } catch (err) {
        console.error("Error al cargar municipios:", err);
      }
    };
    fetchMunicipios();
  }, []);

  // Cargar hospedajes cuando cambian los filtros
  useEffect(() => {
    const fetchHospedajes = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        
        if (searchQuery) {
          params.append("search", searchQuery);
        }
        
        if (selectedMunicipioId !== 0) {
          params.append("municipio_id", selectedMunicipioId);
        }

        const response = await axios.get(`${API_URL}/hospedajes?${params}`);
        setHospedajes(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar hospedajes:", err);
        setError("Error al cargar los hospedajes. Por favor intenta de nuevo.");
        setLoading(false);
      }
    };

    fetchHospedajes();
  }, [searchQuery, selectedMunicipioId]);

  // Función para eliminar hospedaje
  const eliminar = async () => {
    if (!hospedajeAEliminar) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para realizar esta acción.");
      return;
    }

    try {
      await axios.delete(`${API_URL}/hospedajes/${hospedajeAEliminar}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHospedajes(hospedajes.filter((h) => h.id !== hospedajeAEliminar));
      setShowModal(false);
      setHospedajeAEliminar(null);
      alert("Hospedaje eliminado exitosamente.");
    } catch (err) {
      console.error("Error al eliminar hospedaje:", err);
      alert("Error al eliminar el hospedaje.");
      setShowModal(false);
      setHospedajeAEliminar(null);
    }
  };

  return {
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
  };
}

export default useHospedajes;