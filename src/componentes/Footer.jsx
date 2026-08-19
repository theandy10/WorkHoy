import { Link } from 'react-router-dom';
import logo from '../recursos/logo.svg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <div className="footer-columna footer-marca">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="WorkHoy" className="footer-logo-img" />
            <span>WorkHoy</span>
          </Link>
          <p className="footer-descripcion">
            Trabajo temporal, encontrado en minutos. Conectamos trabajadores con
            empresas de su distrito, con pago por hora o por turno.
          </p>
        </div>

        <div className="footer-columna">
          <h4 className="footer-titulo">Enlaces</h4>
          <Link to="/trabajador/buscar" className="footer-enlace">Buscar vacantes</Link>
          <Link to="/registro" className="footer-enlace">Crear cuenta</Link>
          <Link to="/login" className="footer-enlace">Iniciar sesión</Link>
          <Link to="/" className="footer-enlace">Cómo funciona</Link>
        </div>

        <div className="footer-columna">
          <h4 className="footer-titulo">Contacto</h4>
          <p className="footer-enlace">contacto@workhoy.com</p>
          <p className="footer-enlace">Lima, Perú</p>
          <p className="footer-enlace">Vacantes por distrito</p>
        </div>
      </div>

      <div className="footer-inferior">
        <p>&copy; {new Date().getFullYear()} WorkHoy · Trabajo temporal en Perú</p>
      </div>
    </footer>
  );
}