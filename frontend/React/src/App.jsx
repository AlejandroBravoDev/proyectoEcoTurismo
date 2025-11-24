import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

/*importaciones de componentes */
import Hospedajes from "./components/Hospedajes/Hospedajes.jsx";
import VerHospedajes from "./components/ver-hospedajes/ver-hospedajes.jsx";
import Login from "./components/login/login.jsx";

/*importaciones de paginas*/
import Home from "./pages/Home.jsx";
import Registro from "./pages/registro.jsx";
import Admin from "./pages/Admin.jsx";
import PerfilUser from "./pages/PerfilUser.jsx";
import Lugares from "./pages/Lugares.jsx";
import VerLugares from "./pages/verLugares.jsx";
import Editar from "./pages/AdminEditar.jsx";

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
      <Route path="/verHospedajes" element={<VerHospedajes />} />
      <Route path="/admin" element={<Admin />} />
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
