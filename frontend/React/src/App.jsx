import { BrowserRouter, Routes, Route } from "react-router-dom";

/*importaciones de componentes */
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
import AdminCrearPage from "./pages/AdminCrear";
import ForgotPassword from "./components/login/ForgotPassword";
import ResetPassword from './pages/ResetPassword';


// ✅ IMPORTACIÓN CORRECTA DE HOSPEDAJES
import HospedajesPage from "./pages/hospedajes.jsx";

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/perfil" element={<PerfilUser />} />
      <Route path="/lugares" element={<Lugares />} />
      <Route path="/lugares/:id" element={<VerLugares />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      
      {/* ✅ RUTAS DE HOSPEDAJES CORREGIDAS */}
      <Route path="/hospedajes" element={<HospedajesPage />} />
      <Route path="/hospedajes/:id" element={<VerHospedajes />} />
      
      <Route path="/admin" element={<Admin />} />
      <Route path="/adminUsuarios" element={<AdminUsers />} />
      <Route path="/admin/usuarios/:id" element={<EditarUsuario />} />
      <Route path="/admin/crear/:tipo" element={<AdminCrearPage />} />
      <Route path="/admin/crear" element={<AdminCrearPage />} />
      
      {/* ruta dinámica para editar lugares, hospedajes o usuarios */}
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