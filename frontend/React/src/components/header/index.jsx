import { useState, useEffect } from "react";
import stylesHeader from "./header.module.css";
import usuarioDemo from "../../assets/usuarioDemo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LARAVEL_BASE_URL = "http://localhost:8000";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigate = useNavigate();

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
        const res = await axios.get("/api/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userAvatarPath = res.data.usuario.avatar;

        if (userAvatarPath) {
          setAvatarUrl(`${LARAVEL_BASE_URL}/storage/${userAvatarPath}`);
        } else {
          setAvatarUrl(usuarioDemo);
        }
      } catch (err) {
        console.warn("Fallo al cargar avatar del Header:", err);
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
          <Link to="/">
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
            <ul className={stylesHeader.navList}>
              <li>
                <Link to="/lugares">Lugares</Link>
              </li>
              <li>
                <Link to="/hospedajes">Hospedajes</Link>
              </li>
              <li className={stylesHeader.profileLink}>
                <Link to={profileLinkTarget}>
                  <img src={currentAvatar} alt="Perfil de Usuario" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
export default Header;
