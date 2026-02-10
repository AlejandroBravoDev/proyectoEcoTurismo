import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";
import { ChevronRight } from "lucide-react";
function CrearUniversal() {
  const { tipo } = useParams();
  const navigate = useNavigate();

  const [municipios, setMunicipios] = useState([]);
  const [imagenes, setImagenes] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagenes: "",
    ubicacion: "",
    coordenadas: "",
    municipio_id: "",
  });

  /* =========================
     CARGAR MUNICIPIOS
  ========================= */
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/municipios",
        );
        setMunicipios(
          Array.isArray(response.data.data) ? response.data.data : [],
        );
      } catch (error) {
        console.error(error);
        setMunicipios([]);
      }
    };

    if (tipo === "lugar" || tipo === "hospedaje") {
      fetchMunicipios();
    }
  }, [tipo]);

  /* =========================
     HANDLE INPUTS
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     ENDPOINTS
  ========================= */
  const endpoints = {
    lugar: "http://localhost:8000/api/lugares",
    hospedaje: "http://localhost:8000/api/hospedajes",
    usuario: "http://localhost:8000/api/usuarios",
  };

  /* =========================
     DROPZONE
  ========================= */
  const onDrop = (acceptedFiles) => {
    if (imagenes.length + acceptedFiles.length > 3) {
      Swal.fire("Máximo 3 imágenes");
      return;
    }

    setImagenes((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 3,
    onDrop,
  });

  const eliminarImagen = (index) => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const endpoint = endpoints[tipo];
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // 🔥 enviar imágenes en orden (0 = principal)
      imagenes.forEach((img) => {
        formDataToSend.append("imagenes[]", img);
      });

      await axios.post(endpoint, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire("Creado", `${tipo} creado correctamente`, "success");
      navigate(-1);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo crear el registro", "error");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-evenly py-40 bg-gray-100 px-6">
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl shadow w-[60%] p-8 flex flex-col gap-5 bg-white"
      >
        <h1 className="text-3xl font-extrabold text-[#4b8236] capitalize">
          Crear {tipo}
        </h1>

        {(tipo === "lugar" || tipo === "hospedaje") && (
          <>
            <label className="font-semibold text-[#4b8236]">Nombre</label>
            <input
              type="text"
              name="nombre"
              maxLength={45}
              className="p-3 rounded-lg border"
              value={formData.nombre}
              onChange={handleChange}
            />

            <label className="font-semibold text-[#4b8236]">Descripción</label>
            <textarea
              name="descripcion"
              maxLength={250}
              className="p-3 min-h-32 rounded-lg border"
              value={formData.descripcion}
              onChange={handleChange}
            />

            <label className="font-semibold text-[#4b8236]">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              className="p-3 rounded-lg border"
              value={formData.ubicacion}
              onChange={handleChange}
            />

            <label className="font-semibold text-[#4b8236]">Coordenadas</label>
            <input
              type="text"
              name="coordenadas"
              className="p-3 rounded-lg border"
              value={formData.coordenadas}
              onChange={handleChange}
            />

            <label className="font-semibold text-[#4b8236]">Municipio</label>
            <select
              name="municipio_id"
              className="p-3 rounded-lg border"
              value={formData.municipio_id}
              onChange={handleChange}
            >
              <option value="">Seleccione un municipio</option>
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>

            {/* DROPZONE */}
            <label className="font-semibold text-[#4b8236]">
              Imágenes del {tipo}
            </label>

            <div
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded-lg cursor-pointer text-center
              ${isDragActive ? "border-green-600 bg-green-50" : "border-gray-300"}`}
            >
              <input {...getInputProps()} />
              Arrastra hasta 3 imágenes o haz click
            </div>

            {/* MINIATURAS */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {imagenes.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className={`w-24 h-24 object-cover rounded-lg border
                    ${index === 0 ? "border-green-600 border-4" : ""}`}
                  />
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => eliminarImagen(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-[#4b8236] hover:bg-[#3d6e2d] text-white rounded-xl font-bold py-3 mt-6"
        >
          Crear {tipo}
        </button>
      </form>

      {/* PREVIEW */}
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm  hover:shadow-2xl transition-all w-[90%] max-w-[360px] text-left animate-in fade-in slide-in-from-bottom-20 duration-1000 fill-mode-both break-words">
        <div className="relative h-72 overflow-hidden">
          {imagenes.length > 0 ? (
            <img
              src={URL.createObjectURL(imagenes[0])}
              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 text-white"
            />
          ) : (
            <div className="w-full h-52 border rounded-xl flex items-center justify-center text-gray-400">
              Preview
            </div>
          )}
        </div>

        <div className="p-4 bg-white transition-colors break-words">
          <h2 className="text-xl font-bold mb-1 text-black break-words">
            {formData.nombre || "Nombre..."}
          </h2>

          {(tipo === "lugar" || tipo === "hospedaje") && (
            <p className="text-black  text-sm  gap-1 mb-3  break-words">
              {formData.descripcion || "Descripción..."}
            </p>
          )}
          <div className="flex items-center justify-between pt-2">
            <button className="text-[#20A217] font-semibold hover:cursor-pointer flex items-center gap-1 group/btn">
              Ver Detalles
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrearUniversal;
