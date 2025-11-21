//logica de lugares
import { useEffect, useState } from "react";
import {
  getLugares,
  getMunicipios,
  deleteLugar,
} from "../services/lugaresService";

export default function useLugares() {
  const [lugares, setLugares] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMunicipioId, setSelectedMunicipioId] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [lugarAEliminar, setLugarAEliminar] = useState(null);

  useEffect(() => {
    cargarMunicipios();
  }, []);

  useEffect(() => {
    cargarLugares();
  }, [searchQuery, selectedMunicipioId]);

  const cargarLugares = async () => {
    try {
      setLoading(true);
      const response = await getLugares({
        search: searchQuery || undefined,
        municipio_id: selectedMunicipioId || undefined,
      });
      setLugares(response.data);
    } catch (e) {
      setError("No se pudieron cargar los lugares.");
    } finally {
      setLoading(false);
    }
  };

  const cargarMunicipios = async () => {
    try {
      const response = await getMunicipios();
      setMunicipios(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const eliminar = async () => {
    try {
      await deleteLugar(lugarAEliminar);
      setLugares((prev) => prev.filter((l) => l.id !== lugarAEliminar));
    } finally {
      setShowModal(false);
      setLugarAEliminar(null);
    }
  };

  return {
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
  };
}
