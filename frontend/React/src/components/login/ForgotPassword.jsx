import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Login.module.css"; // reutilizamos estilos

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      const res = await axios.post("/api/forgot-password", { email });
      setMensaje(res.data.message);
      setEmail("");
    } catch (err) {
      setMensaje(
        err.response?.data?.message ||
          "Error al enviar el correo de recuperación"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.right}>
        <div className={styles.formBox}>
          <h2>Recuperar contraseña</h2>

          <form onSubmit={handleSubmit}>
            <label>Correo registrado</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar correo"}
            </button>
          </form>

          {mensaje && <p className={styles.mensaje}>{mensaje}</p>}

          <Link to="/login" className={styles.loginLink}>
            Volver al login
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;