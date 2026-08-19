const COLORES = {
  pendiente: 'amarillo',
  revisado: 'azul',
  aceptado: 'verde',
  rechazado: 'rojo',
  activa: 'verde',
  cerrada: 'rojo',
  borrador: 'gris',
};

export default function BadgeEstado({ estado }) {
  const color = COLORES[estado] || 'gris';
  const etiqueta = {
    activa: 'Activa',
    cerrada: 'Cerrada',
    borrador: 'Borrador',
  }[estado] || estado;
  return <span className={'badge-estado badge-' + color}>{etiqueta}</span>;
}