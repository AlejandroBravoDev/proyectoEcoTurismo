import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "../panelAdmin/tailwind.css";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";

function Editar() {
  const { tipo, id } = useParams();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [ubicacion, setUbicacion] = useState("");
  const [coordenadas, setCoordenadas] = useState("");
  const endpoints = useMemo(
    () => ({
      lugares: `http://localhost:8000/api/lugares/${id}`,
      hospedajes: `http://localhost:8000/api/hospedajes/${id}`,
      usuario: `http://localhost:8000/api/usuario/${id}`,
    }),
    [id],
  );
  const navigate = useNavigate();
  const endpoint = endpoints[tipo];

  const fetchData = useCallback(async () => {
    if (!endpoint) return;
    try {
      const { data } = await axios.get(endpoint);
      setNombre(data.nombre || "");
      setDescripcion(data.descripcion || "");
      setImagenesExistentes(data.todas_las_imagenes || []);
      setCoordenadas(data.coordenadas);
      setUbicacion(data.ubicacion);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return () => {
      imagenesNuevas.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [imagenesNuevas]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (
        acceptedFiles.length +
          imagenesExistentes.length +
          imagenesNuevas.length >
        3
      ) {
        Swal.fire({ title: "Máximo 3 imágenes", icon: "warning" });
        return;
      }

      const mappedFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      setImagenesNuevas((prev) => [...prev, ...mappedFiles]);
    },
    [imagenesExistentes.length, imagenesNuevas.length],
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const eliminarExistente = useCallback((index) => {
    setImagenesExistentes((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const eliminarNueva = useCallback((index) => {
    setImagenesNuevas((prev) => {
      const fileToRemove = prev[index];
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append(
        "imagenes_existentes",
        JSON.stringify(imagenesExistentes),
      );
      formData.append("ubicacion", ubicacion);
      formData.append("coordenadas", coordenadas);

      imagenesNuevas.forEach((img) =>
        formData.append("imagenes_nuevas[]", img),
      );
      formData.append("_method", "PUT");

      await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Cambios guardados",
        icon: "success",
        confirmButtonColor: "#4b8236",
      });
      navigate(-1);
    } catch (err) {
      Swal.fire({ title: "Error al actualizar", icon: "error" });
    }
  };

  const imagenPrincipal = useMemo(() => {
    if (imagenesExistentes.length > 0) return imagenesExistentes[0];
    if (imagenesNuevas.length > 0) return imagenesNuevas[0].preview;
    return "";
  }, [imagenesExistentes, imagenesNuevas]);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-center justify-evenly py-10 lg:py-20 bg-gray-50 gap-10 px-4">
      <form
        onSubmit={handleUpdate}
        className="rounded-xl shadow-lg w-full max-w-4xl bg-white p-6 lg:p-8 flex flex-col gap-12"
      >
        <h1 className="text-2xl font-bold text-[#20A217]">
          {nombre ? `Editando: ${nombre}` : "Cargando datos..."}
        </h1>

        <div className="w-full flex flex-col gap-6 xl:max-h-120 xl:flex-wrap">
          <div className="flex flex-col gap-2 ">
            <label htmlFor="nombre" className="font-semibold text-[#20A217]">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              maxLength="45"
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 w-full lg:w-[90%] outline-none focus:ring-2 focus:ring-[#20A217]/20"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="descripcion"
              className="font-semibold text-[#20A217]"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              maxLength="250"
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 w-full lg:w-[90%] h-32 resize-none outline-none focus:ring-2 focus:ring-[#20A217]/20"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ubicacion" className="font-semibold text-[#20A217]">
              Ubicación
            </label>
            <textarea
              id="ubicacion"
              maxLength="250"
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 w-full lg:w-[90%] h-16 resize-none outline-none focus:ring-2 focus:ring-[#20A217]/20"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="coordenadas"
              className="font-semibold text-[#20A217]"
            >
              Coordenadas
            </label>
            <textarea
              id="coordenadas"
              maxLength="250"
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 w-full lg:w-[90%] h-13 resize-none outline-none focus:ring-2 focus:ring-[#20A217]/20"
              value={coordenadas}
              onChange={(e) => setCoordenadas(e.target.value)}
              placeholder="..."
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[#20A217]">
              Imágenes (Máx. 3)
            </label>
            <div className="flex gap-4 flex-wrap mb-2">
              {imagenesExistentes.map((img, index) => (
                <div
                  key={`old-${index}`}
                  className="relative group animate-fade-in"
                >
                  <img
                    src={img}
                    className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={() => eliminarExistente(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {imagenesNuevas.map((file, index) => (
                <div
                  key={`new-${index}`}
                  className="relative group animate-fade-in"
                >
                  <img
                    src={file.preview}
                    className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    alt=""
                  />
                  <button
                    type="button"
                    onClick={() => eliminarNueva(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {imagenesExistentes.length + imagenesNuevas.length < 3 && (
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-200 p-4 rounded-xl cursor-pointer hover:border-[#20A217] transition-all w-full lg:w-[40%] text-center bg-gray-50"
              >
                <input {...getInputProps()} />
                <p className="text-xs text-gray-500">
                  Subir imagen (
                  {3 - (imagenesExistentes.length + imagenesNuevas.length)}{" "}
                  restantes)
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#20A217] hover:bg-[#1f9217] text-white rounded-xl font-bold py-3 px-8 self-start transition-colors shadow-md active:scale-95 w-full"
        >
          Guardar Cambios
        </button>
      </form>

      <div className="w-full max-w-sm sticky top-10">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300">
          <div className="h-48 bg-gray-100 flex items-center justify-center">
            {imagenPrincipal ? (
              <img
                src={imagenPrincipal}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
                <span className="text-xs text-gray-400 font-medium">
                  Sin imagen
                </span>
              </div>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 truncate mb-2">
              {nombre || "Nombre del lugar"}
            </h2>
            <p className="text-sm text-gray h-16 overflow-hidden line-clamp-3 leading-relaxed">
              {ubicacion || "Esperando descripción..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editar;
