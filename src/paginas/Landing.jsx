import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useUsuario } from '../contexto/UsuarioContext';
import { useVacantes } from '../contexto/VacantesContext';
import { DISTRITOS } from '../datos/datosIniciales';

function IconoMaletin() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function IconoPin() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconoBuscar() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="6" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </svg>
  );
}

function IconoRayo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}

function IconoEstrella() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.7 5.5 6.3.9-4.5 4.4 1 6.1-5.5-2.9-5.5 2.9 1-6.1L3 9.4l6.3-.9L12 3z" />
    </svg>
  );
}

function IconoDocumento() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" />
      <path d="M14 3v6h6" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

export default function Landing() {
  const { sesion } = useUsuario();
  const { vacantes, postulaciones } = useVacantes();
  const navigate = useNavigate();

  const [cargo, setCargo] = useState('');
  const [lugar, setLugar] = useState('');

  if (sesion) {
    return <Navigate to={sesion.rol === 'empresa' ? '/empresa/dashboard' : '/trabajador/buscar'} replace />;
  }

  function manejarBusqueda(e) {
    e.preventDefault();
    const texto = cargo ? '?texto=' + encodeURIComponent(cargo) : '?';
    const distrito = lugar ? '&distrito=' + encodeURIComponent(lugar) : '';
    navigate('/trabajador/buscar' + texto + distrito);
  }

  const mesActual = new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });

  return (
    <div className="pagina-landing">
      <header className="hero-plataforma">
        <h1 className="hero-titulo">¡Ahora es el momento de trabajar!</h1>
        <p className="hero-subtitulo">Encuentra el empleo temporal que encaja contigo</p>

        <p className="hero-mensaje">
          ¿Buscas trabajo <strong>por días</strong> o en cualquier momento?{' '}
          <span className="hero-mensaje-clave">Este es el lugar correcto</span>
        </p>

        <form className="buscador-empleos" onSubmit={manejarBusqueda}>
          <div className="buscador-campo">
            <span className="buscador-icono"><IconoMaletin /></span>
            <input
              className="buscador-input"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Cargo o área"
            />
          </div>
          <div className="buscador-divisor" />
          <div className="buscador-campo">
            <span className="buscador-icono"><IconoPin /></span>
            <input
              className="buscador-input"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Distrito (Lugar)"
            />
          </div>
          <button type="submit" className="buscador-boton">
            <IconoBuscar /> Buscar empleos
          </button>
        </form>

        <Link to="/trabajador/buscar" className="hero-ver-todos">
          ¿Prefieres explorar sin filtros? Ver todos los empleos
        </Link>
      </header>

      <div className="landing-cta">
        <p className="landing-cta-texto">¿Listo para dar tu primer paso?</p>
        <Link to="/trabajador/buscar" className="boton boton-secundario boton-grande">
          Ver todos los empleos
        </Link>
        <Link to="/registro?rol=trabajador" className="boton boton-primario boton-grande">
          Crear cuenta gratis
        </Link>
      </div>

      <section className="estadisticas">
        <h2 className="estadisticas-titulo">
          Nuestras cifras <strong>{mesActual}</strong>
        </h2>
        <div className="estadisticas-grid">
          <div className="estadistica">
            <span className="estadistica-numero">+{vacantes.length}</span>
            <span className="estadistica-etiqueta">vacantes activas</span>
          </div>
          <div className="estadistica">
            <span className="estadistica-numero">+{postulaciones.length}</span>
            <span className="estadistica-etiqueta">postulaciones registradas</span>
          </div>
          <div className="estadistica">
            <span className="estadistica-numero">+{DISTRITOS.length}</span>
            <span className="estadistica-etiqueta">distritos conectados</span>
          </div>
        </div>
      </section>

      <section className="seccion-distritos">
        <h2 className="estadisticas-titulo">
          Pulse sobre un distrito para acceder a las vacantes de su zona
        </h2>
        <div className="distritos-layout">
          <div className="mapa-zona">
            <div className="mapa-zona-icono">
              <IconoPin />
            </div>
            <h3 className="mapa-zona-titulo">Trabaja cerca de ti</h3>
            <p className="mapa-zona-texto">
              WorkHoy conecta empresas con trabajadores temporales en Lima Metropolitana,
              el Callao y sus alrededores. Sin moverte lejos de tu distrito.
            </p>
            <ul className="mapa-zona-lista">
              <li>Vacantes publicadas al instante</li>
              <li>Postula con un solo clic</li>
              <li>Calificaciones que generan confianza</li>
            </ul>
          </div>

          <div className="grid-distritos">
            {DISTRITOS.map((d) => (
              <Link key={d} to={'/trabajador/buscar?distrito=' + encodeURIComponent(d)} className="tarjeta-distrito">
                <span className="tarjeta-distrito-icono"><IconoPin /></span>
                <span className="tarjeta-distrito-nombre">{d}</span>
                <span className="tarjeta-distrito-enlace">Ver ofertas</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pasos">
        <h2 className="pasos-titulo">¿Cómo funciona?</h2>
        <div className="pasos-lista">
          <div className="paso">
            <span className="paso-numero">1</span>
            <h3>Regístrate gratis</h3>
            <p>Crea tu cuenta como empresa o como trabajador.</p>
          </div>
          <div className="paso">
            <span className="paso-numero">2</span>
            <h3>Publica o postula</h3>
            <p>Las empresas publican vacantes y los trabajadores postulan con un clic.</p>
          </div>
          <div className="paso">
            <span className="paso-numero">3</span>
            <h3>Conecta y trabaja</h3>
            <p>Coordina, trabaja el tiempo pactado y califica la experiencia.</p>
          </div>
        </div>
      </section>

      <section id="sobre-nosotros" className="sobre-nosotros">
        <h2 className="sobre-nosotros-titulo">Sobre nosotros</h2>
        <p className="sobre-nosotros-texto">
          WorkHoy nació para resolver el problema del empleo temporal en el Perú: las empresas
          encuentran personal confiable en cuestión de horas y los trabajadores acceden a
          oportunidades cerca de su distrito, sin papeleo ni agencias.
        </p>
        <div className="sobre-nosotros-tarjetas">
          <div className="sobre-nosotros-tarjeta">
            <span className="sobre-nosotros-tarjeta-icono"><IconoRayo /></span>
            <h3>Rápido y directo</h3>
            <p>
              Una empresa publica su vacante y un trabajador postula con un solo clic, sin
              intermediarios.
            </p>
          </div>
          <div className="sobre-nosotros-tarjeta">
            <span className="sobre-nosotros-tarjeta-icono"><IconoEstrella /></span>
            <h3>Confianza que se demuestra</h3>
            <p>
              Cada trabajo concluido se califica el desempeño con estrellas, para que ambos lados
              sepan con quién trabajarán.
            </p>
          </div>
          <div className="sobre-nosotros-tarjeta">
            <span className="sobre-nosotros-tarjeta-icono"><IconoPin /></span>
            <h3>Cerca de tu distrito</h3>
            <p>
              Filtra por ubicación y categoría: el trabajo está donde tú estás, no al otro lado de
              la ciudad.
            </p>
          </div>
          <div className="sobre-nosotros-tarjeta">
            <span className="sobre-nosotros-tarjeta-icono"><IconoDocumento /></span>
            <h3>Sin papeleo ni agencias</h3>
            <p>
              Publica o postula en minutos, sin currículums eternos ni intermediarios. Es gratis
              para los trabajadores.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}