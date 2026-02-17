import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  HelpCircle,
  Phone,
  Info,
  LayoutGrid,
  LogIn,
  Settings,
  LayoutDashboard,
  Users,
} from "lucide-react";
import logo from "../../assets/logo.png";
import usuarioDemo from "../../assets/usuarioDemo.png";

const LARAVEL_BASE_URL = "http://localhost:8000";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("usuario_cache");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [avatarUrl, setAvatarUrl] = useState(() => {
    const savedUser = localStorage.getItem("usuario_cache");
    return savedUser ? JSON.parse(savedUser).avatar_url : usuarioDemo;
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = !menuOpen ? "hidden" : "auto";
  };

  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = "auto";
  }, [location.pathname]);

  useEffect(() => {
    const fetchAvatar = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setAvatarUrl(usuarioDemo);
        localStorage.removeItem("usuario_cache");
        return;
      }

      try {
        const res = await axios.get(`${LARAVEL_BASE_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data.usuario;
        setUser(userData);
        setAvatarUrl(userData.avatar_url || usuarioDemo);
        localStorage.setItem("usuario_cache", JSON.stringify(userData));
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario_cache");
          setUser(null);
          setAvatarUrl(usuarioDemo);
        }
      }
    };

    fetchAvatar();
  }, [location.pathname]);

  const handleAdminChange = (e) => {
    const value = e.target.value;
    if (value) {
      navigate(value);
      e.target.value = "";
    }
  };

  const navItems = [
    { name: "Lugares", path: "/lugares" },
    { name: "Hospedajes", path: "/hospedajes" },
  ];

  const subNavItems = [
    {
      name: "¿Qué ofrecemos?",
      path: "/ofrecemos",
      icon: <LayoutGrid size={18} />,
    },
    {
      name: "Preguntas Frecuentes",
      path: "/preguntasFrecuentes",
      icon: <HelpCircle size={18} />,
    },
    { name: "Contacto", path: "/contacto", icon: <Phone size={18} /> },
    { name: "Sobre nosotros", path: "/nosotros", icon: <Info size={18} /> },
  ];

  return (
    <div className="fixed top-0 w-full z-[99999] font-['Montserrat'] shadow-sm">
      <header className="w-full h-20 flex bg-white px-6 md:px-12 items-center justify-between z-[99999] relative border-b border-gray-100">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img src={logo} className="w-10 md:w-11" alt="Logo" />
            <h1 className="font-black text-xl md:text-2xl tracking-tighter text-slate-800">
              <span className="text-[#20A217]">ECO</span>TURISMO
              <span className="font-light text-slate-400 ml-1">RISARALDA</span>
            </h1>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {user?.rol === "admin" && (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-200 transition-all group">
              <Settings
                size={16}
                className="text-[#20A217] group-hover:rotate-90 transition-transform duration-500"
              />
              <select
                onChange={handleAdminChange}
                defaultValue=""
                className="bg-transparent text-[11px] font-bold text-slate-700 uppercase tracking-widest outline-none cursor-pointer border-none p-0 focus:ring-0"
              >
                <option value="" disabled>
                  Gestionar
                </option>
                <option value="/admin/panel">Panel General</option>
                <option value="/admin/usuarios">Gestionar Usuarios</option>
              </select>
            </div>
          )}

          <ul className="flex items-center gap-8 list-none m-0 p-0">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="text-slate-600 font-bold hover:text-[#20A217] transition-colors text-sm uppercase tracking-widest no-underline"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

          {!user ? (
            <Link to="/registro">
              <button className="px-6 py-2 bg-[#20A217] text-white rounded-full font-bold hover:bg-[#1a8212] transition-all shadow-md text-sm uppercase tracking-widest">
                REGÍSTRATE
              </button>
            </Link>
          ) : (
            <Link
              to="/perfil"
              className="flex items-center gap-3 bg-slate-50 p-1 pr-4 rounded-full border border-slate-100 hover:bg-slate-100 transition-all no-underline"
            >
              <img
                src={avatarUrl || usuarioDemo}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#20A217] shadow-sm"
                alt="Perfil"
              />
              <span className="text-slate-800 font-bold text-xs uppercase tracking-tight">
                {user.nombre_completo?.split(" ")[0]}
              </span>
            </Link>
          )}
        </nav>

        <button
          className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-[100001] relative"
          onClick={toggleMenu}
        >
          <span
            className={`block w-6 h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-slate-800 rounded-full transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          ></span>
        </button>
      </header>

      <div className="hidden lg:flex w-full bg-[#f8fcf8] border-b border-gray-100 py-2.5 justify-center">
        <div className="flex gap-10">
          {subNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-2 text-[10px] uppercase tracking-[2.5px] font-bold text-slate-400 hover:text-[#20A217] transition-colors no-underline group"
            >
              <span className="text-[#20A217]/60 group-hover:text-[#20A217] transition-colors">
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[100000] lg:hidden transition-all duration-500 ${menuOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={toggleMenu}
        ></div>
        <aside
          className={`absolute right-0 top-0 h-full w-[85%] max-w-[350px] bg-white transition-transform duration-500 ease-out flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-8 border-b border-slate-50 flex items-center bg-slate-50/50">
            {user ? (
              <div className="flex items-center gap-5">
                <img
                  src={avatarUrl || usuarioDemo}
                  className="w-14 h-14 rounded-full border-2 border-[#20A217] shadow-md object-cover"
                  alt="Perfil"
                />
                <div>
                  <p className="text-[10px] font-bold text-[#20A217] uppercase tracking-widest mb-1">
                    {user.rol === "admin" ? "Administrador" : "Bienvenido"}
                  </p>
                  <p className="text-xl font-black text-slate-800 leading-tight">
                    {user.nombre_completo?.split(" ")[0]}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                  <LogIn size={24} />
                </div>
                <p className="text-lg font-black text-slate-800">
                  Menú Principal
                </p>
              </div>
            )}
          </div>
          <div className="flex-grow overflow-y-auto p-8">
            {user?.rol === "admin" && (
              <div className="mb-10">
                <p className="text-[11px] font-bold text-amber-500 uppercase tracking-[3px] mb-6">
                  Administración
                </p>
                <div className="space-y-4">
                  <Link
                    to="/admin/panel"
                    className="flex items-center gap-4 text-slate-700 font-bold no-underline"
                  >
                    <LayoutDashboard size={20} className="text-amber-500" />{" "}
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/usuarios"
                    className="flex items-center gap-4 text-slate-700 font-bold no-underline"
                  >
                    <Users size={20} className="text-amber-500" /> Usuarios
                  </Link>
                </div>
                <div className="h-[1px] bg-slate-100 w-full mt-8"></div>
              </div>
            )}
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[3px] mb-8">
              Explorar
            </p>
            <ul className="list-none p-0 m-0 space-y-7">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-3xl font-black text-slate-800 no-underline block hover:text-[#20A217] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-8">
            <Link to={user ? "/perfil" : "/registro"} className="no-underline">
              <button
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${user ? "bg-slate-100 text-slate-800" : "bg-[#20A217] text-white"}`}
              >
                {user ? "Mi Perfil" : "Crear Cuenta"}
              </button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Header;
