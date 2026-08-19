import { Link } from 'react-router-dom';
import { useUsuario } from '../../contexto/UsuarioContext';
import { useVacantes } from '../../contexto/VacantesContext';
import BadgeEstado from '../../componentes/BadgeEstado';
import Icono from '../../componentes/Icono';

function formatearFecha(fechaISO) {
  return new Date(fechaISO).toLocaleDateString('es-PE');
}

export default function DashboardEmpresa() {
  const { sesion } = useUsuario();
  const { vacantes, postulaciones } = useVacantes();

  const misVacantes = vacantes.filter((v) => v.empresaId === sesion.id);
  const activas = misVacantes.filter((v) => v.estado === 'activa');
  const postulantesNuevos = postulaciones.filter(
    (p) => p.estado === 'pendiente' && misVacantes.some((v) => v.id === p.vacanteId)
  );
  const contrataciones = postulaciones.filter(
    (p) => p.estado === 'aceptado' && misVacantes.some((v) => v.id === p.vacanteId)
  );

  const recientes = [...misVacantes].sort(
    (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
  );

  return (
    <div className="pagina">
      <h1 className="titulo-pagina">Dashboard de {sesion.nombre}</h1>
      <div className="dashboard-metricas">
        <div className="tarjeta-metrica">
          <span className="metrica-valor">{activas.length}</span>
          <span className="metrica-etiqueta">Vacantes activas</span>
        </div>
        <div className="tarjeta-metrica">
          <span className="metrica-valor">{postulantesNuevos.length}</span>
          <span className="metrica-etiqueta">Postulantes nuevos</span>
        </div>
        <div className="tarjeta-metrica">
          <span className="metrica-valor">{contrataciones.length}</span>
          <span className="metrica-etiqueta">Contrataciones</span>
        </div>
      </div>

      <div className="dashboard-seccion">
        <div className="dashboard-seccion-fila">
          <h2 className="tarjeta-titulo">Vacantes recientes</h2>
          <Link to="/empresa/publicar" className="boton boton-primario">
            Publicar nueva vacante
          </Link>
        </div>
        {recientes.length === 0 ? (
          <p className="texto-vacio">Todavía no has publicado vacantes.</p>
        ) : (
          <ul className="lista-vacantes">
            {recientes.map((v) => (
              <li key={v.id} className="item-vacante">
                <div className="item-vacante-info">
                  <h3 className="item-vacante-titulo">{v.titulo}</h3>
                  <p className="item-vacante-meta">
                    <Icono tipo="pin" />
                    <span>{v.distrito}</span>
                    <Icono tipo="moneda" />
                    <span>
                      {v.pagoPorHora
                        ? 'S/ ' + v.pagoPorHora + '/hora'
                        : v.sueldo
                          ? 'S/ ' + v.sueldo + '/día'
                          : 'A convenir'}
                    </span>
                    <Icono tipo="reloj" />
                    <span>Publicada {formatearFecha(v.fechaPublicacion)}</span>
                  </p>
                </div>
                <div className="item-vacante-acciones">
                  <BadgeEstado estado={v.estado} />
                  <Link to={'/empresa/vacantes/' + v.id} className="boton boton-secundario">
                    Ver detalle
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}