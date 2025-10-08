import stylesFooter from "./footer.module.css";

function Footer() {
  return (
    <footer className={stylesFooter.footer}>
      <div className={stylesFooter.containerFooter}>
        <div className={stylesFooter.footerRow}>
          <div className={stylesFooter.footerLinks}>
            <h4>
              <span>ECO</span>TURISMO
            </h4>
            <ul>
              <li>
                <a href="#">Nosotros</a>
              </li>
              <li>
                <a href="#">Nuestros servicos</a>
              </li>
              <li>
                <a href="#">Politica de privacidad</a>
              </li>
            </ul>
          </div>
          <div className={stylesFooter.footerLinks}>
            <h4>Ayuda</h4>
            <ul>
              <li>
                <a href="#">Ubicaciones</a>
              </li>
              <li>
                <a href="#">Preguntas</a>
              </li>
              <li>
                <a href="#">Contacto</a>
              </li>
              <li>
                <a href="#">Hospedajes</a>
              </li>
            </ul>
          </div>
          <div className={stylesFooter.footerLinks}>
            <h4>Tienda</h4>
            <ul>
              <li>
                <a href="#">Sitios Ecoturisticos</a>
              </li>
              <li>
                <a href="#">Plataformas</a>
              </li>
              <li>
                <a href="#">Contenido</a>
              </li>
            </ul>
          </div>
          <div className={stylesFooter.footerLinks}>
            <h4>Siguenos</h4>
            <div className={stylesFooter.socialLink}>
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
