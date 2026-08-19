import iconoVacio from '../recursos/iconos/vacio.svg';

export default function EstadoVacio({ mensaje }) {
  return (
    <div className="estado-vacio">
      <img src={iconoVacio} alt="Sin resultados" />
      <p>{mensaje}</p>
    </div>
  );
}