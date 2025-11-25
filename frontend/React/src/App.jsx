import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PerfilUser from "./pages/PerfilUser.jsx";
import Lugares from "./pages/Lugares.jsx";
import VerLugares from "./pages/verLugares.jsx";
import Registro from "./pages/registro.jsx";
import Hospedajes from "./components/Hospedajes/Hospedajes.jsx";
import VerHospedajes from "./components/ver-hospedajes/ver-hospedajes.jsx";
import Login from "./components/login/login.jsx";
import Admin from "./pages/Admin.jsx";


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
      <Route path="/admin" element={<Admin />} />
      // CÓDIGO ORIGINAL (Ruta estática)
<Route path="/verHospedajes" element={<VerHospedajes />} />

// CÓDIGO CORREGIDO (Ruta dinámica)
<Route path="/verHospedajes/:id" element={<VerHospedajes />} />
      <Route path="/admin" element={<Admin />} />
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
