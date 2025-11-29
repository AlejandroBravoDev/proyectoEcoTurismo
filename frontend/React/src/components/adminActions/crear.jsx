import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function CrearUniversal() {
  const { tipo } = useParams();
  const navigate = useNavigate();

  const [municipios, setMunicipios] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagen_principal: "",
    precio: "",
    email: "",
    password: "",
    ubicacion: "",
    coordenadas: "",
    municipio_id: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  // 🔹 Cargar municipios de la BD
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/municipios"
        );
        setMunicipios(data);
      } catch (error) {
        console.error("Error al cargar municipios", error);
      }
    };

    if (tipo === "lugar" || tipo === "hospedaje") {
      fetchMunicipios();
    }
  }, [tipo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imagen_principal") {
      const file = files[0];
      setFormData({ ...formData, imagen_principal: file });

      // Imagen en base64 para previsualizar
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const endpoints = {
    lugar: "http://localhost:8000/api/lugares",
    hospedaje: "http://localhost:8000/api/hospedajes",
    usuario: "http://localhost:8000/api/usuarios",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const endpoint = endpoints[tipo];

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: `${tipo} creado`,
        text: `${tipo} creado correctamente`,
        icon: "success",
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo crear el registro", "error");
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-evenly py-14 bg-gray-100 px-6">
        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="w-[48%] bg-white rounded-2xl p-10 shadow flex flex-col gap-6 border border-gray-200"
        >
          <h1 className="text-3xl font-extrabold text-[#4b8236] capitalize mb-2">
            Crear {tipo}
          </h1>

          {/* CAMPOS PARA LUGAR Y HOSPEDAJE */}
          {(tipo === "lugar" || tipo === "hospedaje") && (
            <>
              {/* Nombre */}
              <label className="font-semibold text-[#4b8236]">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="p-3 rounded-lg bg-gray-50 border border-gray-300"
                value={formData.nombre}
                onChange={handleChange}
              />

              {/* Descripción */}
              <label className="font-semibold text-[#4b8236]">
                Descripción
              </label>
              <textarea
                name="descripcion"
                className="p-3 min-h-32 rounded-lg bg-gray-50 border border-gray-300"
                value={formData.descripcion}
                onChange={handleChange}
              />

              {/* Ubicación */}
              <label className="font-semibold text-[#4b8236]">Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                className="p-3 rounded-lg bg-gray-50 border border-gray-300"
                value={formData.ubicacion}
                onChange={handleChange}
              />

              {/* Coordenadas */}
              <label className="font-semibold text-[#4b8236]">
                Coordenadas
              </label>
              <input
                type="text"
                name="coordenadas"
                className="p-3 rounded-lg bg-gray-50 border border-gray-300"
                value={formData.coordenadas}
                onChange={handleChange}
              />

              {/* Municipio */}
              <label className="font-semibold text-[#4b8236]">Municipio</label>
              <select
                name="municipio_id"
                className="p-3 rounded-lg bg-gray-50 border border-gray-300"
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

              {/* Imagen principal */}
              <label className="font-semibold text-[#4b8236]">
                Imagenes del lugar (la primera imagen va a ser la que aparezca
                en la tarjeta)
              </label>
              <input
                type="file"
                name="imagen_principal"
                className="p-3 rounded-lg bg-gray-50 border border-gray-300"
                onChange={handleChange}
              />
            </>
          )}

          {/* CAMPOS TIPO = USUARIO */}
          {tipo === "usuario" && (
            <>
              <label className="font-semibold text-[#4b8236]">Nombre</label>
              <input
                type="text"
                name="nombre"
                className="p-3 rounded-lg bg-gray-50 border border-gray-300"
                value={formData.nombre}
                onChange={handleChange}
              />

              <label className="font-semibold text-[#4b8236]">Correo</label>
              <input
                type="email"
                name="email"
                className="p-3 rounded-lg bg-gray-50 border border-gray-300"
                value={formData.email}
                onChange={handleChange}
              />

              <label className="font-semibold text-[#4b8236]">Contraseña</label>
              <input
                type="password"
                name="password"
                className="p-3 rounded-lg bg-gray-50 border border-gray-300"
                value={formData.password}
                onChange={handleChange}
              />
            </>
          )}

          <button
            type="submit"
            className="bg-[#4b8236] hover:bg-[#3d6e2d] transition-all text-white rounded-xl font-bold py-3 px-8 mt-4 shadow-md"
          >
            Crear {tipo}
          </button>
        </form>

        {/* PREVIEW */}
        <div className="w-[34%] bg-white rounded-2xl p-8 shadow flex flex-col gap-5 items-center border border-gray-200">
          <h2 className="text-xl font-bold text-gray-700">Vista previa</h2>

          <div className="w-80 bg-white rounded-2xl flex flex-col items-center py-5 gap-4 shadow">
            <img
              src={previewImage}
              alt="Preview"
              className="w-5/6 h-52 object-cover rounded-xl border"
            />

            <h1 className="text-2xl font-bold text-gray-800 text-center">
              {formData.nombre || "Nombre..."}
            </h1>

            {(tipo === "lugar" || tipo === "hospedaje") && (
              <p className="text-sm text-gray-600 text-center">
                {formData.descripcion || "Descripción..."}
              </p>
            )}

            {tipo === "usuario" && (
              <p className="text-gray-600">{formData.email || "Correo..."}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CrearUniversal;
