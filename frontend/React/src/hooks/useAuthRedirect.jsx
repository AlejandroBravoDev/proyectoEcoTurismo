import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuario = localStorage.getItem("usuario");

    // Si no hay sesión, redirige al login
    if (!token || !usuario) {
      navigate("/login");
    }
  }, [navigate]);
}

export default useAuthRedirect;
