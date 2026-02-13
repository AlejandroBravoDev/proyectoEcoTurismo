import { useState, useEffect } from "react";
import usuarioDemo from "../../assets/usuarioDemo.png";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import axios from "axios";
import { HelpCircle, Phone, Info, LayoutGrid, LogIn } from "lucide-react";

const LARAVEL_BASE_URL = "http://localhost:8000";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [user, setUser] = useState("");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = !menuOpen ? "hidden" : "auto";
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setAvatarUrl(usuarioDemo);
        return;
      }
      try {
        const res = await axios.get(`${LARAVEL_BASE_URL}/api/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.usuario.nombre_completo);
        setAvatarUrl(res.data.usuario.avatar_url || usuarioDemo);
      } catch (err) {
        setAvatarUrl(usuarioDemo);
        if (err.response?.status === 401) localStorage.removeItem("token");
      }
    };
    fetchAvatar();
  }, []);

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
              <span className="font-light text-slate-400">RISARALDA</span>
            </h1>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-10">
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
                {user.split(" ")[0]}
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
          className={`absolute right-0 top-0 h-full w-[80%] max-w-[350px] bg-white transition-transform duration-500 ease-out flex flex-col ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-10 border-b border-slate-50 flex items-center bg-slate-50/50">
            {user ? (
              <div className="flex items-center gap-5">
                <img
                  src={avatarUrl || usuarioDemo}
                  className="w-16 h-16 rounded-full border-2 border-[#20A217] shadow-md object-cover"
                  alt="Perfil"
                />
                <div>
                  <p className="text-[10px] font-bold text-[#20A217] uppercase tracking-widest mb-1">
                    Bienvenido
                  </p>
                  <p className="text-xl font-black text-slate-800 leading-tight">
                    {user.split(" ")[0]}
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

          <div className="flex-grow overflow-y-auto py-10 px-10">
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[3px] mb-8">
              Explorar
            </p>
            <ul className="list-none p-0 m-0 space-y-7">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    onClick={toggleMenu}
                    className="text-3xl font-black text-slate-800 no-underline block hover:text-[#20A217] transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-12 pt-12 border-t border-slate-50">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[3px] mb-8">
                Ayuda y Contacto
              </p>
              <ul className="list-none p-0 m-0 space-y-8">
                {subNavItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      onClick={toggleMenu}
                      className="flex items-center gap-5 text-slate-600 font-bold text-base no-underline group"
                    >
                      <span className="text-[#20A217] opacity-60 group-hover:opacity-100 transition-opacity">
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-10">
            {" "}
            {!user ? (
              <Link
                to="/registro"
                onClick={toggleMenu}
                className="no-underline"
              >
                <button className="w-full py-5 bg-[#20A217] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all">
                  Crear Cuenta
                </button>
              </Link>
            ) : (
              <Link to="/perfil" onClick={toggleMenu} className="no-underline">
                <button className="w-full py-5 border-2 border-slate-100 text-slate-800 rounded-2xl font-bold active:scale-95 transition-all uppercase tracking-widest text-sm">
                  Mi Perfil
                </button>
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Header;
