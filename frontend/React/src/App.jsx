import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

/*importaciones de componentes */
import Hospedajes from "./components/Hospedajes/Hospedajes.jsx";
import VerHospedajes from "./components/ver-hospedajes/ver-hospedajes.jsx";
import Login from "./components/login/login.jsx";

/*importaciones de paginas*/
import Home from "./pages/Home.jsx";
import Registro from "./pages/registro.jsx";
import Admin from "./pages/Admin.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import EditarUsuario from "./pages/EditarUsuario.jsx";
import PerfilUser from "./pages/PerfilUser.jsx";
import Lugares from "./pages/Lugares.jsx";
import VerLugares from "./pages/verLugares.jsx";
import Editar from "./pages/AdminEditar.jsx";
// import Crear from "./components/adminActions/crear.jsx";
import AdminCrearPage from "./pages/AdminCrear";

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/perfil" element={<PerfilUser />} />
      <Route path="/lugares" element={<Lugares />} />
      <Route path="/lugares/:id" element={<VerLugares />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/hospedajes" element={<Hospedajes />} />
      <Route path="/verHospedajes/:id" element={<VerHospedajes />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/adminUsuarios" element={<AdminUsers />} />
      <Route path="/admin/usuarios/:id" element={<EditarUsuario />} />
      <Route path="/admin/crear/:tipo" element={<AdminCrearPage />} />
      <Route path="/admin/crear" element={<AdminCrearPage />} />
      {/* <Route path="/crear/:tipo" element={<Crear />} />
      <Route path="/crear" element={<Crear />} /> */}
      /*ruta dinamica para editar lugares, hospedajes o usuarios*/
      <Route path="/pages/:tipo/:id" element={<Editar />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Rutas />
      </div>
    </BrowserRouter>
  );
}

export default App;