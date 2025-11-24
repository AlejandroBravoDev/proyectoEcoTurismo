//importación de componentes
import Header from "../components/header/index";
import Footer from "../components/footer/index";
import Editar from "../components/editar/EditarUniversal";

//importación de hooks que nos van a ayudar a las validaciones de logeo
import useAuthRedirect from "../hooks/useAuthRedirect";
import useAdminRedirect from "../hooks/useAdminRedirect";

function AdminEditarPage() {
  //si no es admin, lo envia a la pagina principal
  useAdminRedirect();

  //si no está loggeado, lo envia al loggin
  useAuthRedirect();

  return (
    <>
      <Header />
      <Editar />
      <Footer />
    </>
  );
}

export default AdminEditarPage;
