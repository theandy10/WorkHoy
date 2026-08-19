import { useState } from 'react';
import { useUsuario } from '../contexto/UsuarioContext';
import { useVacantes } from '../contexto/VacantesContext';
import { DISTRITOS } from '../datos/datosIniciales';
import Boton from '../componentes/Boton';

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-PE');
}

const anioActual = new Date().getFullYear();

export default function Perfil() {
  const { sesion, usuarios, actualizarPerfil } = useUsuario();
  const { calificaciones, promedioCalificaciones } = useVacantes();

  const [datos, setDatos] = useState({
    nombre: sesion.nombre,
    email: sesion.email,
    telefono: sesion.telefono,
    distrito: sesion.distrito,
    rubro: sesion.rubro || '',
    desde: sesion.desde || '',
    colaboradores: sesion.colaboradores || '',
    descripcion: sesion.descripcion || '',
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  function manejarCambio(campo, valor) {
    setDatos({ ...datos, [campo]: valor });
  }

  function manejarSubmit(e) {
    e.preventDefault();
    const correoEnUso = usuarios.some(
      (u) => u.id !== sesion.id && u.email.toLowerCase() === datos.email.trim().toLowerCase()
    );
    if (correoEnUso) {
      setMensaje('');
      setError('Ese correo ya está en uso por otra cuenta.');
      return;
    }
    if (datos.desde !== '' && (Number(datos.desde) < 1900 || Number(datos.desde) > anioActual)) {
      setMensaje('');
      setError('El año de inicio debe estar entre 1900 y ' + anioActual + '.');
      return;
    }
    actualizarPerfil({
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono,
      distrito: datos.distrito,
      rubro: datos.rubro,
      desde: datos.desde ? Number(datos.desde) : '',
      colaboradores: datos.colaboradores,
      descripcion: datos.descripcion,
    });
    setError('');
    setMensaje('Perfil actualizado correctamente.');
  }

  const misCalificaciones = calificaciones.filter((c) => c.aUsuarioId === sesion.id);
  const promedio = sesion.rol === 'trabajador' ? promedioCalificaciones(sesion.id) : 0;

  return (
    <div className="pagina">
      <h1 className="titulo-pagina">Mi perfil</h1>
      <div className="perfil-contenido">
        <form onSubmit={manejarSubmit} className="tarjeta-formulario">
          <div className="campo">
            <label className="campo-label" htmlFor="perfil-nombre">Nombre</label>
            <input id="perfil-nombre" className="input" value={datos.nombre} onChange={(e) => manejarCambio('nombre', e.target.value)} required />
          </div>
          <div className="campo">
            <label className="campo-label" htmlFor="perfil-email">Correo</label>
            <input id="perfil-email" className="input" type="email" value={datos.email} onChange={(e) => manejarCambio('email', e.target.value)} required />
          </div>
          <div className="campo">
            <label className="campo-label" htmlFor="perfil-telefono">Teléfono</label>
            <input id="perfil-telefono" className="input" value={datos.telefono} onChange={(e) => manejarCambio('telefono', e.target.value)} required />
          </div>
          <div className="campo">
            <label className="campo-label" htmlFor="perfil-distrito">Distrito</label>
            <select id="perfil-distrito" className="input" value={datos.distrito} onChange={(e) => manejarCambio('distrito', e.target.value)}>
              {DISTRITOS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {sesion.rol === 'empresa' && (
            <>
              <div className="campo">
                <label className="campo-label" htmlFor="perfil-rubro">Rubro o giro del negocio</label>
                <input
                  id="perfil-rubro"
                  className="input"
                  value={datos.rubro}
                  onChange={(e) => manejarCambio('rubro', e.target.value)}
                  placeholder="Ej: Logística y almacenaje"
                />
              </div>
              <div className="campo">
                <label className="campo-label" htmlFor="perfil-desde">Año de inicio de operaciones</label>
                <input
                  id="perfil-desde"
                  className="input"
                  type="number"
                  min="1900"
                  max={anioActual}
                  value={datos.desde}
                  onChange={(e) => manejarCambio('desde', e.target.value)}
                  placeholder="Ej: 2012"
                />
              </div>
              <div className="campo">
                <label className="campo-label" htmlFor="perfil-colaboradores">Colaboradores</label>
                <input
                  id="perfil-colaboradores"
                  className="input"
                  value={datos.colaboradores}
                  onChange={(e) => manejarCambio('colaboradores', e.target.value)}
                  placeholder="Ej: +200 colaboradores"
                />
              </div>
              <div className="campo publicar-campo-ancho">
                <label className="campo-label" htmlFor="perfil-descripcion">Descripción de la empresa</label>
                <textarea
                  id="perfil-descripcion"
                  className="input textarea"
                  rows="4"
                  value={datos.descripcion}
                  onChange={(e) => manejarCambio('descripcion', e.target.value)}
                  placeholder="Cuéntales a los trabajadores a qué se dedica tu empresa..."
                />
              </div>
            </>
          )}

          {error && <p className="alerta alerta-error">{error}</p>}
          {mensaje && <p className="alerta alerta-exito">{mensaje}</p>}
          <Boton tipo="primario" tipoBoton="submit">Guardar cambios</Boton>
        </form>

        {sesion.rol === 'trabajador' && (
          <aside className="tarjeta-perfil-calificaciones">
            <h2 className="tarjeta-titulo">Mis calificaciones</h2>
            <p className="perfil-promedio"><strong>{promedio}</strong> / 5</p>
            {misCalificaciones.length === 0 ? (
              <p className="texto-vacio">Aún no tienes calificaciones.</p>
            ) : (
              <ul className="lista-calificaciones">
                {misCalificaciones.map((c) => (
                  <li key={c.id} className="item-calificacion">
                    <div className="calificacion-fila">
                      <span className="calificacion-estrellas">{'\u2605'.repeat(c.puntaje)}</span>
                      <span className="calificacion-fecha">{formatearFecha(c.fecha)}</span>
                    </div>
                    <p className="calificacion-comentario">{c.comentario}</p>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}