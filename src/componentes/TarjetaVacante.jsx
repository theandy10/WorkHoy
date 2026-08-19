import Boton from './Boton';
import Icono from './Icono';
import { CATEGORIAS } from '../datos/datosIniciales';

function tiempoPublicado(fechaISO) {
  if (!fechaISO) return '';
  const dias = Math.floor((Date.now() - new Date(fechaISO).getTime()) / 86400000);
  if (dias <= 0) return 'Hoy';
  if (dias === 1) return 'Ayer';
  if (dias > 30) return 'Hace más de un mes';
  return 'Hace ' + dias + ' días';
}

export default function TarjetaVacante({ vacante, empresaNombre, empresaAvatar, onVer, onPostular, yaPostulo }) {
  const categoria = CATEGORIAS.find((c) => c.valor === vacante.categoria);
  const etiqueta = categoria ? categoria.etiqueta : vacante.categoria || 'Sin categoría';
  const pago = vacante.pagoPorHora
    ? 'S/ ' + vacante.pagoPorHora + '/hora'
    : vacante.sueldo
      ? 'S/ ' + vacante.sueldo + '/día'
      : 'A convenir';
  const horario =
    vacante.horarios && vacante.horarios.length > 0 ? vacante.horarios[0] : vacante.horario;

  return (
    <article className="tarjeta-vacante">
      <div className="tarjeta-vacante-cabecera">
        <div className="tarjeta-vacante-icono">
          {empresaAvatar ? (
            <img src={empresaAvatar} alt={empresaNombre || 'Empresa'} className="avatar-img" />
          ) : empresaNombre ? (
            empresaNombre.charAt(0).toUpperCase()
          ) : (
            'W'
          )}
        </div>
        <div className="tarjeta-vacante-info">
          <h3 className="tarjeta-vacante-titulo">{vacante.titulo}</h3>
          <span className="tarjeta-vacante-empresa">{empresaNombre}</span>
        </div>
        <span className="tarjeta-vacante-categoria">{etiqueta}</span>
      </div>
      <ul className="tarjeta-vacante-meta">
        <li>
          <Icono tipo="pin" />
          <span>{vacante.distrito}</span>
        </li>
        <li>
          <Icono tipo="moneda" />
          <span>{pago}</span>
        </li>
        <li>
          <Icono tipo="reloj" />
          <span>{horario}</span>
        </li>
      </ul>
      <div className="tarjeta-vacante-pie">
        <span>Publicado {tiempoPublicado(vacante.fechaPublicacion)}</span>
        <div className="tarjeta-vacante-acciones">
          <Boton tipo="secundario" onClick={() => onVer(vacante)}>
            Ver detalle
          </Boton>
          {yaPostulo ? (
            <Boton disabled>Ya postulaste</Boton>
          ) : onPostular ? (
            <Boton tipo="primario" onClick={() => onPostular(vacante)}>
              Postular
            </Boton>
          ) : null}
        </div>
      </div>
    </article>
  );
}