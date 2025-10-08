import React, { useState, useEffect } from "react";
import styles from "./PerfilUser.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// IMAGENES POR DEFECTO
import placeholderFotoUsuario from "../../assets/usuarioDemo.png";
import bannerFondo from "../../assets/img4.jpg";

import { FaHeart, FaMapMarkerAlt } from "react-icons/fa";

const LARAVEL_BASE_URL = "http://localhost:8000";

function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [pestanaActiva, setPestanaActiva] = useState("opiniones");
  const [menuOpcionesAbierto, setMenuOpcionesAbierto] = useState(false);
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const getImageUrl = (path, isBanner = false) => {
    if (path && typeof path === "string") {
      return `${LARAVEL_BASE_URL}/storage/${path}`;
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
      const res = await axios.get("/api/perfil", {
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
      setCargando(false);
      setError(null);
    } catch (err) {
      console.error("Error al cargar el perfil:", err.response || err);
      setError("No se pudo cargar el perfil. Por favor, inicie sesión.");
      setCargando(false);

      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
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
      data.append("_method", "PUT");

      const res = await axios.post("/api/perfil/update", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsuario(res.data.usuario);
      setPestanaActiva("opiniones");
      alert("Perfil actualizado con éxito!");
    } catch (err) {
      console.error("Error al actualizar perfil:", err.response || err);
      let errorMsg = "Error al actualizar. Revisa los datos.";
      if (err.response && err.response.data && err.response.data.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        errorMsg = err.response.data.errors[firstErrorKey][0];
      }
      alert(errorMsg);
    }
  };
  const alternarMenuOpciones = () => {
    setMenuOpcionesAbierto(!menuOpcionesAbierto);
  };

  const activarModoEdicion = () => {
    setPestanaActiva("editar");
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await axios.post("/api/logout", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.warn(
          "Advertencia: No se pudo revocar el token en el servidor. Limpiando localmente."
        );
      }
    }

    localStorage.removeItem("token");
    navigate("/login");
  };

  if (cargando) {
    return <div className={styles.loading}>Cargando perfil...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const totalComentarios = usuario.comentarios ? usuario.comentarios.length : 0;
  const totalFavoritos = usuario.favoritos ? usuario.favoritos.length : 0;

  const renderizarContenidoPerfil = () => {
    switch (pestanaActiva) {
      case "opiniones":
        if (totalComentarios === 0) {
          return (
            <p className={styles.mensajeVacio}>Aún no tienes opiniones.</p>
          );
        }
        return (
          <div className={styles.contenedorOpiniones}>
            <h3 className={styles.tituloSeccion}>
              Opiniones ({totalComentarios})
            </h3>
            {/* Aquí va el mapeo de usuario.comentarios */}
            <div className={styles.tarjetaOpinion}>{/* ... */}</div>
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
            <h3 className={styles.tituloSeccion}>
              Favoritos ({totalFavoritos})
            </h3>
            {/* Aquí va el mapeo de usuario.favoritos */}
            <div className={styles.tarjetaItemFavorito}>{/* ... */}</div>
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
              <label>Nombre</label>
              <input
                type="text"
                name="nombre_completo"
                value={formData.nombre_completo}
                onChange={handleEditChange}
              />
              <label>Correo</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEditChange}
              />

              <label>Foto de perfil</label>
              <div className={styles.areaCargaArchivo}>
                <span>
                  {formData.profilePictureFile
                    ? formData.profilePictureFile.name
                    : "Agrega una nueva imagen"}
                </span>
                <input
                  type="file"
                  name="profilePictureFile"
                  className={styles.inputArchivoOculto}
                  onChange={handleFileChange}
                />
              </div>
              <label>Foto de portada</label>
              <div className={styles.areaCargaArchivo}>
                <span>
                  {formData.bannerFile
                    ? formData.bannerFile.name
                    : "Agrega una nueva imagen"}
                </span>
                <input
                  type="file"
                  name="bannerFile"
                  className={styles.inputArchivoOculto}
                  onChange={handleFileChange}
                />
              </div>

              <label>ID</label>
              <input
                type="text"
                value={usuario.id}
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
        style={{ backgroundImage: `url(${getImageUrl(usuario.banner, true)})` }}
      ></div>
      <div className={styles.contenedorPrincipalPerfil}>
        <div className={styles.contenidoCabeceraPerfil}>
          <img
            src={getImageUrl(usuario.avatar)}
            alt="Perfil"
            className={styles.avatarPerfil}
          />
          <div className={styles.bloqueInfoUsuario}>
            <h3>{usuario.nombre_completo}</h3>
            <p className={styles.textoEmailUsuario}>{usuario.email}</p>
            <span className={styles.idCuentaUsuario}>ID: {usuario.id}</span>
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
