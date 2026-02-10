import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../panelAdmin/tailwind.css";
import Swal from "sweetalert2";
import { useDropzone } from "react-dropzone";

function Editar() {
  //se extraen los datos de la url
  const { tipo, id } = useParams();

  //se definen las variables donde van los datos
  const [data, setData] = useState(null);

  //se definen las variables que van a hacer la carga
  const [loading, setLoading] = useState(true);

  //states para que los campos sean editables
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  //states para el manejo de imagenes al editar los lugares
  const [imagenesExistentes, setImagenesExistentes] = useState([]);
  const [imagenesNuevas, setImagenesNuevas] = useState([]);

  //defino los endpoints que se van a usar en cualquier caso
  const endpoints = {
    lugares: `http://localhost:8000/api/lugares/${id}`,
    hospedajes: `http://localhost:8000/api/hospedajes/${id}`,
    usuario: `http://localhost:8000/api/usuario/${id}`,
  };

  
  const endpoint = endpoints[tipo];

  //useEffect para traer los datos de la DB con axios
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const response = await axios.get(endpoint);
        setData(response.data);

        // inicializamos los estados editables
        setNombre(response.data.nombre || "");
        setDescripcion(response.data.descripcion || "");
        setImagenesExistentes(response.data.todas_las_imagenes || []);
        setImagenesNuevas([]);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  //manejo y edición de imagenes del lugar
  const onDrop = (acceptedFiles) => {
    const total =
      acceptedFiles.length + imagenesExistentes.length + imagenesNuevas.length;

    if (total > 3) {
      Swal.fire("Máximo 3 imágenes");
      return;
    }

    setImagenesNuevas((prev) => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  const eliminarExistente = (index) => {
    setImagenesExistentes((prev) => prev.filter((_, i) => i !== index));
  };

  const eliminarNueva = (index) => {
    setImagenesNuevas((prev) => prev.filter((_, i) => i !== index));
  };

  //useEffect para acutalizar los datos editados
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);

      // imágenes que quedan
      formData.append(
        "imagenes_existentes",
        JSON.stringify(imagenesExistentes),
      );

      // nuevas imágenes
      imagenesNuevas.forEach((img) => {
        formData.append("imagenes_nuevas[]", img);
      });

      formData.append("_method", "PUT");
      await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Cambios guardados",
        icon: "success",
        confirmButtonColor: "green",
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error al actualizar");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (!data) return <p>Error</p>;

  const imagenPrincipal =
    imagenesExistentes[0] ||
    (imagenesNuevas[0] && URL.createObjectURL(imagenesNuevas[0])) ||
    "";

  return (
    <>
      <div className="w-full h-full flex flex-row items-center justify-evenly py-40 bg-rgba(0,0,0,0.05) ">
        <form
          onSubmit={handleUpdate}
          className="rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] w-4xl h-170 bg-gray-150 p-8 flex flex-col gap-5 bg-white"
        >
          <h1 className="text-2xl font-bold text-[#60a244]">
            Editando {data.nombre}
          </h1>
          {/*Div que va a contener los campos para que el flex-wraped no se haga con el botón y quede bien bonito */}
          <div className="w-full h-110 flex flex-col flex-wrap gap-6">
            <label htmlFor="nombre" className="font-semibold text-[#60a244]">
              nombre
            </label>
            <input
              type="text"
              maxlength="45"
              name="nombre"
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 w-[55%]"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <label htmlFor="nombre" className=" font-semibold text-[#60a244]">
              Descripción
            </label>
            <textarea
              maxlength="250"
              type="text"
              name="nombre"
              className="p-3 rounded-lg bg-gray-50 border border-gray-300 w-[55%] h-40  "
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            {/* IMÁGENES */}
            <label className="font-semibold text-[#60a244]">Imágenes</label>

            <div className="flex gap-4 flex-wrap">
              {imagenesExistentes.map((img, index) => (
                <div key={`old-${index}`} className="relative">
                  <img src={img} className="w-24 h-24 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => eliminarExistente(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}

              {imagenesNuevas.map((file, index) => (
                <div key={`new-${index}`} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => eliminarNueva(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {imagenesExistentes.length + imagenesNuevas.length < 3 && (
              <div
                {...getRootProps()}
                className="border-2 border-dashed p-6 rounded cursor-pointer w-[40%]"
              >
                <input {...getInputProps()} />
                <p>
                  Puedes subir{" "}
                  {3 - (imagenesExistentes.length + imagenesNuevas.length)}{" "}
                  imagen(es)
                </p>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#4b8236] text-white border-0 rounded-xl font-bold py-3 px-6"
          >
            Completar edición
          </button>
        </form>
        {/*resultado de la edición*/}
        <div className="w-2lg shadow-[0_0_20px_rgba(0,0,0,0.05)] h-160 rounded-xl p-8 bg-white flex flex-col text-start items-center justify-center">
          {/* tarjeta en la que se va a ver lo editado */}
          <div className="w-80 bg-[#f9f9f9] rounded-2xl flex flex-col items-center py-5 gap-4 break-words overflow-hidden flex-wrap">
            <img
              src={imagenPrincipal}
              className="w-full h-52 object-cover rounded"
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
