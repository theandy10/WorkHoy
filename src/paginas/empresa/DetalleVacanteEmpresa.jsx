import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUsuario } from '../../contexto/UsuarioContext';
import { useVacantes } from '../../contexto/VacantesContext';
import { CATEGORIAS } from '../../datos/datosIniciales';
import BadgeEstado from '../../componentes/BadgeEstado';
import Boton from '../../componentes/Boton';
import ModalConfirmacion from '../../componentes/ModalConfirmacion';
import ModalCalificar from '../../componentes/ModalCalificar';
import DatosVacante from '../../componentes/DatosVacante';
import iconoVacio from '../../recursos/iconos/vacio.svg';

function formatearFecha(fechaISO) {
  return new Date(fechaISO).toLocaleDateString('es-PE');
}

export default function DetalleVacanteEmpresa() {
  const { id } = useParams();
  const { sesion, usuarios } = useUsuario();
  const { vacantes, postulaciones, calificaciones, actualizarEstadoPostulacion, cerrarVacante, calificar, promedioCalificaciones } = useVacantes();

  const [postulacionARechazar, setPostulacionARechazar] = useState(null);
  const [vacanteACerrar, setVacanteACerrar] = useState(false);
  const [aCalificar, setACalificar] = useState(null);

  const vacante = vacantes.find((v) => v.id === id);

  if (!vacante) {
    return null;
  }

  if (vacante.empresaId !== sesion.id) {
    return null;
  }

  const categoria = CATEGORIAS.find((c) => c.valor === vacante.categoria);
  const etiqueta = categoria ? categoria.etiqueta : vacante.categoria || 'Sin categoría';

  const postulantes = postulaciones
    .filter((p) => p.vacanteId === vacante.id)
    .map((postulacion) => ({
      postulacion,
      trabajador: usuarios.find((u) => u.id === postulacion.trabajadorId),
      promedio: promedioCalificaciones(postulacion.trabajadorId),
    }));

  function manejarEstado(postulacionId, nuevoEstado) {
    actualizarEstadoPostulacion(postulacionId, nuevoEstado);
  }

  function aceptarYCalificar(postulacion, trabajador) {

    manejarEstado(postulacion.id, 'aceptado');
    abrirCalificar(postulacion, trabajador);
  }

  function confirmarRechazo() {
    manejarEstado(postulacionARechazar.id, 'rechazado');
    setPostulacionARechazar(null);
  }

  function confirmarCierre() {
    cerrarVacante(vacante.id);
    setVacanteACerrar(false);
  }

  function enviarCalificacion(puntaje, comentario) {
    calificar(sesion.id, aCalificar.trabajador.id, puntaje, comentario);
  }

  function abrirCalificar(postulacion, trabajador) {
    setACalificar({ postulacion, trabajador });
  }

  return (
    <div className="pagina">
      <div className="cabecera-pagina">
        <h1 className="titulo-pagina">{vacante.titulo}</h1>
        {vacante.estado === 'activa' && (
          <Boton tipo="peligro" onClick={() => setVacanteACerrar(true)}>
            Cerrar vacante
          </Boton>
        )}
      </div>

      <div className="detalle-grid">
        <div className="detalle-contenido">
          <h2 className="tarjeta-titulo">Postulantes para esta vacante ({postulantes.length})</h2>
          {postulantes.length === 0 ? (
            <div className="sin-postulantes">
              <img src={iconoVacio} alt="Sin postulantes" />
              <p className="sin-postulantes-titulo">Aún no hay postulantes</p>
              <p className="sin-postulantes-texto">
                Cuando un trabajador se postule a esta vacante, aparecerá aquí con su perfil,
                valoración y estado.
              </p>
            </div>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla-postulantes">
                <thead>
                  <tr>
                    <th>Postulante</th>
                    <th>Valoración</th>
                    <th>Fecha de postulación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {postulantes.map(({ postulacion, trabajador, promedio }) => (
                    <tr key={postulacion.id}>
                      <td>
                        <div className="celda-usuario">
                          {trabajador && trabajador.avatar ? (
                            <img src={trabajador.avatar} alt={trabajador.nombre} className="avatar-img avatar-mini" />
                          ) : (
                            <div className="avatar-fallback avatar-mini">
                              {trabajador && trabajador.nombre ? trabajador.nombre.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div>
                            <strong>{trabajador ? trabajador.nombre : 'Usuario'}</strong>
                            <br />
                            <span className="celda-secundaria">{trabajador ? trabajador.distrito : ''}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {promedio > 0 ? (
                          <span>{'\u2605'} {promedio} / 5</span>
                        ) : (
                          <span className="celda-secundaria">Sin calificaciones</span>
                        )}
                      </td>
                      <td>{formatearFecha(postulacion.fechaPostulacion)}</td>
                      <td><BadgeEstado estado={postulacion.estado} /></td>
                      <td>
                        <div className="fila-acciones">
                          {postulacion.estado === 'pendiente' || postulacion.estado === 'revisado' ? (
                            <>
                              <Boton onClick={() => aceptarYCalificar(postulacion, trabajador)}>
                                Aceptar
                              </Boton>
                              <Boton tipo="peligro" onClick={() => setPostulacionARechazar(postulacion)}>
                                Rechazar
                              </Boton>
                            </>
                          ) : postulacion.estado === 'aceptado' ? (
                            <Boton tipo="primario" onClick={() => abrirCalificar(postulacion, trabajador)}>
                              Calificar
                            </Boton>
                          ) : (
                            <span className="celda-secundaria">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="detalle-lateral">
          <div className="tarjeta-lateral">
            <h3 className="tarjeta-lateral-titulo">Detalles de la vacante</h3>
            <DatosVacante vacante={vacante} />
            <p className="item-vacante-meta lateral-fecha">
              <span>
                Publicado el {formatearFecha(vacante.fechaPublicacion)} · Estado:{' '}
              </span>
              <BadgeEstado estado={vacante.estado} />
            </p>
          </div>

          <div className="tarjeta-lateral">
            <h3 className="tarjeta-lateral-titulo">Descripción</h3>
            <div
              className="detalle-descripcion"
              dangerouslySetInnerHTML={{ __html: vacante.descripcion }}
            />

            <h3 className="tarjeta-lateral-titulo lateral-seccion-titulo">Requisitos</h3>
            <ul className="detalle-requisitos">
              {(vacante.requisitos && vacante.requisitos.length > 0
                ? vacante.requisitos
                : [
                    'Disponibilidad inmediata',
                    'Experiencia previa en ' + etiqueta.toLowerCase() + ' (deseable)',
                    'Puntualidad y responsabilidad',
                    'Conocer ' + vacante.distrito + ' y alrededores',
                  ]
              ).map((r, i) => (
                <li key={i} className="detalle-requisito">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <ModalConfirmacion
        abierto={Boolean(postulacionARechazar)}
        titulo="Rechazar postulación"
        mensaje={`¿Seguro que quieres rechazar la postulación de ${postulacionARechazar ? 'este trabajador' : ''}?`}
        textoConfirmar="Sí, rechazar"
        tipo="peligro"
        onConfirmar={confirmarRechazo}
        onCancelar={() => setPostulacionARechazar(null)}
      />

      <ModalConfirmacion
        abierto={vacanteACerrar}
        titulo="Cerrar vacante"
        mensaje={`¿Seguro que quieres cerrar "${vacante.titulo}"?`}
        textoConfirmar="Sí, cerrar"
        tipo="peligro"
        onConfirmar={confirmarCierre}
        onCancelar={() => setVacanteACerrar(false)}
      />

      <ModalCalificar
        abierto={aCalificar}
        trabajador={aCalificar ? aCalificar.trabajador : null}
        onEnviar={enviarCalificacion}
        onCerrar={() => setACalificar(null)}
      />
    </div>
  );
}