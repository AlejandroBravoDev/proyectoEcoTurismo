//importación de componentes
import Header from "../components/header/index";
import Footer from "../components/footer/index";
import Crear from "../components/adminActions/crear";
import { useParams } from "react-router-dom";

//importación de hooks que nos van a ayudar a las validaciones de logeo
import useAuthRedirect from "../hooks/useAuthRedirect";
import useAdminRedirect from "../hooks/useAdminRedirect";

function AdminCrearPage() {
  //si no es admin, lo envia a la pagina principal
  useAdminRedirect();

  //si no está loggeado, lo envia al loggin
  useAuthRedirect();

  return (
    <>
      <Header />
      <Crear tipo={useParams().tipo} />
      <Footer />
    </>
  );
}

export default AdminCrearPage;
