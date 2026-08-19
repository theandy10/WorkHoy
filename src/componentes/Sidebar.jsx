import { NavLink, useNavigate } from 'react-router-dom';
import { useUsuario } from '../contexto/UsuarioContext';
import logo from '../recursos/logo.svg';

function Icon({ tipo }) {
  const base = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (tipo) {
    case 'panel':
      return (
        <svg {...base}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'listo':
      return (
        <svg {...base}>
          <path d="M7 3h7l4 4v14H7V3z" />
          <line x1="11" y1="11" x2="11" y2="15" />
          <line x1="9" y1="13" x2="13" y2="13" />
        </svg>
      );
    case 'hoja':
      return (
        <svg {...base}>
          <path d="M7 3h7l4 4v14H7V3z" />
          <line x1="10" y1="12" x2="14" y2="12" />
          <line x1="10" y1="16" x2="14" y2="16" />
        </svg>
      );
    case 'hojaMas':
      return (
        <svg {...base}>
          <path d="M7 3h7l4 4v14H7V3z" />
          <line x1="11" y1="12" x2="15" y2="12" />
          <line x1="13" y1="10" x2="13" y2="14" />
        </svg>
      );
    case 'buscar':
      return (
        <svg {...base}>
          <circle cx="11" cy="11" r="6" />
          <line x1="15.5" y1="15.5" x2="21" y2="21" />
        </svg>
      );
    case 'carpeta':
      return (
        <svg {...base}>
          <path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
        </svg>
      );
    case 'usuario':
      return (
        <svg {...base}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
        </svg>
      );
    case 'salir':
      return (
        <svg {...base}>
          <path d="M14 5l7 7-7 7" />
          <path d="M21 12H9" />
        </svg>
      );
    default:
      return null;
  }
}

const MENU = {
  empresa: [
    { ruta: '/empresa/dashboard', texto: 'Dashboard', icono: 'panel' },
    { ruta: '/empresa/publicar', texto: 'Publicar vacante', icono: 'hojaMas' },
    { ruta: '/empresa/vacantes', texto: 'Mis vacantes', icono: 'hoja' },
    { ruta: '/perfil', texto: 'Mi perfil', icono: 'usuario' },
  ],
  trabajador: [
    { ruta: '/trabajador/buscar', texto: 'Buscar empleos', icono: 'buscar' },
    { ruta: '/trabajador/postulaciones', texto: 'Mis postulaciones', icono: 'carpeta' },
    { ruta: '/perfil', texto: 'Mi perfil', icono: 'usuario' },
  ],
};

export default function Sidebar() {
  const { sesion, cerrarSesion } = useUsuario();
  const navigate = useNavigate();

  if (!sesion) return null;

  const items = sesion.rol === 'empresa' ? MENU.empresa : MENU.trabajador;
  const inicio = sesion.rol === 'empresa' ? '/empresa/dashboard' : '/trabajador/buscar';

  function manejarCerrarSesion() {
    cerrarSesion();
    navigate('/');
  }

  return (
    <aside className="sidebar">
      <NavLink to={inicio} className="sidebar-logo">
        <img src={logo} alt="WorkHoy" className="sidebar-logo-img" />
        <span className="sidebar-logo-texto">WorkHoy</span>
      </NavLink>

      <nav className="sidebar-menu">
        {items.map((item) => (
          <NavLink
            key={item.ruta}
            to={item.ruta}
            className={({ isActive }) =>
              'sidebar-item' + (isActive ? ' sidebar-item-activo' : '')
            }
          >
            <span className="sidebar-icono">{<Icon tipo={item.icono} />}</span>
            <span className="sidebar-texto">{item.texto}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-usuario">
        <div className="sidebar-usuario-fila">
          <div className="sidebar-avatar">
            {sesion.avatar ? (
              <img src={sesion.avatar} alt={sesion.nombre} className="avatar-img" />
            ) : sesion.nombre ? (
              sesion.nombre.charAt(0).toUpperCase()
            ) : (
              'U'
            )}
          </div>
          <div className="sidebar-usuario-info">
            <span className="sidebar-nombre">{'Hola, ' + (sesion.nombre || 'usuario')}</span>
            <span className="sidebar-rol">
              {sesion.rol === 'empresa' ? 'Empresa' : 'Trabajador'}
              {sesion.distrito ? ' · ' + sesion.distrito : ''}
            </span>
          </div>
        </div>
        <button className="sidebar-cerrar" onClick={manejarCerrarSesion}>
          <Icon tipo="salir" />
          <span className="sidebar-cerrar-texto">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}