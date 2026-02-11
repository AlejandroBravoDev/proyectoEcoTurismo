import { useState, useEffect } from "react";
import usuarioDemo from "../../assets/usuarioDemo.png";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import axios from "axios";
import { AlignVerticalJustifyEnd } from "lucide-react";

const LARAVEL_BASE_URL = "http://localhost:8000";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const toggleMenu = () => setMenuOpen(!menuOpen); 
  const [user, setUser] = useState("") 


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

        setUser(res.data.usuario.nombre_completo)
        if (res.data?.usuario?.avatar_url) {
          setAvatarUrl(res.data.usuario.avatar_url);
        } else {
          setAvatarUrl(usuarioDemo);
        }
      } catch (err) {
        setAvatarUrl(usuarioDemo);
        if (err.response?.status === 401) localStorage.removeItem("token");
      }
    };
    fetchAvatar();
  }, []);

  const currentAvatar = avatarUrl || usuarioDemo;
  const profileLinkTarget = localStorage.getItem("token")
    ? "/perfil"
    : "/login";

  return (
    <div className="fixed top-0 w-full z-[99999]">
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-[99998]"
          onClick={toggleMenu}
        ></div>
      )}

      <header className="w-full h-20 flex bg-white px-[30px] items-center justify-between md:justify-around box-border z-[99999] relative">
        <div className="flex flex-row items-center z-[999999]">
          <Link
            to="/"
            className="flex flex-row items-center gap-4 no-underline transition-all duration-300"
          >
            <img src={logo} className="w-10" alt="Logo" />
            <h1 className="font-extrabold text-lg md:text-2xl whitespace-nowrap text-black">
              <span className="text-[#20A217]">ECO TURISMO</span>RISARALDA
            </h1>
          </Link>
        </div>

        <div
          className="flex lg:hidden flex-col justify-between w-[30px] h-[25px] cursor-pointer z-[999999]"
          onClick={toggleMenu}
        >
          <span
            className={`block w-full h-[3px] bg-black rounded-full transition-all duration-300 origin-left ${menuOpen ? "rotate-45" : ""}`}
          ></span>
          <span
            className={`block w-full h-[3px] bg-black rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 -translate-x-5" : ""}`}
          ></span>
          <span
            className={`block w-full h-[3px] bg-black rounded-full transition-all duration-300 origin-left ${menuOpen ? "-rotate-45" : ""}`}
          ></span>
        </div>

        <nav
          className={`
          fixed lg:relative top-20 lg:top-0 left-0 w-full lg:w-auto h-[calc(100vh-80px)] lg:h-20
          bg-[#f3f3f3] lg:bg-transparent flex flex-col lg:flex-row items-center justify-center lg:justify-between
          transition-transform duration-400 ease-in-out z-[999998] lg:translate-x-0
          ${menuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
        >
          <ul className="flex flex-col lg:flex-row items-center gap-10 lg:gap-[100px] list-none p-0 m-0 text-black">
            {["Lugares", "Hospedajes"].map((item) => (
              <li key={item} className="relative group text-black">
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="text-lg font-normal no-underline relative inline-block
                  after:content-[''] after:absolute after:w-0 after:h-[3px] after:-bottom-1 after:left-1/2 after:-translate-x-1/2 
                  after:bg-[#20A217] after:transition-all after:duration-300 group-hover:after:w-full text-black"
                >
                  {item}
                </Link>
              </li>
            ))}

            {!user ? (
              <li className="mt-4 lg:mt-0">
                <Link to="/registro">
                  <button className="w-40 h-11 text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors font-bold shadow-md">
                    Regístrate
                  </button>
                </Link>
              </li>
            ) : (
              <li className="lg:ml-10">
                <Link
                  to={profileLinkTarget}
                  className="flex flex-row items-center gap-3 no-underline font-medium"
                >
                  <img
                    src={currentAvatar}
                    className="w-16 h-16 lg:w-[50px] lg:h-[50px] rounded-full object-cover border-2 border-green-600 shadow-sm"
                    alt="Perfil"
                  />
                  <h1 className="text-black text-xl lg:text-base font-bold">
                    {user}
                  </h1>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
