import React, { useState, useEffect } from "react";
import styles from "./PerfilUser.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
// IMAGENES POR DEFECTO
import placeholderFotoUsuario from "../../assets/usuarioDemo.png";
import bannerFondo from "../../assets/img4.jpg";
// ICONOS
import { FaHeart, FaMapMarkerAlt, FaStar, FaTrashAlt } from "react-icons/fa";

const API_BASE = "http://localhost:8000";

function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [pestanaActiva, setPestanaActiva] = useState("opiniones");

  const navigate = useNavigate();

  const getImageUrl = (imageUrl, isBanner = false) => {
    if (imageUrl && typeof imageUrl === "string") {
      return imageUrl;
    }
    return isBanner ? bannerFondo : placeholderFotoUsuario;
  };

  const cargarPerfil = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(`${API_BASE}/api/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = res.data.usuario;
      setUsuario(userData);

      setFormData({
        nombre_completo: userData.nombre_completo || "",
        email: userData.email || "",
      });
      setError(null);
    } catch (err) {
      console.error(
        "Error al cargar el perfil:",
        err.response?.data || err.message || err,
      );
      setError("No se pudo cargar el perfil. Por favor, inicie sesión.");

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, [navigate]);

  const handleEditChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const data = new FormData();
      data.append("nombre_completo", formData.nombre_completo);
      data.append("email", formData.email);

      if (formData.profilePictureFile) {
        data.append("profilePictureFile", formData.profilePictureFile);
      }
      if (formData.bannerFile) {
        data.append("bannerFile", formData.bannerFile);
      }

      const res = await axios.post(`${API_BASE}/api/perfil/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUsuario(res.data.usuario);
      setPestanaActiva("opiniones");
      Swal.fire({
        title: "Perfil actualizado con exito",
        icon: "success",
      });
    } catch (err) {
      console.error(
        "Error al actualizar perfil:",
        err.response?.data || err.message || err,
      );
      let errorMsg = "Error al actualizar. Revisa los datos.";
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        errorMsg = err.response.data.errors[firstErrorKey][0];
      }
      Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error",
      });
    }
  };

  const activarModoEdicion = () => {
    setPestanaActiva("editar");
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.post(`${API_BASE}/api/logout`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.warn(
          "Advertencia: No se pudo revocar el token en el servidor. Limpiando localmente.",
        );
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const handleDeleteOpinion = async (comentarioId) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta opinión?")
    ) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`${API_BASE}/api/comentarios/${comentarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: "Opinión eliminada con éxito",
        icon: "success",
      });
      cargarPerfil();
    } catch (err) {
      console.error(
        "Error al eliminar opinión:",
        err.response?.data || err.message || err,
      );
      Swal.fire({
        title: "Error al eliminar la opinión",
        icon: "success",
      });
    }
  };

  const handleRemoveFavorite = async (lugarId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`${API_BASE}/api/favoritos/${lugarId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        favoritos: prevUsuario.favoritos.filter(
          (fav) => fav.lugar.id !== lugarId,
        ),
      }));

      Swal.fire({
        title: "Lugar eliminado de favoritos",
        icon: "success",
      });
    } catch (err) {
      console.error(
        "Error al eliminar favorito:",
        err.response?.data || err.message || err,
      );
      Swal.fire({
        title: "Error al eliminar el lugar de favoritos.",
        icon: "success",
      });
    }
  };

  const totalComentarios = usuario?.comentarios
    ? usuario.comentarios.length
    : 0;
  const totalFavoritos = usuario?.favoritos ? usuario.favoritos.length : 0;

  const TarjetaOpinion = ({ comentario }) => (
    <div className={styles.tarjetaOpinion}>
      <div className={styles.cabeceraOpinion}>
        <div className={styles.bloqueInfoAutor}>
          <img
            src={getImageUrl(usuario?.avatar_url)}
            alt="Autor"
            className={styles.fotoPequenaAutor}
          />
          <div className={styles.metaOpinion}>
            <h4>{usuario?.nombre_completo}</h4>
            <div className={styles.ratingStars}>
              {[...Array(5)].map((star, i) => (
                <FaStar
                  key={i}
                  color={i < comentario.rating ? "#facc15" : "#e4e5e9"}
                />
              ))}
            </div>
            <p className={styles.metaInfo}>
              {comentario.created_at} • {comentario.category}
            </p>
          </div>
        </div>

        {usuario?.id === comentario.usuario_id && (
          <div className={styles.accionesOpinion}>
            <button
              className={styles.botonEliminarOpinion}
              onClick={() => handleDeleteOpinion(comentario.id)}
            >
              <FaTrashAlt className={styles.iconoBasura} />
            </button>
          </div>
        )}
      </div>

      <p className={styles.textoOpinion}>{comentario.contenido}</p>
      {comentario.image_url && (
        <img
          src={comentario.image_url}
          alt="Foto del comentario"
          className={styles.imagenOpinion}
        />
      )}
      {comentario.lugar && (
        <>
          <div className={styles.infoLugarComentario}>
            <FaMapMarkerAlt className={styles.iconoLugarComentario} />
            <span className={styles.nombreLugarComentario}>
              {comentario.lugar.nombre}
            </span>
            <span className={styles.direccionLugarComentario}>
              ({comentario.lugar.direccion})
            </span>
          </div>
          <p className={styles.descripcionLugarOpinion}>
            {comentario.lugar.descripcion}
          </p>
        </>
      )}
    </div>
  );

  const TarjetaItemFavorito = ({ favorito }) => {
    const item = favorito?.lugar || favorito?.hospedaje;
    if (!item) return null;

    return (
      <div className={styles.tarjetaItemFavorito}>
        <img
          src={item?.imagen_url || bannerFondo}
          alt={item?.nombre || "Favorito"}
          className={styles.imagenItemFavorito}
        />
        <div className={styles.detallesItemFavorito}>
          <h4>{item?.nombre || "Nombre no disponible"}</h4>
          <p className={styles.descripcionLugarFavorito}>
            {item?.descripcion || "Descripción no disponible."}
          </p>
        </div>
        <FaHeart
          className={styles.iconoCorazonFavorito}
          onClick={() => handleRemoveFavorite(item.id)}
          title="Quitar de Favoritos"
        />
      </div>
    );
  };

  const renderizarContenidoPerfil = () => {
    if (!usuario) return null;

    switch (pestanaActiva) {
      case "opiniones":
        if (totalComentarios === 0) {
          return (
            <p className={styles.mensajeVacio}>Aún no tienes opiniones.</p>
          );
        }
        return (
          <div className={styles.contenedorOpiniones}>
            {usuario.comentarios.map((comentario) => (
              <TarjetaOpinion key={comentario.id} comentario={comentario} />
            ))}
          </div>
        );
      case "favoritos":
        if (totalFavoritos === 0) {
          return (
            <p className={styles.mensajeVacio}>
              Aún no tienes lugares favoritos.
            </p>
          );
        }
        return (
          <div className={styles.contenedorFavoritos}>
            {usuario.favoritos.map((favorito) => (
              <TarjetaItemFavorito key={favorito.id} favorito={favorito} />
            ))}
          </div>
        );
      case "editar":
        return (
          <div className={styles.contenedorFormularioEdicion}>
            <h3 className={styles.tituloSeccion}>Editar perfil</h3>
            <form
              className={styles.formularioEdicionPerfil}
              onSubmit={handleUpdate}
            >
              <label htmlFor="nombre_completo">Nombre</label>
              <input
                id="nombre_completo"
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo || ""}
                onChange={handleEditChange}
              />
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleEditChange}
              />
              <label htmlFor="profilePictureFile">Foto de perfil</label>
              <div className={styles.areaCargaArchivo}>
                <span>
                  {formData.profilePictureFile
                    ? formData.profilePictureFile.name
                    : "Agrega una nueva imagen"}
                </span>
                <input
                  id="profilePictureFile"
                  type="file"
                  name="profilePictureFile"
                  className={styles.inputArchivoOculto}
                  onChange={handleFileChange}
                />
              </div>
              <label htmlFor="bannerFile">Foto de portada</label>
              <div className={styles.areaCargaArchivo}>
                <span>
                  {formData.bannerFile
                    ? formData.bannerFile.name
                    : "Agrega una nueva imagen"}
                </span>
                <input
                  id="bannerFile"
                  type="file"
                  name="bannerFile"
                  className={styles.inputArchivoOculto}
                  onChange={handleFileChange}
                />
              </div>
              <label htmlFor="userId">ID</label>
              <input
                id="userId"
                type="text"
                value={usuario.id || ""}
                readOnly
                className={styles.campoSoloLectura}
              />
              <button type="submit" className={styles.botonGuardarPerfil}>
                Guardar
              </button>
              <button
                type="button"
                className={styles.botonCancelarEdicion}
                onClick={() => setPestanaActiva("opiniones")}
              >
                Cancelar
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className={styles.estructuraPaginaPerfil}>
      <div
        className={styles.bannerSuperior}
        style={{
          backgroundImage: `url(${getImageUrl(usuario?.banner_url, true)})`,
        }}
      ></div>
      <div className={styles.contenedorPrincipalPerfil}>
        <div className={styles.contenidoCabeceraPerfil}>
          <img
            src={getImageUrl(usuario?.avatar_url)}
            alt="Perfil"
            className={styles.avatarPerfil}
          />
          <div className={styles.bloqueInfoUsuario}>
            <h3>{usuario?.nombre_completo || "Usuario"}</h3>
            <p className={styles.textoEmailUsuario}>{usuario?.email || ""}</p>
            <span className={styles.idCuentaUsuario}>
              ID: {usuario?.id || "..."}
            </span>
          </div>
          <div className={styles.contenedorAcciones}>
            <button
              className={`${styles.botonEditarPerfil} ${
                pestanaActiva === "editar" ? styles.ocultoEnEdicion : ""
              }`}
              onClick={activarModoEdicion}
            >
              Editar perfil
            </button>
            <button className={styles.botonCerrarSesion} onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div className={styles.pestanasNavegacionPerfil}>
          <button
            className={`${styles.botonPestanaNavegacion} ${
              pestanaActiva === "opiniones" ? styles.pestanaActiva : ""
            }`}
            onClick={() => setPestanaActiva("opiniones")}
          >
            Opiniones <span>{totalComentarios}</span>
          </button>
          <button
            className={`${styles.botonPestanaNavegacion} ${
              pestanaActiva === "favoritos" ? styles.pestanaActiva : ""
            }`}
            onClick={() => setPestanaActiva("favoritos")}
          >
            Favoritos <span>{totalFavoritos}</span>
          </button>
        </div>
        <div className={styles.areaContenidoPestana}>
          {renderizarContenidoPerfil()}
        </div>
      </div>
    </main>
  );
}

export default PerfilUsuario;
