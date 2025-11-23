import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../header/index";
import Footer from "../footer/index";
import "../panelAdmin/tailwind.css";
import Lugares from "../../pages/Lugares";

function Editar() {
  const { tipo, id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  //states para que los campos sean editables
  const [nombre, setNombre] = useState(Lugares.nombre || "");
  const [descripcion, setDescripcion] = useState(Lugares.descripcion || "");

  const endpoints = {
    lugares: `http://localhost:8000/api/lugares/${id}`,
    hospedaje: `http://localhost:8000/api/hospedajes/${id}`,
    usuario: `http://localhost:8000/api/usuario/${id}`,
  };

  const endpoint = endpoints[tipo];

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

  if (loading) return <p>cargando...</p>;
  if (!data) return <p>No se pudo encontrar el {tipo}</p>;

  return (
    <>
      <Header />
      <div className="w-full h-full flex flex-row items-center justify-evenly py-20">
        <form className="rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] w-3xl h-145 bg-gray-150 p-8 flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-[#60a244]">
            Editando {data.nombre}
          </h1>
          <label htmlFor="nombre" className="font-semibold text-[#60a244]">
            nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <label htmlFor="nombre" className="font-semibold text-[#60a244]">
            Descripción
          </label>
          <textarea
            type="text"
            name="nombre"
            className="h-25"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          <label className="font-semibold text-[#60a244]">
            imagen principal
          </label>
          <div className="flex gap-2">
            {data.imagenes.map((img) => (
              <img
                key={img.id}
                src={img.ruta} // ya tiene la URL completa
                alt={data.nombre}
                className="w-32 h-32 object-cover rounded"
              />
            ))}
          </div>
        </form>
        {/*resultado de la edición*/}
        <div className="w-lg shadow-[0_0_20px_rgba(0,0,0,0.05)] h-145 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-[#60a244]">resultado</h1>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Editar;
