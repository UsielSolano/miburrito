import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <h3>BÜRRITÜS</h3>
      <p>Síguenos en nuestras redes </p>
      <div className="redes">
        <a href="https://instagram.com/elktekomess" target="_blank" rel="noreferrer"> Instagram</a>
        <a href="https://tiktok.com/@elktekomess" target="_blank" rel="noreferrer"> TikTok</a>
        <a href="https://facebook.com/elktekomess" target="_blank" rel="noreferrer"> Facebook</a>
      </div>
      <p className="copyright">© 2024 Names'nt - Todos los derechos reservados</p>
    </footer>
  );
};

export default Footer;
