import { useState, useEffect } from "react";
import stylesHeader from "./header.module.css";
import usuarioDemo from "../../assets/usuarioDemo.png";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import axios from "axios";

const LARAVEL_BASE_URL = "http://localhost:8000";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("usuario"));
  console.log(user);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response de fetchAvatar:", res.data); // Log para debug

        if (!res.data || !res.data.usuario || !res.data.usuario.avatar_url) {
          console.warn("No se encontró avatar_url, usando default");
          setAvatarUrl(usuarioDemo);
          return;
        }

        setAvatarUrl(res.data.usuario.avatar_url);
      } catch (err) {
        console.warn(
          "Fallo al cargar avatar del Header:",
          err.response?.data || err.message || err,
        );
        setAvatarUrl(usuarioDemo);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
        }
      }
    };

    fetchAvatar();
  }, []);

  const currentAvatar = avatarUrl || usuarioDemo;
  const profileLinkTarget = localStorage.getItem("token")
    ? "/perfil"
    : "/login";

  return (
    <div className={stylesHeader.headerContainer}>
      {menuOpen && (
        <div className={stylesHeader.pageOverlay} onClick={toggleMenu}></div>
      )}

      <header className={stylesHeader.header}>
        <div className={stylesHeader.containerLogo}>
          <Link to="/" className="w-full flex flex-row items-center gap-4">
            <img src={logo} className="w-10" />
            <h1>
              <span className={stylesHeader.titleSpan}>ECO TURISMO</span>
              RISARALDA
            </h1>
          </Link>
        </div>

        <div className={stylesHeader.iconAndMenuWrapper}>
          <div className={stylesHeader.menuToggle} onClick={toggleMenu}>
            <div className={stylesHeader.hamburgerIcon}>
              <span
                className={`${stylesHeader.bar} ${
                  menuOpen ? stylesHeader.barTop : ""
                }`}
              ></span>
              <span
                className={`${stylesHeader.bar} ${
                  menuOpen ? stylesHeader.barMiddle : ""
                }`}
              ></span>
              <span
                className={`${stylesHeader.bar} ${
                  menuOpen ? stylesHeader.barBottom : ""
                }`}
              ></span>
            </div>
          </div>
          <nav
            className={`${stylesHeader.containerLinks} ${
              menuOpen ? stylesHeader.menuOpen : ""
            }`}
          >
            {!user ? (
              <div className="w-full flex flex-row gap-100">
                <ul className="h-10 w-70 flex flex-row items-center justify-around">
                  <li className="text-lg text-[#4A4A4A]">
                    <Link
                      to="/login"
                      className="text-lg text-[#4A4A4A ]  relative after:content-[''] after:absolute after:w-0 after:h-[3px] after:-bottom-[5px] after:left-1/2 after:-translate-x-1/2 after:bg-[#20A217] after:transition-all after:duration-300 hover:after:w-full"
                    >
                      Lugares
                    </Link>
                  </li>
                  <li className="text-lg text-[#4A4A4A]">
                    <Link
                      to="/login"
                      className="text-lg text-[#4A4A4A ]  relative after:content-[''] after:absolute after:w-0 after:h-[3px] after:-bottom-[5px] after:left-1/2 after:-translate-x-1/2 after:bg-[#20A217] after:transition-all after:duration-300 hover:after:w-full"
                    >
                      Hospedajes
                    </Link>
                  </li>
                </ul>
                <Link to="/register">
                  <button className=" w-40 h-11 text-white bg-green-600 rounded-4xl">
                    Registrate
                  </button>
                </Link>
              </div>
            ) : (
              <div className="w-full flex flex-row gap-100">
                <ul className="h-10 w-70 flex flex-row items-center justify-around">
                  <li className="text-lg text-[#4A4A4A ]  relative after:content-[''] after:absolute after:w-0 after:h-[3px] after:-bottom-[5px] after:left-1/2 after:-translate-x-1/2 after:bg-[#20A217] after:transition-all after:duration-300 hover:after:w-full">
                    <Link to="/lugares">Lugares</Link>
                  </li>
                  <li className="text-lg text-[#4A4A4A ]  relative after:content-[''] after:absolute after:w-0 after:h-[3px] after:-bottom-[5px] after:left-1/2 after:-translate-x-1/2 after:bg-[#20A217] after:transition-all after:duration-300 hover:after:w-full">
                    <Link to="/hospedajes">Hospedajes</Link>
                  </li>
                </ul>
                <div className={stylesHeader.profileLink}>
                  <Link to={profileLinkTarget}>
                    <img src={currentAvatar} alt="Perfil de Usuario" />
                    <h1 className="text-black">{user.nombre_completo}</h1>
                  </Link>
                </div>
              </div>
            )}
          </nav>
        </div>
        {/* <div className="w-70 h-11 flex items-center justify-center"></div> */}
      </header>
    </div>
  );
}

export default Header;
