import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAdminRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    // Si no hay usuario o no es admin → redirigir al inicio
    if (!usuarioGuardado) {
      navigate("/login");
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    if (usuario.rol !== "admin") {
      navigate("/"); // Redirige a la página principal
    }
  }, [navigate]);
}
