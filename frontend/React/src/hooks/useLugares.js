//logica de lugares
import { useEffect, useState } from "react";
import {
  getLugares,
  getMunicipios,
  deleteLugar,
} from "../services/lugaresServices";

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
      console.error("Error al cargar lugares:", e);
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
      console.error("Error al cargar municipios:", e);
    }
  };

  const eliminar = async () => {
    if (!lugarAEliminar) {
      console.error("No hay lugar para eliminar");
      return;
    }

    try {
      console.log("Eliminando lugar con ID:", lugarAEliminar);
      await deleteLugar(lugarAEliminar);

      // Actualizar la lista de lugares eliminando el que se borró
      setLugares((prev) => prev.filter((l) => l.id !== lugarAEliminar));

      console.log("Lugar eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el lugar:", error);
      setError("No se pudo eliminar el lugar. Por favor, intenta de nuevo.");
    } finally {
      // Cerrar modal y limpiar estado
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
