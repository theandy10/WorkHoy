import { Link, useNavigate } from 'react-router-dom';
import logo from '../recursos/logo.svg';

export default function Navbar() {
  const navigate = useNavigate();

  function irASobreNosotros(e) {
    e.preventDefault();
    if (window.location.pathname === '/') {
      document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    navigate('/');
    setTimeout(() => {
      document.getElementById('sobre-nosotros')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  }

  return (
    <header className="navbar">
      <div className="navbar-interior">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="WorkHoy" className="navbar-logo-img" />
          <span>WorkHoy</span>
        </Link>
        <nav className="navbar-links">
          <a href="/#sobre-nosotros" className="navbar-link" onClick={irASobreNosotros}>
            Sobre nosotros
          </a>
          <Link to="/login" className="navbar-link">
Iniciar sesión
          </Link>
          <Link to="/registro" className="boton boton-primario">
            Crear cuenta
          </Link>
        </nav>
      </div>
    </header>
  );
}