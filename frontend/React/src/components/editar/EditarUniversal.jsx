import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../panelAdmin/tailwind.css";
import Swal from "sweetalert2";

function Editar() {
  //se extraen los datos de la url
  const { tipo, id } = useParams();

  const api = "http://localhost:8000/api";

  //se definen las variables donde van los datos
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🛑 Nuevos states para el manejo de imágenes
  const [imagenPrincipal, setImagenPrincipal] = useState(null); // Archivo
  const [imagenPrincipalUrl, setImagenPrincipalUrl] = useState(""); // URL para previsualización

  //states para que los campos sean editables
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  //defino los endpoints que se van a usar en cualquier caso
  const endpoints = {
    lugares: `http://localhost:8000/api/lugares/${id}`,
    hospedaje: `http://localhost:8000/api/hospedajes/${id}`,
    usuario: `http://localhost:8000/api/usuario/${id}`,
  };

  const endpoint = endpoints[tipo];

  // useEffect para traer los datos de la DB con axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint);
        const lugarData = response.data; // Para Lugares, la respuesta es el objeto del lugar

        setData(lugarData);

        // Inicializamos los estados editables
        setNombre(lugarData.nombre || "");
        setDescripcion(lugarData.descripcion || "");

        // 🛑 Inicializamos la URL de previsualización con la imagen actual de la DB
        if (lugarData.imagen_principal_url) {
          setImagenPrincipalUrl(lugarData.imagen_principal_url);
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        Swal.fire({
          title: "Error",
          text: "Error al cargar los datos",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  // 🛑 Función para manejar la selección del archivo y la previsualización
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagenPrincipal(file); // Guardamos el archivo para enviarlo en handleUpdate

    // Creamos una URL temporal para la previsualización
    if (file) {
      setImagenPrincipalUrl(URL.createObjectURL(file));
    } else {
      // Si no hay archivo, volvemos a la imagen original
      setImagenPrincipalUrl(data.imagen_principal_url || "");
    }
  };

  // useEffect para actualizar los datos editados
  const handleUpdate = async (e) => {
    e.preventDefault();

    // 🛑 Usar FormData para enviar archivos y datos de texto juntos
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);

    // 🛑 Laravel necesita el método HTTP real (PUT)
    // Pero FormData solo soporta GET/POST. Usamos el campo _method para simularlo.
    formData.append("_method", "PUT");

    // Agregar la imagen solo si se seleccionó un archivo nuevo
    if (imagenPrincipal) {
      formData.append("imagen_principal", imagenPrincipal);
    }

    try {
      const token = localStorage.getItem("token");

      // 🛑 NOTA: Se usa POST en el código de axios porque FormData requiere un método que soporte cuerpo.
      // El campo _method='PUT' en FormData hace que Laravel lo maneje como PUT.
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Importante: no definir 'Content-Type', el navegador lo hace automáticamente para FormData
        },
      });

      // 🛑 Actualizar los datos locales con la respuesta del servidor
      const updatedLugar = response.data.lugar;
      setData(updatedLugar);
      setImagenPrincipal(null); // Limpiar el archivo seleccionado
      setImagenPrincipalUrl(updatedLugar.imagen_principal_url);

      Swal.fire({
        title: "Cambios guardados",
        text: `El ${tipo} se actualizó correctamente.`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
    } catch (err) {
      console.error(err);
      // Mostrar errores de validación si existen
      const errorMsg =
        err.response?.data?.message || "Error al editar los datos";
      Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
      });
    }
  };

  // carga
  if (loading) return <p>Cargando...</p>;

  if (!data) return <p>Error al cargar los datos</p>; // El Swal.fire está en useEffect

  return (
    <>
      <div className="w-full h-full flex flex-row items-center justify-evenly py-10 bg-rgba(0,0,0,0.05)">
        <form
          onSubmit={handleUpdate}
          className="rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] w-4xl h-170 bg-gray-150 p-8 flex flex-col gap-5 bg-white"
          className="rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] w-4xl h-170 bg-gray-150 p-8 flex flex-col gap-5 bg-white"
        >
          <h1 className="text-2xl font-bold text-[#60a244]">
            Editando {data.nombre}
          </h1>
          {/*Div que va a contener los campos para que el flex-wraped no se haga con el botón y quede bien bonito */}
          <div className="w-full h-110 flex flex-col flex-wrap gap-6">
            {/* Campo Nombre */}
            <label htmlFor="nombre" className="font-semibold text-[#60a244]">
              Nombre
            </label>
            <input
              type="text"
              maxLength="45"
              name="nombre"
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 w-[55%]"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            {/* Campo Descripción */}
            <label
              htmlFor="descripcion"
              className=" font-semibold text-[#60a244]"
            >
              Descripción
            </label>
            <textarea
              maxLength="250"
              name="descripcion"
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 w-[55%] h-40"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            {/* Imágenes existentes (Galería) */}
            <label className="font-semibold text-[#60a244]">
              Imágenes actuales
            </label>
            <div className="flex gap-2">
              {data?.todas_las_imagenes?.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Imagen ${index + 1} del lugar`}
                  className="w-20 h-20 object-cover rounded"
                />
              )) || <p>No hay imágenes</p>}
            </div>

            {/* Campo Subir Imagen Principal */}
            <label className="font-semibold text-[#60a244]">
              Subir nueva Imagen principal
            </label>
            <input
              type="file"
              name="imagen_principal"
              className="w-70 h-50 border-1"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <button
            type="submit"
            className="bg-[#4b8236] text-white border-0 rounded-xl font-bold py-3 px-6"
          >
            Completar edición
          </button>
        </form>

        {/* resultado de la edición (Previsualización) */}
        <div className="w-2lg shadow-[0_0_20px_rgba(0,0,0,0.05)] h-160 rounded-xl p-8 bg-white flex flex-col text-start items-center justify-center">
          {/* tarjeta en la que se va a ver lo editado */}
          <div className="w-80 bg-[#f9f9f9] rounded-2xl flex flex-col items-center py-5 gap-4 break-words overflow-hidden flex-wrap">
          <div className="w-80 bg-[#f9f9f9] rounded-2xl flex flex-col items-center py-5 gap-4 break-words overflow-hidden flex-wrap">
            <img
              src={imagenPrincipalUrl || "placeholder_default_url"} // Usa la URL de previsualización o un placeholder
              alt="Previsualización de Imagen"
              className="mt-4 mx-auto w-5/6 h-50 object-cover rounded-2xl border-1"
            />

            <h1 className="text-2xl font-bold ">{nombre}</h1>

            <p className="text-[.9rem] text-[#555] w-5/6 text-center">
              {descripcion}
            </p>

            <button className="bg-[#4b8236] text-white border-0 rounded-xl font-bold py-3 px-6">
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Editar;
