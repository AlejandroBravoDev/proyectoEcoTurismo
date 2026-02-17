import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Importaciones de componentes */
import VerHospedajes from "./components/ver-hospedajes/ver-hospedajes.jsx";
import Login from "./components/login/login.jsx";
import ForgotPassword from "./components/login/ForgotPassword";
import Header from "./components/header/index.jsx";

/* Importaciones de paginas */
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
import ResetPassword from "./pages/ResetPassword";
import QueOfrecemosPage from "./pages/QueOfrecemosPage.jsx";
import FaqEcoturismoPage from "./pages/preguntasFrecuentes.jsx";
import HospedajesPage from "./pages/hospedajes.jsx";

/* 🔥 NUEVAS IMPORTACIONES */
import Contacto from "./pages/Contacto.jsx";
import Politicas from "./pages/Politicas.jsx";

function Rutas() {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />


      {/* RUTAS DE CONTENIDO */}
      <Route path="/lugares" element={<Lugares />} />
      <Route path="/lugares/:id" element={<VerLugares />} />
      <Route path="/hospedajes" element={<HospedajesPage />} />
      <Route path="/hospedajes/:id" element={<VerHospedajes />} />

      {/* RUTAS DE INFORMACIÓN */}
      <Route path="/ofrecemos" element={<QueOfrecemosPage />} />
      <Route path="/preguntasFrecuentes" element={<FaqEcoturismoPage />} />
      <Route path="/perfil" element={<PerfilUser />} />

      {/* RUTAS DE ADMINISTRACIÓN */}
      {/* 1. Panel General */}
      <Route path="/admin/panel" element={<Admin />} />

      {/* 2. Gestión de Usuarios */}
      <Route path="/admin/usuarios" element={<AdminUsers />} />
      <Route path="/admin/usuarios/:id" element={<EditarUsuario />} />

      {/* 3. Gestión de Lugares y Hospedajes (Edición/Listado) */}
      {/* He cambiado esto para que apunten al componente Editar o al que maneje tus tablas */}
      <Route path="/admin/lugares" element={<Admin />} />
      <Route path="/admin/hospedajes" element={<Admin />} />

      {/* 4. Creación y Edición específica */}
      <Route path="/admin/crear/:tipo" element={<AdminCrearPage />} />
      <Route path="/admin/editar/:tipo/:id" element={<Editar />} />

      {/* Compatibilidad con tu ruta anterior si se usa en otros botones */}
      <Route path="/pages/:tipo/:id" element={<Editar />} />

      <Route path="/preguntasFrecuentes" element={<FaqEcoturismoPage />} />

      {/* 🔥 NUEVAS RUTAS */}
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/politicas" element={<Politicas />} />

    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="pt-20">
          <Rutas />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
