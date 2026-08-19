import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUsuario } from '../../contexto/UsuarioContext';
import { useVacantes } from '../../contexto/VacantesContext';
import { CATEGORIAS } from '../../datos/datosIniciales';
import Boton from '../../componentes/Boton';
import BadgeEstado from '../../componentes/BadgeEstado';
import ModalConfirmacion from '../../componentes/ModalConfirmacion';
import DatosVacante from '../../componentes/DatosVacante';

function IconoInfo({ tipo }) {
  const base = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  if (tipo === 'calendario') {
    return (
      <svg {...base}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="8" y1="2" x2="8" y2="7" />
        <line x1="16" y1="2" x2="16" y2="7" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  if (tipo === 'maletin') {
    return (
      <svg {...base}>
        <rect x="3" y="8" width="18" height="12" rx="2" />
        <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      </svg>
    );
  }
  if (tipo === 'ubicacion') {
    return (
      <svg {...base}>
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  if (tipo === 'escudo') {
    return (
      <svg {...base}>
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
      </svg>
    );
  }
  if (tipo === 'moneda') {
    return (
      <svg {...base}>
        <circle cx="12" cy="12" r="9" />
        <line x1="9" y1="14" x2="15" y2="9" />
        <circle cx="12" cy="12" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (tipo === 'certificado') {
    return (
      <svg {...base}>
        <circle cx="12" cy="9" r="6" />
        <path d="M9 14l-2 7 5-3 5 3-2-7" />
      </svg>
    );
  }
  if (tipo === 'reloj') {
    return (
      <svg {...base}>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 14" />
      </svg>
    );
  }
  if (tipo === 'empresa') {
    return (
      <svg {...base}>
        <rect x="4" y="5" width="16" height="14" rx="1.5" />
        <path d="M9 19v-4h6v4" />
        <line x1="9" y1="9" x2="15" y2="9" />
      </svg>
    );
  }
  if (tipo === 'grupo') {
    return (
      <svg {...base}>
        <circle cx="9" cy="9" r="3.2" />
        <path d="M3.5 19c0-2.8 2.4-4.3 5.5-4.3s5.5 1.5 5.5 4.3" />
        <path d="M15 6.2a3.2 3.2 0 0 1 0 5.6" />
        <path d="M17.5 14.9c1.6.6 3 1.9 3 4.1" />
      </svg>
    );
  }
  if (tipo === 'estrellas') {
    return (
      <svg {...base}>
        <path d="M12 3l2.7 5.5 6.3.9-4.5 4.4 1 6.1-5.5-2.9-5.5 2.9 1-6.1L3 9.4l6.3-.9L12 3z" />
      </svg>
    );
  }
  return null;
}

function diasDesde(fechaISO) {
  const dias = Math.floor((Date.now() - new Date(fechaISO).getTime()) / 86400000);
  if (dias <= 0) return 'Hoy';
  if (dias === 1) return 'Hace 1 día';
  return 'Hace ' + dias + ' días';
}

export default function DetalleVacante() {
  const { id } = useParams();
  const { sesion, usuarios } = useUsuario();
  const { vacantes, postulaciones, calificaciones, postular } = useVacantes();
  const navigate = useNavigate();

  const [confirmarPostular, setConfirmarPostular] = useState(false);
  const [postulado, setPostulado] = useState(false);

  const vacante = vacantes.find((v) => v.id === id);

  if (!vacante) {
    return (
      <div className="pagina">
        <p className="alerta alerta-error">No se encontró la vacante.</p>
        <Link to="/trabajador/buscar" className="boton boton-secundario">
          Volver a buscar
        </Link>
      </div>
    );
  }

  const empresa = usuarios.find((u) => u.id === vacante.empresaId);
  const categoria = CATEGORIAS.find((c) => c.valor === vacante.categoria);
  const etiqueta = categoria ? categoria.etiqueta : vacante.categoria || 'Sin categoría';

  const miPostulacion = sesion
    ? postulaciones.find((p) => p.vacanteId === vacante.id && p.trabajadorId === sesion.id)
    : null;
  const yaPostulo = Boolean(miPostulacion);

  const vacantesActivas = vacantes.filter(
    (v) => v.empresaId === vacante.empresaId && v.estado === 'activa'
  ).length;

  let promedioEmpresa = 0;
  if (empresa) {
    const notas = calificaciones.filter((c) => c.aUsuarioId === empresa.id);
    if (notas.length > 0) {
      promedioEmpresa = Math.round((notas.reduce((t, c) => t + c.puntaje, 0) / notas.length) * 10) / 10;
    }
  }

  function confirmar() {
    if (!sesion) {
      navigate('/login');
      return;
    }
    postular(vacante.id, sesion.id);
    setConfirmarPostular(false);
    setPostulado(true);
  }

  const requisitos =
    vacante.requisitos && vacante.requisitos.length > 0
      ? vacante.requisitos
      : [
          'Disponibilidad inmediata',
          'Experiencia previa en ' + etiqueta.toLowerCase() + ' (deseable)',
          'Puntualidad y responsabilidad',
          'Conocer ' + vacante.distrito + ' y alrededores',
        ];

  return (
    <div className="pagina detalle-grid">
      <div className="detalle-contenido">
        <h1 className="titulo-pagina">{vacante.titulo}</h1>
        <p className="detalle-subtitulo">
          {empresa ? empresa.nombre : ''} · {vacante.distrito} · S/ {vacante.sueldo}/día ·{' '}
          {vacante.tipoContrato || 'Tiempo completo'}
        </p>

        <section className="detalle-seccion">
          <h2 className="detalle-seccion-titulo">Descripción del empleo</h2>
          <div
            className="detalle-descripcion"
            dangerouslySetInnerHTML={{ __html: vacante.descripcion }}
          />
        </section>

        <section className="detalle-seccion">
          <h2 className="detalle-seccion-titulo">Información del empleo</h2>
          <DatosVacante vacante={vacante} />
        </section>

        <section className="detalle-seccion">
          <h2 className="detalle-seccion-titulo">Requisitos</h2>
          <ul className="detalle-requisitos">
            {requisitos.map((r, i) => (
              <li key={i} className="detalle-requisito">
                {r}
              </li>
            ))}
          </ul>
        </section>

        {vacante.uniformidad && vacante.uniformidad.length > 0 && (
          <section className="detalle-seccion">
            <h2 className="detalle-seccion-titulo">Uniformidad</h2>
            <ul className="detalle-requisitos">
              {vacante.uniformidad.map((u, i) => (
                <li key={i} className="detalle-requisito">
                  {u}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <aside className="detalle-lateral">
        <div className="tarjeta-lateral">
          {vacante.estado === 'cerrada' ? (
            <Boton disabled>Vacante cerrada</Boton>
          ) : yaPostulo ? (
            <div className="postulacion-enviada">
              <BadgeEstado estado={miPostulacion ? miPostulacion.estado : 'pendiente'} />
              <span>Ya postulaste a esta vacante.</span>
            </div>
          ) : !sesion ? (
            <Boton tipo="primario" onClick={() => navigate('/login')}>
              Inicia sesión para postular
            </Boton>
          ) : (
            <Boton tipo="primario" onClick={() => setConfirmarPostular(true)}>
              Postular
            </Boton>
          )}
          {postulado && <p className="alerta alerta-exito">Postulación enviada correctamente.</p>}

          <ul className="lista-info">
            <li>
              <IconoInfo tipo="calendario" /> {diasDesde(vacante.fechaPublicacion)}
            </li>
            <li>
              <IconoInfo tipo="maletin" /> {vacante.tipoContrato || 'Tiempo completo'}
            </li>
            <li>
              <IconoInfo tipo="reloj" />{' '}
              {vacante.horarios && vacante.horarios.length > 0
                ? vacante.horarios.join(' y ')
                : vacante.horario}
            </li>
            <li>
              <IconoInfo tipo="moneda" />{' '}
              {vacante.pagoPorHora
                ? 'S/ ' + vacante.pagoPorHora + '/hora · S/ ' + (vacante.sueldo || 0) + '/turno'
                : vacante.sueldo
                  ? 'S/ ' + vacante.sueldo + '/día'
                  : 'Pago a convenir'}
            </li>
            <li>
              <IconoInfo tipo="ubicacion" /> Presencial, {vacante.distrito}
              {vacante.ubicacion ? ' – ' + vacante.ubicacion : ''}
            </li>
          </ul>
        </div>

        <div className="tarjeta-lateral">
          <div className="sobre-empresa-cabecera">
            {empresa && empresa.avatar ? (
              <img src={empresa.avatar} alt={empresa.nombre} className="avatar-img avatar-perfil" />
            ) : (
              <div className="avatar-fallback">
                {empresa && empresa.nombre ? empresa.nombre.charAt(0).toUpperCase() : 'E'}
              </div>
            )}
            <h3 className="tarjeta-lateral-titulo">
              {empresa ? empresa.nombre : 'Sobre la empresa'}
            </h3>
          </div>
          <p className="sobre-empresa-texto">
            {empresa && empresa.descripcion
              ? empresa.descripcion
              : empresa
                ? 'Contamos con amplia experiencia y nos aseguramos de brindar un buen ambiente laboral. Publicamos vacantes temporales constantemente en ' + empresa.distrito + '.'
                : ''}
          </p>
          {empresa && (
            <ul className="sobre-empresa-lista">
              <li>
                <IconoInfo tipo="empresa" />
                <span>{empresa.rubro || 'Sin rubro definido'}</span>
              </li>
              {empresa.desde && (
                <li>
                  <IconoInfo tipo="calendario" />
                  <span>
                    Operando desde {empresa.desde} ({new Date().getFullYear() - empresa.desde} años)
                  </span>
                </li>
              )}
              <li>
                <IconoInfo tipo="ubicacion" />
                <span>Sede en {empresa.distrito || 'Lima'}</span>
              </li>
              <li>
                <IconoInfo tipo="grupo" />
                <span>{empresa.colaboradores || 'Equipo pequeño'}</span>
              </li>
              <li>
                <IconoInfo tipo="maletin" />
                <span>
                  {vacantesActivas} vacante{vacantesActivas === 1 ? '' : 's'} activa
                  {vacantesActivas === 1 ? '' : 's'}
                </span>
              </li>
              <li>
                <IconoInfo tipo="estrellas" />
                <span>
                  {promedioEmpresa > 0 ? promedioEmpresa + ' / 5 en WorkHoy' : 'Aún sin calificaciones'}
                </span>
              </li>
              <li>
                <IconoInfo tipo="usuario" />
                <span>Contacto: {empresa.telefono || '—'}</span>
              </li>
            </ul>
          )}
          <span className="sobre-empresa-categoria">{etiqueta}</span>
        </div>
      </aside>

      <ModalConfirmacion
        abierto={confirmarPostular}
        titulo="Confirmar postulación"
        mensaje={`¿Quieres postular a "${vacante.titulo}" en ${vacante.distrito}?`}
        textoConfirmar="Sí, postular"
        onConfirmar={confirmar}
        onCancelar={() => setConfirmarPostular(false)}
      />
    </div>
  );
}