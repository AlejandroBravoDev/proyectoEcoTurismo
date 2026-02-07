import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Registro.module.css";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpg";
import img5 from "../../assets/img5.jpg";
import img6 from "../../assets/img6.jpg";
import { useNavigate } from "react-router-dom";

function Registro() {
  const [formData, setFormData] = useState({
    nombre_completo: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [mensaje, setMensaje] = useState("");
  const sliderImages = [img1, img2, img3, img4, img5, img6];
  const totalImages = sliderImages.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await axios.post("/api/register", formData);

      const token = res.data.token;
      const usuario = res.data.usuario;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      setMensaje("¡Registro exitoso! Redirigiendo...");
      setFormData({
        nombre_completo: "",
        email: "",
        password: "",
        password_confirmation: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      let errorMsg = "No se pudo registrar. Verifica tus datos.";

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        errorMsg = errors[firstKey][0];
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      setMensaje(errorMsg);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === totalImages - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [totalImages]);

  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <div className={styles.formBox}>
          <h2>Registro</h2>

          <form onSubmit={handleSubmit}>
            <label>Nombre</label>
            <input
              type="text"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              required
            />

            <label>Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Confirmar contraseña</label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />

            <button type="submit">Registrarse</button>
          </form>

          {mensaje && <p className={styles.mensaje}>{mensaje}</p>}

          <p className={styles.loginText}>¿Ya estás registrado?</p>
          <a href="/login" className={styles.loginLink}>
            Iniciar Sesión
          </a>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.sliderTrack}>
          {sliderImages.map((imgSrc, index) => (
            <div
              key={index}
              className={`${styles.sliderItem} ${
                index === currentIndex ? styles.active : ""
              }`}
            >
              <img src={imgSrc} alt={`Slider ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Registro;