import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../../contexto/UsuarioContext';
import { useVacantes } from '../../contexto/VacantesContext';
import BadgeEstado from '../../componentes/BadgeEstado';
import Boton from '../../componentes/Boton';
import EstadoVacio from '../../componentes/EstadoVacio';
import ModalConfirmacion from '../../componentes/ModalConfirmacion';
import Icono from '../../componentes/Icono';

export default function MisVacantes() {
  const { sesion } = useUsuario();
  const { vacantes, postulaciones, cerrarVacante } = useVacantes();

  const [filtro, setFiltro] = useState('todas');
  const [vacanteACerrar, setVacanteACerrar] = useState(null);

  const misVacantes = vacantes
    .filter((v) => v.empresaId === sesion.id)
    .filter((v) => filtro === 'todas' || v.estado === filtro);

  function manejarCerrar() {
    cerrarVacante(vacanteACerrar.id);
    setVacanteACerrar(null);
  }

  return (
    <div className="pagina">
      <h1 className="titulo-pagina">Mis vacantes</h1>

      <div className="filtro-estado">
        <button className={filtro === 'todas' ? 'filtro-activo' : ''} onClick={() => setFiltro('todas')}>
          Todas
        </button>
        <button className={filtro === 'activa' ? 'filtro-activo' : ''} onClick={() => setFiltro('activa')}>
          Activas
        </button>
        <button className={filtro === 'cerrada' ? 'filtro-activo' : ''} onClick={() => setFiltro('cerrada')}>
          Cerradas
        </button>
      </div>

      {misVacantes.length === 0 ? (
        <EstadoVacio mensaje="No hay vacantes con este estado." />
      ) : (
        <ul className="lista-vacantes">
          {misVacantes.map((v) => {
            const postulantesDeVacante = postulaciones.filter((p) => p.vacanteId === v.id);
            const totalPostulantes = postulantesDeVacante.length;
            const pendientes = postulantesDeVacante.filter((p) => p.estado === 'pendiente').length;
            return (
              <li key={v.id} className="vacante-card-admin">
                <div className="vacante-card-admin-info">
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
                    <Icono tipo="usuario" />
                    <span>
                      {totalPostulantes} postulante{totalPostulantes === 1 ? '' : 's'}
                    </span>
                  </p>
                  {v.estado === 'activa' && totalPostulantes === 0 && (
                    <p className="alerta alerta-info vacante-aviso">
                      Aún no recibes postulaciones. Considera promocionar la vacante.
                    </p>
                  )}
                  {v.estado === 'activa' && pendientes > 0 && (
                    <p className="alerta alerta-info vacante-aviso">
                      Tienes {pendientes} postulante{pendientes === 1 ? '' : 's'} por revisar.
                    </p>
                  )}
                </div>
                <div className="item-vacante-acciones">
                  <BadgeEstado estado={v.estado} />
                  <div className="card-acciones">
                    <Link to={'/empresa/vacantes/' + v.id} className="boton boton-secundario">
                      Ver postulantes
                    </Link>
                    {v.estado === 'activa' && (
                      <Link to={'/empresa/editar/' + v.id} className="boton boton-secundario">
                        Editar
                      </Link>
                    )}
                    {v.estado === 'activa' && (
                      <button className="boton boton-peligro" onClick={() => setVacanteACerrar(v)}>
                        Cerrar
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ModalConfirmacion
        abierto={Boolean(vacanteACerrar)}
        titulo="Cerrar vacante"
        mensaje={`¿Seguro que quieres cerrar la vacante "${vacanteACerrar?.titulo}"? No recibirás más postulaciones.`}
        textoConfirmar="Sí, cerrar"
        tipo="peligro"
        onConfirmar={manejarCerrar}
        onCancelar={() => setVacanteACerrar(null)}
      />
    </div>
  );
}