import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../../contexto/UsuarioContext';
import { useVacantes } from '../../contexto/VacantesContext';
import BadgeEstado from '../../componentes/BadgeEstado';
import EstadoVacio from '../../componentes/EstadoVacio';
import Boton from '../../componentes/Boton';
import ModalCalificar from '../../componentes/ModalCalificar';
import ModalConfirmacion from '../../componentes/ModalConfirmacion';
import Icono from '../../componentes/Icono';

function formatearFecha(fechaISO) {
  return new Date(fechaISO).toLocaleDateString('es-PE');
}

export default function MisPostulaciones() {
  const { sesion, usuarios } = useUsuario();
  const { postulaciones, vacantes, calificar, eliminarPostulacion } = useVacantes();
  const [aCalificar, setACalificar] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);

  const misPostulaciones = postulaciones
    .filter((p) => p.trabajadorId === sesion.id)
    .map((postulacion) => ({
      postulacion,
      vacante: vacantes.find((v) => v.id === postulacion.vacanteId),
    }));

  function enviarCalificacion(puntaje, comentario) {
    calificar(sesion.id, aCalificar.id, puntaje, comentario);
  }

  function confirmarEliminacion() {
    eliminarPostulacion(aEliminar.id);
    setAEliminar(null);
  }

  return (
    <div className="pagina">
      <div className="cabecera-pagina">
        <h1 className="titulo-pagina">Mis postulaciones</h1>
        <Link to="/trabajador/buscar" className="boton boton-primario">
          Nueva búsqueda
        </Link>
      </div>

      {misPostulaciones.length === 0 ? (
        <EstadoVacio mensaje="Todavía no has postulado a ninguna vacante." />
      ) : (
        <ul className="lista-postulaciones">
          {misPostulaciones.map(({ postulacion, vacante }) => {
            const empresa = vacante ? usuarios.find((u) => u.id === vacante.empresaId) : null;
            return (
              <li key={postulacion.id} className="item-postulacion">
                <div className="item-postulacion-info">
                  {empresa && empresa.avatar && (
                    <img src={empresa.avatar} alt={empresa.nombre} className="avatar-img avatar-mini" />
                  )}
                  <div>
                    <h3 className="item-vacante-titulo">{vacante ? vacante.titulo : 'Vacante'}</h3>
                    <p className="item-vacante-meta">
                      {empresa ? (
                        <>
                          <Icono tipo="empresa" />
                          <span>{empresa.nombre}</span>
                        </>
                      ) : null}
                      {vacante ? (
                        <>
                          <Icono tipo="pin" />
                          <span>{vacante.distrito}</span>
                        </>
                      ) : null}
                      <Icono tipo="calendario" />
                      <span>{formatearFecha(postulacion.fechaPostulacion)}</span>
                    </p>
                  </div>
                </div>
                <div className="item-postulacion-acciones">
                  <BadgeEstado estado={postulacion.estado} />
                  {vacante && (
                    <Link to={'/trabajador/vacantes/' + vacante.id} className="boton boton-secundario">
                      Ver vacante
                    </Link>
                  )}
                  {postulacion.estado === 'aceptado' && empresa && (
                    <Boton tipo="primario" onClick={() => setACalificar(empresa)}>
                      Calificar empresa
                    </Boton>
                  )}
                  <button className="boton boton-peligro" onClick={() => setAEliminar(postulacion)}>
                    Eliminar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ModalCalificar
        abierto={Boolean(aCalificar)}
        trabajador={aCalificar}
        titulo="Calificar a la empresa"
        placeholder="Escribe tus comentarios sobre tu experiencia con la empresa..."
        onEnviar={enviarCalificacion}
        onCerrar={() => setACalificar(null)}
      />

      <ModalConfirmacion
        abierto={Boolean(aEliminar)}
        titulo="Eliminar postulación"
        mensaje={`¿Seguro que quieres eliminar tu postulación a "${aEliminar ? (vacantes.find((v) => v.id === aEliminar.vacanteId)?.titulo || 'esta vacante') : ''}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Sí, eliminar"
        tipo="peligro"
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setAEliminar(null)}
      />
    </div>
  );
}