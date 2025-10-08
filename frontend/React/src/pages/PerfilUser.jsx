import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import PerfilUsuario from "../components/PerfilUser/index.jsx";

function PerfilUser() {
  return (
    <div className="nueva-interfaz-page">
      <Header />

      <PerfilUsuario />
      <Footer />
    </div>
  );
}

export default PerfilUser;
