import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Lugares from "../../pages/Lugares";
import "../panelAdmin/tailwind.css";
import Swal from "sweetalert2";

function Editar() {
  //se extraen los datos de la url
  const { tipo, id } = useParams();

  //se definen las variables donde van los datos
  const [data, setData] = useState(null);

  //se definen las variables que van a hacer la carga
  const [loading, setLoading] = useState(true);

  //states para que los campos sean editables
  const [nombre, setNombre] = useState(Lugares.nombre || "");
  const [descripcion, setDescripcion] = useState(Lugares.descripcion || "");

  //defino los endpoints que se van a usar en cualquier caso
  const endpoints = {
    lugares: `http://localhost:8000/api/lugares/${id}`,
    hospedaje: `http://localhost:8000/api/hospedajes/${id}`,
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
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  //useEffect para acutalizar los datos editados
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        endpoint,
        { nombre, descripcion },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        title: "Cambios guardados",
        text: `el ${tipo} se actualizó correctamente`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "green",
      });
    } catch (err) {
      console.error(err);
      alert("error al editar los datos");
    }
  };

  //carga

  if (loading) return <p>cargando...</p>;
  if (!data)
    return Swal.fire({
      title: "Error",
      text: "Error al cargar los datos",
      icon: "error",
    });

  return (
    <>
      <div className="w-full h-full flex flex-row items-center justify-evenly py-10 bg-rgba(0,0,0,0.05)">
        <form
          onSubmit={handleUpdate}
          className="rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.05)] w-4xl h-170 bg-gray-150 p-8 flex flex-col gap-5 flex-wrap bg-white"
        >
          <h1 className="text-2xl font-bold text-[#60a244]">
            Editando {data.nombre}
          </h1>
          <label htmlFor="nombre" className="font-semibold text-[#60a244]">
            nombre
          </label>
          <input
            type="text"
            name="nombre"
            className="shadow-[0_0_20px_rgba(0,0,0,0.3)] p-3 w-110 h-10 rounded-lg"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <label htmlFor="nombre" className=" font-semibold text-[#60a244]">
            Descripción
          </label>
          <textarea
            type="text"
            name="nombre"
            className="shadow-[0_0_20px_rgba(0,0,0,0.3)] p-3 w-110 h-38 bg-white border-[#555] rounded-lg"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <label className="font-semibold text-[#60a244]">
            imagen principal
          </label>
          <div className="flex gap-2">
            {data?.imagenes?.map((img) => (
              <img
                key={img.id}
                src={img}
                alt="Imagen del lugar"
                className="w-20 h-20 object-cover rounded"
              />
            )) || <p>No hay imágenes</p>}
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
          <div className="w-80 bg-[#f9f9f9] rounded-2xl flex flex-col items-center py-5 gap-4">
            <img
              src=""
              alt="Imagen"
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
